// https://github.com/sindresorhus/p-debounce
const pDebounce = (fn, wait, options = {}) => {
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }

  let leadingValue;
  let timeout;
  let resolveList = [];

  return function (...arguments_) {
    return new Promise((resolve) => {
      const shouldCallNow = options.before && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        timeout = null;

        const result = options.before
          ? leadingValue
          : fn.apply(this, arguments_);

        for (resolve of resolveList) {
          resolve(result);
        }

        resolveList = [];
      }, wait);

      if (shouldCallNow) {
        leadingValue = fn.apply(this, arguments_);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
};

pDebounce.promise = (function_) => {
  let currentPromise;

  return async function (...arguments_) {
    if (currentPromise) {
      return currentPromise;
    }

    try {
      currentPromise = function_.apply(this, arguments_);
      return await currentPromise;
    } finally {
      currentPromise = undefined;
    }
  };
};

(function ($) {
  "use strict";

  const pluginName = "jExt_autocomplete";

  /**
   * jQuery Autocomplete Plugin
   * @param {HTMLElement} element - The element to apply the autocomplete functionality to.
   * @param {Object} options - The plugin options.
   */
  function Autocomplete(element, options) {
    this.element = element;
    this.settings = $.extend({}, Autocomplete.defaults, options);

    this.$inputField;
    this.$clearButton;
    this.$suggestionContainer;
    this.isSuggestionOpen = false;
    this.selectedSuggestionIdx = -1;
    this.queryResult;

    this.debouncedHandleInputChanged = pDebounce(
      this.handleInputChanged,
      this.settings.debounceDelay
    );

    this.init();
  }

  // Default plugin options
  Autocomplete.defaults = {
    // The URL endpoint for fetching autocomplete suggestions
    endpointURL: new URL(
      "https://gis1.esn.at/api/rest/search/elastic_allgemein@ccgis_default,elastic_waerme@ccgis_default?c=query"
    ),
    // The minimum number of characters required to trigger autocomplete suggestions
    minChars: 3,
    // The maximum number of characters allowed for the input field
    maxChars: Number.MAX_SAFE_INTEGER,
    // The maximum number of autocomplete suggestions to display
    maxResults: Number.MAX_SAFE_INTEGER,
    // The placeholder text for the input field
    inputFieldPlaceholder: "",
    // Indicates whether to display a clear button for clearing the input field
    useClearButton: true,
    // A custom callback function for rendering each autocomplete suggestion
    customRenderCallback: $.noop,
    // A callback function to be executed when an autocomplete suggestion is selected
    onItemSelected: $.noop,
    // A callback function to be executed when an autocomplete suggestion is submitted
    onItemSubmited: $.noop,
    // An array of strings containing the specific suggestions
    data: null,
    // A custom callback function for filtering the suggestion candidates
    customDataFilterCallback: $.noop,
    // Indicates whether to highlight the matched characters in the autocomplete suggestions.
    highlight: false,
    // A custom callback function to be executed when an autocomplete suggestion is rendererd
    customHighlightCallback: $.noop,
    // Indicates whether to debounce the autocomplete suggestions fetch.
    debounce: false,
    // The delay in milliseconds before fetching autocomplete suggestions.
    debounceDelay: 500,
    // Specifies the threshold of the viewport height that the lower boundary of the GUI should not exceed.
    // If the autocomplete GUI surpasses this threshold, its suggestion container will be resized,
    // and a scrollbar will be displayed to handle the overflow.
    yThresholdViewport: 100,
  };

  Autocomplete.prototype = {
    /**
     * Initialize the autocomplete plugin.
     */
    init: function () {
      var $elem = $(this.element);

      // Create input controls container
      const $controls = $("<div>").addClass("controls").appendTo($elem);

      // Create input field
      this.$inputField = $("<input>")
        .attr("name", "term")
        // Disable the default browser autocomplete behaviour. It might interfere with ours.
        .attr("autocomplete", "off")
        .attr("placeholder", this.settings.inputFieldPlaceholder)
        .attr("minlength", this.settings.minChars)
        .attr("maxlength", this.settings.maxChars)
        .addClass("term")
        .appendTo($controls);

      // Create clear button if enabled
      if (this.settings.useClearButton) {
        this.$clearButton = $("<span>")
          .addClass("clear")
          .text("×")
          .appendTo($controls);
      }

      // Create suggestion container
      this.$suggestionContainer = $("<ul>")
        .addClass("suggestions")
        .css("display", "none")
        .appendTo($elem);

      $elem.css({
        "max-height": `calc(${this.settings.yThresholdViewport}vh - ${
          $elem.offset().top
        }px)`,
      });

      this.bindEvents();
    },

    /**
     * Bind event handlers for input field and clear button.
     */
    bindEvents: function () {
      // If the bindEvents function is called multiple times (e.g., when reinitializing the plugin),
      // duplicate event handlers will be attached to the elements, causing unexpected behavior.
      // To address this, we unbind all event handlers before binding new event handlers to remove
      // any previous event bindings.
      this.unbindEvents();

      // Restrict/debounce typing events to relive the enpoint API
      if (this.settings.debounce) {
        this.$inputField.on(
          "input",
          this.debouncedHandleInputChanged.bind(this)
        );
      } else {
        this.$inputField.on("input", this.handleInputChanged.bind(this));
      }

      this.$inputField.on("focus", this.handleFocusChanged.bind(this));
      this.$inputField.on("blur", this.handleBlurChanged.bind(this));
      this.$inputField.on("keydown", this.handleKeyDown.bind(this));

      if (this.settings.useClearButton) {
        this.$clearButton.on("mousedown", this.clearComponent.bind(this));
      }
    },

    /**
     * Unbind event handlers for input field and clear button.
     */
    unbindEvents: function () {
      this.$inputField.off();

      if (this.settings.useClearButton) {
        this.$clearButton.off();
      }
    },

    // ----------------------------------------------------------
    // Event handlers
    // ----------------------------------------------------------

    /**
     * Handle focus event on the input field.
     */
    handleFocusChanged: function () {
      this.$suggestionContainer.parent().addClass("focused");
      this.openSuggestions();
    },

    /**
     * Handle blur event on the input field.
     */
    handleBlurChanged: function () {
      this.$suggestionContainer.parent().removeClass("focused");
      this.closeSuggestions();
    },

    /**
     * Handle input change event on the input field.
     */
    handleInputChanged: async function () {
      const term = this.$inputField.val();
      const termLen = term.length;

      this.clearSuggestions();

      // Check if input length meets the minimum and maximum character requirements
      if (
        termLen < this.settings.minChars ||
        termLen > this.settings.maxChars
      ) {
        return;
      }

      let result;
      if (this.settings.data) {
        const cb = (
          this.settings.customDataFilterCallback !== $.noop
            ? this.settings.customDataFilterCallback
            : this.defaultDataFilterCallback
        ).bind(this);
        result = cb(term, this.settings.data);
      } else {
        result = await this.fetchSuggestions(term);
      }

      // To avoid rendering the debounced results multiple times, this guard ensures
      // that the rendering process is only performed once for the latest debounced result.
      if (result == this.queryResult) {
        return;
      }

      this.queryResult = result;

      // this.clearSuggestions();
      this.renderSuggestions(term, this.queryResult);
      this.openSuggestions();
    },

    /**
     * Handle keydown event on the input field.
     * @param {Event} e - The keydown event.
     */
    handleKeyDown: function (e) {
      if (!this.queryResult) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault();

          const nextIdx =
            e.key === "ArrowDown"
              ? this.selectedSuggestionIdx + 1
              : this.selectedSuggestionIdx - 1;

          // Ensure the selected index is within the valid range
          if (nextIdx < 0 || nextIdx > this.queryResult.length - 1) {
            return;
          }

          this.selectSuggestionByIdx(nextIdx);
          this.selectedSuggestionIdx = nextIdx;

          // Enable scrolling to position only when the up/down arrows are pressed,
          // preventing unintended scrolling when the mouse is hovered over the suggestions.
          this.scrollToSuggestion(
            this.getSuggestionByIdx(this.selectedSuggestionIdx)
          );
          break;
        case "Escape":
          this.closeSuggestions();
          break;
        case "Enter":
          e.preventDefault();

          var $selectedSuggestion = $("li.selected", this.$suggestionContainer);
          this.submitSuggestion($selectedSuggestion);
          break;
      }
    },

    /**
     * Handle mouseenter event on the suggestion item.
     * @param {Event} e - The mouseenter event.
     */
    handleSuggestionMouseEnter: function (e) {
      const $elem = $(e.target);
      this.selectedSuggestionIdx = this.getIdxBySuggestion($elem);
      this.selectSuggestion($elem);
    },

    /**
     * Handle mouseleave event on the suggestion item.
     * @param {Event} e - The mouseleave event.
     */
    handleSuggestionMouseLeave: function (e) {
      //   const $elem = $(e.target);
      //   this.selectedSuggestionIdx = this.getIdxBySuggestion($elem);
      //   this.selectSuggestion($elem);
      return;
    },

    handleSuggestionClicked: function (e) {
      const $elem = $(e.target);
      if ($elem === this.$suggestionContainer) {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();

      this.submitSuggestion($elem);
    },

    // ----------------------------------------------------------
    // Default callbacks
    // ----------------------------------------------------------

    /**
     * Default render callback function.
     * Renders the HTML representation of an autocomplete suggestion item.
     *
     * @param {jQuery} $container - The jQuery object representing the container element for the suggestion item.
     * @param {Object} item - The suggestion item object.
     * @param {string} term - The search term associated with the suggestion.
     */

    defaultRenderCallback: function ($container, item, term) {
      let cb;
      if (this.settings.highlight) {
        cb = (
          this.settings.customHighlightCallback !== $.noop
            ? this.settings.customHighlightCallback
            : this.defaultHighlightCallback
        ).bind(this);
      } else {
        cb = (x, y) => y;
      }

      //$container.html(cb(term, item.value));
      $container.append(cb(term, item.value));
    },

    /**
     * Default data filter callback function.
     * Filters the suggestion candidates based on the search term.
     *
     * @param {string} term - The search term to filter the data.
     * @param {Array} data - An array of strings containing the suggestion candidates.
     * @returns {Array} - An array of filtered suggestion objects.
     */
    defaultDataFilterCallback: function (term, data) {
      const result = [];
      for (const s of data) {
        if (!s.startsWith(term) && !s.includes(term)) {
          continue;
        }
        result.push({ value: s });
      }
      return result;
    },

    /**
     * Default highlight callback function.
     * Highlights the search term in the source string.
     *
     * @param {string} term - The search term to be highlighted.
     * @param {string} sourceStr - The source string in which to highlight the search term.
     * @returns {jQuery} - A jQuery object containing the highlighted HTML.
     */
    defaultHighlightCallback: function (term, sourceStr) {
      // return sourceStr
      //   .split(new RegExp(term, "gi"))
      //   .join(`<span class="highlight">${term}</span>`);

      const $elem = $("<div>");
      const parts = sourceStr.split(new RegExp(term, "gi"));
      for (const [idx, part] of parts.entries()) {
        // Right now, jExtend is not able to append raw text
        // to a parent element. We have to wrap our text into
        // a span element.
        $elem.append($("<span>").text(part));
        if (idx < parts.length - 1) {
          // Our regex for highlighting is case-insensitive,
          // which means that the input field value may be in lowercase
          // while the corresponding part in the source string is in uppercase.
          // We utilize the original case from the data provider.
          const sourceTerm = sourceStr.substring(
            part.length,
            part.length + term.length
          );
          $elem.append($("<span>").addClass("highlight").text(sourceTerm));
        }
      }
      return $elem;
    },

    // ----------------------------------------------------------
    // UI logic
    // ----------------------------------------------------------

    /**
     * Open the suggestion dropdown.
     */
    openSuggestions: function () {
      if (this.isSuggestionOpen) {
        return;
      }

      // We use the "mousedown" event instead of the "click" event because the "mousedown" event
      // is triggered when the mouse button is pressed down, while the "click" event is triggered
      // when the mouse button is released. In our case, the "blur" event is fired before the "click" event,
      // which means that the suggestion container is closed before the "click" event can trigger.
      // By using the "mousedown" event, we ensure that the suggestion container remains open and the
      // blur event might close the suggestion menu.
      this.$suggestionContainer.on(
        "mousedown",
        this.handleSuggestionClicked.bind(this)
      );
      this.$suggestionContainer.css("display", "unset");
      this.isSuggestionOpen = true;

      this.$inputField.trigger("input");
    },

    /**
     * Clear the suggestions from the UI.
     */
    clearSuggestions: function () {
      this.$suggestionContainer.empty();
    },

    /**
     * Close the suggestion dropdown.
     */
    closeSuggestions: function () {
      if (!this.isSuggestionOpen) {
        return;
      }

      this.$suggestionContainer.off(
        "mousedown",
        this.handleSuggestionClicked.bind(this)
      );
      this.$suggestionContainer.css("display", "none");
      this.isSuggestionOpen = false;
      this.selectedSuggestionIdx = -1;
      this.clearSuggestions();
    },

    /**
     * Fetch suggestions from the server based on the given term.
     * @param {string} term - The search term.
     * @returns {Promise<Array>} - A promise that resolves to an array of suggestions.
     */
    fetchSuggestions: async function (term) {
      try {
        const url = this.settings.endpointURL;
        url.searchParams.set("term", term);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Network response was not OK");
        }

        const result = await response.json();
        return result.splice(0, this.settings.maxResults);
      } catch (error) {
        console.error("There was a problem with the fetch operation", error);
      }
    },

    /**
     * Render the suggestions on the UI.
     * @param {Array} data - The array of suggestions to render.
     */
    renderSuggestions: function (term, data) {
      const cb = (
        this.settings.customRenderCallback !== $.noop
          ? this.settings.customRenderCallback
          : this.defaultRenderCallback
      ).bind(this);

      for (const item of data) {
        const $itemContainer = $("<li>");

        $itemContainer
          .on("mouseenter", this.handleSuggestionMouseEnter.bind(this))
          .on("mouseleave", this.handleSuggestionMouseLeave.bind(this));

        $itemContainer.data("item-data", item);
        $itemContainer.appendTo(this.$suggestionContainer);

        try {
          cb($itemContainer, item, term);
        } catch (error) {
          console.error("Error processing render call for item", item, error);
        }
      }
    },

    /**
     * Submit the selected suggestion.
     * @param {jQuery} $elem - The selected suggestion element.
     */
    submitSuggestion: function ($elem) {
      const data = $elem.data("item-data");
      this.$inputField.val(data.value);
      this.closeSuggestions();

      if (this.settings.onItemSubmited !== $.noop) {
        this.settings.onItemSubmited(data);
      }
    },

    /**
     * Selects an autocomplete suggestion item.
     *
     * @param {jQuery} $elem - The jQuery object representing the selected suggestion item.
     */
    selectSuggestion: function ($elem) {
      $elem.addClass("selected").siblings().removeClass("selected");

      if (this.settings.onItemSelected !== $.noop) {
        this.settings.onItemSelected($elem.data("item-data"));
      }
    },

    /**
     * Select a suggestion by its index.
     * @param {number} idx - The index of the suggestion.
     */
    selectSuggestionByIdx: function (idx) {
      const $elem = this.getSuggestionByIdx(idx);
      this.selectSuggestion($elem);
    },

    /**
     * Get the suggestion element by its index.
     * @param {number} idx - The index of the suggestion.
     * @returns {jQuery} - The suggestion element.
     */
    getSuggestionByIdx: function (idx) {
      return $(this.$suggestionContainer.children()[idx]);
    },

    /**
     * Get the index of a suggestion element.
     * @param {jQuery} $elem - The suggestion element.
     * @returns {number} - The index of the suggestion.
     */
    getIdxBySuggestion: function ($elem) {
      return this.$suggestionContainer.children().index($elem);
    },

    scrollToSuggestion: function ($elem) {
      this.$suggestionContainer[0].scrollTop =
        $elem.position().top -
        $("li:first", this.$suggestionContainer).position().top;
    },

    /**
     * Clear the autocomplete component.
     */
    clearComponent: function () {
      this.$inputField.val("");
      this.closeSuggestions();
    },
  };

  // Register the plugin
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      new Autocomplete(this, options);
    });
  };
})(jExt);
