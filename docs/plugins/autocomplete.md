# Usage Examples

## Example 1: Basic Autocomplete

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Autocomplete Example</title>
  </head>
  <body>
    <div class="jExt-autocomplete"></div>
    <script src="./jextend/src/jextend.js"></script>
    <script>
      $(document).ready(function () {
        // Initialize autocomplete on the input field
        ".jExt-autocomplete".jExt_autocomplete();
      });
    </script>
  </body>
</html>
```

In this example, the Autocomplete plugin is applied to a div element with the id `jExt-autocomplete`. The input field and the elements for the suggestion list are
created by the plugin.

## Example 2: Custom Configuration

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Autocomplete Example</title>
    <script src="jquery.min.js"></script>
    <script src="autocomplete.js"></script>
    <script>
      $(document).ready(function () {
        // Configure autocomplete options
        const autocompleteOptions = {
          endpointURL: "https://api.example.com/suggestions",
          minChars: 2,
          maxResults: 5,
          highlight: true,
          customRenderCallback: function ($container, item, term) {
            $container.html("<strong>" + term + "</strong>" + item.value);
          },
          onItemSelect: function (item) {
            console.log("Selected item:", item);
          },
        };

        // Initialize autocomplete on the input field with custom options
        $("#inputField").jExt_autocomplete(autocompleteOptions);
      });
    </script>
  </head>
  <body>
    <input id="inputField" type="text" />
  </body>
</html>

<!DOCTYPE html>
<html>
  <head>
    <title>Autocomplete Example</title>
  </head>
  <body>
    <div class="jExt-autocomplete"></div>
    <script src="./jextend/src/jextend.js"></script>
    <script>
      $(document).ready(function () {
        // Configure autocomplete options
        const autocompleteOptions = {
          endpointURL: new URL("https://api.example.com/suggestions")
          minChars: 3,
          maxChars: Number.MAX_SAFE_INTEGER,
          maxResults: Number.MAX_SAFE_INTEGER,
          inputFieldPlaceholder: "Insert you search term",
          useClearButton: true,
          customRenderCallback: ($container, item, term) => {
            $container.text(`${item.label} foo`);
          },
          onItemSelected: (item) => {
            console.log("onItemSelect", item);
          },
          onItemSubmited: (item) => {
            console.log("onItemSubmit", item);
          },
          data: ["foo", "foobar", "foobarbaz"],
          customDataFilterCallback: (term, data) => data,
          highlight: true,
          customHighlightCallback: (term, sourceStr) => $("<span>").addClass("highlight").text(sourceStr)
          debounce: false,
          debounceDelay: 500,
        };

        // Initialize autocomplete on the input field
        $(".jExt-autocomplete").jExt_autocomplete();
      });
    </script>
  </body>
</html>
```

In this example, the Autocomplete plugin is initialized with custom configuration options. The `endpointURL` is set to a custom URL for fetching suggestions. The `minChars` is set to 2, indicating that autocomplete suggestions should be triggered after entering at least 2 characters. The `maxResults` is set to 5, limiting the number of displayed suggestions to 5. The `highlight` option is enabled, which highlights the matched characters in the suggestions. The `customRenderCallback` is provided to customize the rendering of each suggestion item. The `onItemSelect` callback is defined to perform a specific action when an autocomplete suggestion is selected.

These examples demonstrate the basic usage of the Autocomplete plugin and showcase some of the available configuration options. Feel free to modify the code according to your specific requirements.

# API Documentation

## Constructor

```javascript
/**
 * Autocomplete constructor.
 * @param {HTMLElement} element - The element to apply the autocomplete functionality to.
 * @param {Object} options - The plugin options.
 */
function Autocomplete(element, options) {
  // ...
}
```

## Properties

### `element` (HTMLElement)

The DOM element to which the autocomplete functionality is applied.

### `settings` (Object)

The configuration options for the autocomplete functionality.

### Configuration Options

The following options can be passed as properties in the `options` object when creating a new instance of the Autocomplete plugin:

### `endpointURL` (URL)

The URL endpoint for fetching autocomplete suggestions.

### `minChars` (number)

The minimum number of characters required to trigger autocomplete suggestions.

### `maxChars` (number)

The maximum number of characters allowed for the input field.

### `maxResults` (number)

The maximum number of autocomplete suggestions to display.

### `inputFieldPlaceholder` (string)

The placeholder text for the input field.

### `useClearButton` (boolean)

Indicates whether to display a clear button for clearing the input field.

### `customRenderCallback` (Function)

A custom callback function for rendering each autocomplete suggestion.

### `onItemSelected` (Function)

A callback function to be executed when an autocomplete suggestion is selected.

### `onItemSubmited` (Function)

A callback function to be executed when an autocomplete suggestion is submitted.

### `data` (string[]|null)

An array of strings containing specific suggestions.

### `customDataFilterCallback` (Function)

A custom callback function for filtering the suggestion candidates.

### `highlight` (boolean)

Indicates whether to highlight the matched characters in the autocomplete suggestions.

### `customHighlightCallback` (Function)

A custom callback function to be executed when an autocomplete suggestion is rendered.

### `debounce` (boolean)

Indicates whether to debounce the autocomplete suggestions fetch.

### `debounceDelay` (number)

The delay in milliseconds before fetching autocomplete suggestions.
