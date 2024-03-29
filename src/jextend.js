(function (window) {
    function jExt(selector) {
        if (typeof selector === "string") {
            if (selector.startsWith("<")) {
                return createHTMLElement(selector);
            }
            return findDOMObjects(selector);
        } else if (typeof selector === "function") {
            return jExt.ready(selector); // provide $(function() {...})
        } else if (
            selector instanceof HTMLElement ||
            selector instanceof Document ||
            selector instanceof Window
        ) {
            return createFromDOMObject(selector);
        } else if (selector instanceof jExtObject) {
            return selector;
        } else if (typeof selector === "object") {
            return new jExtObject([selector]); // try this...
        }

        return new jExtObject();
    }

    function findDOMObjects(selector) {
        const elements = document.querySelectorAll(modifySelector(selector));
        return new jExtObject(elements);
    }

    function createHTMLElement(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        const element = template.content.firstChild;
        return new jExtObject([element]);
    }

    function createFromDOMObject(domObj) {
        return new jExtObject([domObj]);
    }

    function modifySelector(selector) {
        if (typeof selector !== "string") {
            return selector;
        }

        // Convert IDs that start with a number
        const matchId = selector.match(/#([\d].*?)(?=\s|\.|$)/);
        if (matchId) {
            const idSelector = '[id="' + matchId[1] + '"]';
            selector = selector.replace(matchId[0], idSelector);
        }

        // Convert classes that start with a number
        const matchClass = selector.match(/\.([\d].*?)(?=\s|\.|$)/);
        if (matchClass) {
            const classSelector = '[class~="' + matchClass[1] + '"]';
            selector = selector.replace(matchClass[0], classSelector);
        }

        selector = selector.replace(/:first/g, ":first-of-type");

        return selector;
    }

    const _booleanAttributes = [
        "hidden",
        "readonly",
        "required",
        "disabled",
        "autofocus",
        "formnovalidate",
        "multiple",
        "autofocus",
    ];

    class jExtEvent {
        constructor(originalEvent) {
            this.originalEvent = originalEvent;
            this.type = originalEvent.type;
            this.target = originalEvent.target;
            this.currentTarget = originalEvent.currentTarget;

            // Tastaturevents
            this.ctrlKey = originalEvent.ctrlKey;
            this.shiftKey = originalEvent.shiftKey;
            this.which = originalEvent.which;
            this.key = originalEvent.key;
        }

        preventDefault() {
            if (this.originalEvent.preventDefault) {
                this.originalEvent.preventDefault();
            } else {
                this.originalEvent.returnValue = false;
            }
        }

        stopPropagation() {
            if (this.originalEvent.stopPropagation) {
                this.originalEvent.stopPropagation();
            } else {
                this.originalEvent.cancelBubble = true;
            }
        }

        stopImmediatePropagation() {
            if (this.originalEvent.stopImmediatePropagation) {
                this.originalEvent.stopImmediatePropagation();
            } else {
                this.originalEvent.cancelBubble = true;
            }
        }
    }

    class jExtObject {
        constructor(elements) {
            elements = elements || [];

            this.length = 0;

            for (let i = 0; i < elements.length; i++) {
                if (elements[i]) {
                    this[i] = elements[i];
                    this.length++;
                }
            }
        }

        _(callback) {
            // _forEach (internal)
            for (let i = 0; i < this.length; i++) {
                callback(this[i], i);
            }
        }

        each(callback) {
            for (let i = 0; i < this.length; i++) {
                callback.call(this[i], i, this[i]);
            }
            return this;
        }

        get(i) {
            return this[i];
        }

        elements() {
            let elements = [];
            for (let i = 0; i < this.length; i++) {
                elements.push(this[i]);
            }
            return elements;
        }

        filter(selector) {
            selector = modifySelector(selector);
            const elements = Array.from(this);
            const filteredElements = elements.filter((element) =>
                element.matches(selector)
            );
            return new jExtObject(filteredElements);
        }

        siblings(selector) {
            let siblings = [];
            this._((element) => {
                let elSiblings = Array.from(element.parentNode.children);
                elSiblings = elSiblings.filter(
                    (elSibling) => elSibling !== element
                ); // exclude element itself
                siblings = siblings.concat(elSiblings);
            });
            let siblingObjects = new jExtObject(siblings);
            if (selector) {
                siblingObjects = siblingObjects.filter(selector);
            }
            return siblingObjects;
        }

        index(selectorOrElement) {
            if (!selectorOrElement) {
                // index of the first element within its siblings
                const firstElement = this[0];
                return Array.from(firstElement.parentNode.children).indexOf(
                    firstElement
                );
            } else if (typeof selectorOrElement === "string") {
                // index within the elements matching the given selector
                const elements = Array.from(
                    document.querySelectorAll(modifySelector(selectorOrElement))
                );
                return elements.indexOf(this[0]);
            } else {
                // index of the given element within the selected elements
                return Array.from(this).indexOf(selectorOrElement);
            }
        }

        // Classes

        hasClass(className) {
            let hasClass = false;
            this._((element) => {
                if (element.classList.contains(className)) {
                    hasClass = true;
                }
            });
            return hasClass;
        }

        addClass(classes) {
            classes.split(" ").forEach((className) => {
                this._((element) => {
                    if (className) {
                        element.classList.add(className);
                    }
                });
            });
            return this;
        }

        removeClass(classes) {
            classes.split(" ").forEach((className) => {
                this._((element) => {
                    element.classList.remove(className);
                });
            });
            return this;
        }

        toggleClass(className) {
            this._((element) => {
                element.classList.toggle(className);
            });
            return this;
        }

        // Attributes & Data
        attr(name, value) {
            const setAttr = (element, attributeName, attributeValue) => {
                if (_booleanAttributes.includes(attributeName)) {
                    if (attributeValue === true || attributeValue === "true") {
                        element.setAttribute(attributeName, attributeName);
                    } else if (
                        attributeValue === false ||
                        attributeValue === "false"
                    ) {
                        element.removeAttribute(attributeName);
                    } else {
                        element.setAttribute(attributeName, attributeValue);
                    }
                } else {
                    element.setAttribute(attributeName, attributeValue);
                }
            };

            if (typeof name === "object") {
                const attributes = name;
                for (const key in attributes) {
                    this._((element) => {
                        setAttr(element, key, attributes[key]);
                    });
                }
            } else if (typeof value === "undefined") {
                return this[0] ? this[0].getAttribute(name) : null;
            } else {
                this._((element) => {
                    setAttr(element, name, value);
                });
            }

            return this;
        }

        data(key, value) {
            if (typeof value === "undefined") {
                return this[0]
                    ? this[0].__jExtData
                        ? this[0].__jExtData[key]
                        : null
                    : null;
            } else {
                this._((element) => {
                    if (!element.__jExtData) {
                        element.__jExtData = {};
                    }
                    element.__jExtData[key] = value;
                });
                return this;
            }
        }

        text(newText) {
            if (typeof newText === "undefined") {
                return this[0]?.textContent;
            } else {
                this._((element) => {
                    element.textContent = newText;
                });
                return this;
            }
        }

        html(newHtml) {
            if (typeof newHtml === "undefined") {
                return this[0]?.innerHTML;
            } else {
                this._((element) => {
                    element.innerHTML = newHtml;
                });
                return this;
            }
        }

        val(newValue) {
            if (typeof newValue === "undefined") {
                return this[0]?.value;
            } else {
                this._((element) => {
                    element.value = newValue;
                });
                return this;
            }
        }

        css(propertyName, value) {
            const setStyle = (element, property, val) => {
                if (
                    typeof val === "number" &&
                    ["opacity", "zIndex"].indexOf(property) === -1
                ) {
                    val += "px";
                }
                element.style[property] = val;
            };

            if (typeof propertyName === "object") {
                const styles = propertyName;
                for (const key in styles) {
                    this._((element) => {
                        setStyle(element, key, styles[key]);
                    });
                }
            } else if (typeof value === "undefined") {
                return this[0]?.style[propertyName];
            } else {
                this._((element) => {
                    setStyle(element, propertyName, value);
                });
            }
            return this;
        }

        empty() {
            this._((element) => {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            });
            return this;
        }

        // Add elements
        appendTo(target) {
            let targetElement;

            if (typeof target === "string") {
                targetElement = document.querySelector(target);
            } else if (target instanceof jExtObject) {
                targetElement = target[0];
            } else {
                throw new Error("Invalid target type for appendTo");
            }

            if (targetElement) {
                this._((element) => {
                    targetElement.appendChild(element);
                });
            }
            return this;
        }

        prependTo(target) {
            const targetElements = jExt(target);

            this._((element) => {
                targetElements._((targetElement) => {
                    targetElement.insertBefore(
                        element /*.cloneNode(true)*/,
                        targetElement.firstChild
                    );
                });
            });

            return this;
        }

        insertBefore(target) {
            const targetElement = jExt(target)[0];
            if (!targetElement) return this;

            this._((element) => {
                targetElement.parentElement.insertBefore(
                    element,
                    targetElement
                );
            });

            return this;
        }

        insertAfter(target) {
            const targetElement = jExt(target)[0];
            if (!targetElement) return this;

            this._((element) => {
                const parentElement = targetElement.parentElement;
                const nextSibling = targetElement.nextSibling;
                if (nextSibling) {
                    parentElement.insertBefore(element, nextSibling);
                } else {
                    parentElement.appendChild(element);
                }
            });

            return this;
        }

        append(content) {
            const contentElements = jExt(content);
            this._((element) => {
                contentElements._((contentElement) => {
                    element.appendChild(contentElement /*.cloneNode(true)*/);
                });
            });

            return this;
        }

        prepend(content) {
            const contentElements = jExt(content);
            this._((element) => {
                let firstChild = element.firstChild;
                contentElements._((contentElement) => {
                    element.insertBefore(
                        contentElement /*.cloneNode(true)*/,
                        firstChild
                    );
                });
            });

            return this;
        }

        remove() {
            this._((element) => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            return this;
        }

        // find Objects
        closest(selector) {
            selector = modifySelector(selector);
            const closestElements = [];

            for (let i = 0; i < this.length; i++) {
                let currentElement = this[i];
                while (currentElement) {
                    if (currentElement.matches(selector)) {
                        closestElements.push(currentElement);
                        break;
                    }
                    currentElement = currentElement.parentElement;
                }
            }

            return new jExtObject(closestElements);
        }

        parent() {
            const parents = [];

            this._((element) => {
                if (element.parentElement) {
                    parents.push(element.parentElement);
                }
            });

            return new jExtObject(parents);
        }

        find(selector) {
            selector = modifySelector(selector);
            const foundElements = [];

            for (let i = 0; i < this.length; i++) {
                //console.log('querySelectorAll(' + selector + ')');
                const matchingElements = this[i].querySelectorAll(selector);
                for (let j = 0; j < matchingElements.length; j++) {
                    foundElements.push(matchingElements[j]);
                }
            }

            return new jExtObject(foundElements);
        }

        children(selector) {
            selector = modifySelector(selector);
            const childElements = [];

            for (let i = 0; i < this.length; i++) {
                const children = this[i].children;
                for (let j = 0; j < children.length; j++) {
                    if (!selector || children[j].matches(selector)) {
                        childElements.push(children[j]);
                    }
                }
            }

            return new jExtObject(childElements);
        }

        first() {
            if (this.length === 0) return null;
            return new jExtObject([this[0]]);
        }

        last() {
            if (this.length === 0) return null;
            return new jExtObject([this[this.length - 1]]);
        }

        prev() {
            if (this[0] && this[0].previousElementSibling) {
                return jExtObject(this[0].previousElementSibling);
            }
            return new jExtObject();
        }

        prevAll() {
            const siblings = [];
            let el = this[0];
            while ((el = el.previousElementSibling)) {
                siblings.push(el);
            }
            return new jExtObject(siblings);
        }

        next() {
            if (this[0] && this[0].nextElementSibling) {
                return jExtObject(this[0].nextElementSibling);
            }
            return new jExtObject();
        }

        nextAll() {
            const siblings = [];
            let el = this[0];
            while ((el = el.nextElementSibling)) {
                siblings.push(el);
            }
            return new jExtObject(siblings);
        }

        is(selector) {
            selector = modifySelector(selector);
            const el = this[0];
            if (!el || selector === undefined) {
                return false;
            }

            if (typeof selector === "string") {
                if (el.matches) {
                    return el.matches(selector);
                } else if (el.msMatchesSelector) {
                    // Fallback for IE
                    return el.msMatchesSelector(selector);
                }
            }

            if (selector instanceof HTMLElement) {
                return el === selector;
            }

            if (selector instanceof jExtObject) {
                return el === selector[0];
            }

            return false;
        }

        get(index) {
            if (index === undefined) {
                return Array.from(this);
            }
            return this[index];
        }

        // events
        on(eventNames, handler) {
            const eventsArray = Array.isArray(eventNames)
                ? eventNames
                : [eventNames];

            eventsArray.forEach((eventName) => {
                this._((element) => {
                    // Add the event listener as before, but store the actual handler
                    // in a WeakMap.
                    const actualHandler = (originalEvent) => {
                        const jEvent = new jExtEvent(originalEvent);
                        const result = handler.call(element, jEvent);
                        if (result === false) {
                            jEvent.preventDefault();
                            jEvent.stopPropagation();
                        }
                    };
                    element._jExtHandlers =
                        element._jExtHandlers || new WeakMap();
                    element._jExtHandlers.set(handler, actualHandler);
                    element.addEventListener(eventName, actualHandler);
                });
            });

            return this;
        }

        bind(eventNames, callback) {
            const eventsArray = eventNames
                .split(" ")
                .map((event) => event.trim());
            return this.on(eventsArray, callback);
        }

        click(handler) {
            return this.on("click", handler);
        }

        change(handler) {
            return this.on("change", handler);
        }

        keydown(handler) {
            return this.on("keydown", handler);
        }

        keyup(handler) {
            return this.on("keyup", handler);
        }

        mouseleave(handler) {
            return this.on("mouseleave", handler);
        }

        scroll(handler) {
            return this.on("scroll", handler);
        }

        contextmenu(handler) {
            return this.on("contextmenu", handler);
        }

        resize(handler) {
            this.on("resize", handler);
        }

        off(eventNames, handler) {
            const eventsArray = Array.isArray(eventNames)
                ? eventNames
                : [eventNames];

            eventsArray.forEach((eventName) => {
                this._((element) => {
                    if (
                        element._jExtHandlers &&
                        element._jExtHandlers.has(handler)
                    ) {
                        const actualHandler =
                            element._jExtHandlers.get(handler);
                        element.removeEventListener(eventName, actualHandler);
                    } else {
                        element.removeEventListener(eventName, handler);
                    }
                });
            });

            return this;
        }

        blur(handler) {
            return this.on("blur", handler);
        }

        hover(handler) {
            return this.on("hover", handler);
        }

        unbind(eventNames, callback) {
            const eventsArray = eventNames
                .split(" ")
                .map((event) => event.trim());
            return this.off(eventsArray, callback);
        }

        trigger(eventNames) {
            const eventsArray = Array.isArray(eventNames)
                ? eventNames
                : [eventNames];

            eventsArray.forEach((eventName) => {
                this._((element) => {
                    const event = new Event(eventName, {
                        bubbles: true,
                        cancelable: true,
                    });
                    element.dispatchEvent(event);
                });
            });

            return this;
        }

        // Size and offset
        width(value) {
            if (value === undefined) {
                if (!this[0]) return null;
                if (this[0] === window || this[0] === window.document) {
                    return window.innerWidth;
                }
                const style = getComputedStyle(this[0]);
                return (
                    this[0].clientWidth -
                    parseFloat(style.paddingLeft) -
                    parseFloat(style.paddingRight)
                );
            } else {
                this._((el) => {
                    const style = getComputedStyle(el);
                    const adjustedWidth =
                        typeof value === "number" ? value : parseFloat(value);
                    const newWidth =
                        adjustedWidth +
                        parseFloat(style.paddingLeft) +
                        parseFloat(style.paddingRight);
                    el.style.width = `${newWidth}px`;
                });
                return this;
            }
        }

        outerWidth(includeMargin = false) {
            const el = this[0];
            let width = el.offsetWidth;

            if (includeMargin) {
                const style = window.getComputedStyle(el);
                width +=
                    parseFloat(style.marginLeft) +
                    parseFloat(style.marginRight);
            }

            return width;
        }

        innerWidth() {
            return this[0].clientWidth;
        }

        height(value) {
            if (value === undefined) {
                if (!this[0]) return null;
                if (this[0] === window || this[0] === window.document) {
                    return window.innerHeight;
                }
                const style = getComputedStyle(this[0]);
                return (
                    this[0].clientHeight -
                    parseFloat(style.paddingTop) -
                    parseFloat(style.paddingBottom)
                );
            } else {
                this._((el) => {
                    const style = getComputedStyle(el);
                    const adjustedHeight =
                        typeof value === "number" ? value : parseFloat(value);
                    const newHeight =
                        adjustedHeight +
                        parseFloat(style.paddingTop) +
                        parseFloat(style.paddingBottom);
                    el.style.height = `${newHeight}px`;
                });
                return this;
            }
        }

        outerHeight(includeMargin = false) {
            const el = this[0];
            let height = el.offsetHeight;

            if (includeMargin) {
                const style = window.getComputedStyle(el);
                height +=
                    parseFloat(style.marginTop) +
                    parseFloat(style.marginBottom);
            }

            return height;
        }

        innerHeight() {
            return this[0].clientHeight;
        }

        offset(coordinates) {
            if (coordinates === undefined) {
                const el = this[0];
                const rect = el.getBoundingClientRect();
                const docEl = document.documentElement;

                return {
                    top: rect.top + window.pageYOffset - docEl.clientTop,
                    left: rect.left + window.pageXOffset - docEl.clientLeft,
                };
            } else {
                this.each((i, el) => {
                    const $el = $(el);
                    const currOffset = $el.offset();
                    const position = {
                        top: parseFloat($el.css("top")),
                        left: parseFloat($el.css("left")),
                    };

                    $el.css({
                        top: position.top + (coordinates.top - currOffset.top), // + 'px',
                        left:
                            position.left +
                            (coordinates.left - currOffset.left), //+ 'px'
                    });
                });

                return this;
            }
        }

        position() {
            if (!this[0]) {
                return null;
            }

            const offsetParent =
                this[0].offsetParent || document.documentElement;
            const rect = this[0].getBoundingClientRect();
            const parentRect = offsetParent.getBoundingClientRect();

            return {
                top:
                    rect.top -
                    parentRect.top -
                    parseFloat(getComputedStyle(offsetParent).borderTopWidth),
                left:
                    rect.left -
                    parentRect.left -
                    parseFloat(getComputedStyle(offsetParent).borderLeftWidth),
            };
        }

        // Forms
        serialize() {
            const serializeFormElement = (element) => {
                const tagName = element.tagName.toLowerCase();
                const type = element.type;
                const name = element.name;
                const value = element.value;

                if (
                    tagName === "input" &&
                    (type === "checkbox" || type === "radio") &&
                    !element.checked
                ) {
                    return "";
                }

                if (tagName === "select" && element.multiple) {
                    const options = Array.from(element.options);
                    const selectedOptions = options
                        .filter((option) => option.selected)
                        .map(
                            (option) =>
                                encodeURIComponent(name) +
                                "=" +
                                encodeURIComponent(option.value)
                        )
                        .join("&");

                    return selectedOptions;
                }

                return (
                    encodeURIComponent(name) + "=" + encodeURIComponent(value)
                );
            };

            const elements = [];
            this._((element) => {
                if (
                    (element.tagName.toLowerCase() === "form" &&
                        element.elements) ||
                    element.tagName.toLowerCase() === "fieldset"
                ) {
                    const formElements = Array.from(element.elements);
                    elements.push(...formElements);
                } else {
                    elements.push(element);
                }
            });

            const serializedArray = elements
                .filter(
                    (element) =>
                        element.name &&
                        !element.disabled &&
                        ["input", "select", "textarea", "button"].includes(
                            element.tagName.toLowerCase()
                        )
                )
                .map(serializeFormElement)
                .filter((serialized) => serialized.length > 0)
                .join("&");

            return serializedArray;
        }

        // Document
        ready = function (callback) {
            if (document.readyState !== "loading") {
                callback();
            } else {
                document.addEventListener("DOMContentLoaded", callback);
            }
            return this;
        };

        // Effects
        fadeIn = function (duration = 400) {
            this._((element) => {
                element.style.display = "";
                element.style.transition = `opacity ${duration}ms`;
                setTimeout(() => (element.style.opacity = "1"), 0);
            });
            return this;
        };

        fadeOut = function (duration = 400) {
            this._((element) => {
                element.style.transition = `opacity ${duration}ms`;
                setTimeout(() => {
                    element.style.opacity = "0";
                    element.addEventListener(
                        "transitionend",
                        () => {
                            if (element.style.opacity === "0") {
                                element.style.display = "none";
                            }
                        },
                        { once: true }
                    );
                }, 0);
            });
            return this;
        };

        slideUp = function (time = 400) {
            this._((element) => {
                element.animate(
                    [
                        // keyframes
                        { height: getComputedStyle(element).height },
                        { height: "0px" },
                    ],
                    {
                        // timing options
                        duration: time,
                        easing: "ease",
                        fill: "forwards",
                    }
                );
            });
            return this;
        };

        slideDown = function (time = 400) {
            this._((element) => {
                element.style.height = "0px";
                element.style.display = ""; // reset display property
                element.animate(
                    [
                        // keyframes
                        { height: "0px" },
                        { height: getComputedStyle(element).height },
                    ],
                    {
                        // timing options
                        duration: time,
                        easing: "ease",
                        fill: "forwards",
                    }
                );
            });
            return this;
        };

        slideToggle = function (time = 400) {
            this._((element) => {
                const displayStyle = getComputedStyle(element).display;
                if (displayStyle === "none" || displayStyle === "") {
                    // If element is currently not visible, slide it down
                    this.slideDown(time);
                } else {
                    // If element is currently visible, slide it up
                    this.slideUp(time);
                }
            });
            return this;
        };
    }

    jExt.fn = jExtObject.prototype;

    jExt.ready = function (callback) {
        if (
            document.readyState === "complete" ||
            document.readyState === "interactive"
        ) {
            // if document already read, call callback
            setTimeout(callback, 1);
        } else {
            // otherwise, add event listener
            window.addEventListener("DOMContentLoaded", () =>
                setTimeout(callback, 1)
            );
        }
    };

    jExt.extend = function (deep, target, ...objects) {
        if (typeof deep !== "boolean") {
            objects.unshift(target);
            target = deep;
            deep = false;
        }

        objects.forEach((obj) => {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    if (
                        deep &&
                        typeof obj[key] === "object" &&
                        !Array.isArray(obj[key])
                    ) {
                        target[key] = this.extend(
                            true,
                            target[key] || {},
                            obj[key]
                        );
                    } else {
                        target[key] = obj[key];
                    }
                }
            }
        });

        return target;
    };

    jExt.each = function (array, callback) {
        if (array && array.length) {
            for (let i = 0; i < array.length; i++) {
                callback(i, array[i]);
            }
        }
    };

    jExt.parseJSON = function (jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Error parsing JSON: ", e);
        }
    };

    window.jExt = jExt;
})(window);
