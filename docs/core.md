# jExt Core

The core of the jExt library provides the foundation for all other features. It includes the basic functionalities that make jExt a powerful and easy-to-use tool for web development. In this section, we will cover the essential aspects of the jExt core, including the main jExt function, the jExtObject, and utility methods.

## The jExt Function

The main jExt (or $) function is the entry point for most operations in the library. It can be used to select elements, create new elements, or wrap existing DOM elements.

### Selecting Elements

To select elements, simply pass a CSS selector string to the jExt function:

```javascript
const myElement = $('#myElement');
```

### Creating Elements

To create new elements, pass an HTML string to the jExt function:

```javascript
const newElement = $('<div class="myNewElement">Hello, World!</div>');
```

### Wrapping Existing DOM Elements

To wrap an existing DOM element with the jExt library, pass the DOM element to the jExt function:

```javascript
const wrappedElement = $(document.querySelector('#myElement'));
```

## jExtObject

The jExtObject is the main object returned by the jExt function. It contains the selected or created elements and provides various methods for manipulating them. Some of the key methods include:

    `html()`: Get or set the HTML contents of the selected elements.
    `text()`: Get or set the text contents of the selected elements.
    `attr()`: Get or set attributes of the selected elements.
    `data()`: Get or set custom data object of the selected elements.
    `css()`: Get or set the CSS styles of the selected elements.
    `val()`: Get or set the CSS styles of the selected elements.

Utility Methods

jExt also includes various utility methods that can be helpful in different scenarios:

    `$.extend()`: Extend the jExt library or an object with additional methods or properties.
    `$.isArray()`: Check if a given value is an array.
    `$.isFunction()`: Check if a given value is a function.

For a complete list of core methods and features, refer to the API documentation.

Here are the examples for the core methods:

```javascript
// css() with key and value
$('#elementId').css('background-color', 'red');

// css() with an object
$('#elementId').css({
  'backgroundColor': 'blue',
  'fontSize': '16px'
});

// text()
$('#elementId').text('This is a sample text');

// attr()
$('#elementId').attr('data-custom', 'customValue');

// val()
$('#inputElement').val('This is a new value');
```

[Next: Selectors](selectors.md)