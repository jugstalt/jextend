(function ($) {
    if (!jExt || !jExt.fn) {
        console.error(
            "jExt has not been loaded or initialized. Please load jExt.js before jExt-ext.js."
        );
        return;
    }

    $.inArray = function (value, array, fromIndex = 0) {
        return array.indexOf(value, fromIndex);
    };

    $.map = function (array, callback) {
        if (!Array.isArray(array) || typeof callback !== "function") {
            throw new TypeError("Invalid arguments");
        }

        const result = [];
        for (let i = 0; i < array.length; i++) {
            const mappedValue = callback(array[i], i);
            result.push(mappedValue);
        }
        return result;
    };

    $.fn.map = function (callback) {
        if (typeof callback !== "function") {
            throw new TypeError("Invalid arguments");
        }

        const result = [];
        this._((element, index) => {
            const mappedValue = callback.call(element, index, element);
            if (mappedValue != null) {
                result.push(mappedValue);
            }
        });
        return jExt(result);
    };

    $.grep = function (array, callback, invert = false) {
        if (!Array.isArray(array) || typeof callback !== "function") {
            throw new TypeError("Invalid arguments");
        }

        const result = [];
        for (let i = 0; i < array.length; i++) {
            const filterResult = callback(array[i], i);
            if ((filterResult && !invert) || (!filterResult && invert)) {
                result.push(array[i]);
            }
        }
        return result;
    };

    $.isFunction = function (obj) {
        return typeof obj === "function";
    };

    $.isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
})(jExt);
