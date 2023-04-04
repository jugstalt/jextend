# Selectors

Selectors are a powerful feature of jExt that allows you to easily select and manipulate HTML elements on your webpage. 
jExt selectors are designed to be similar to jQuery selectors, which in turn are based on CSS selectors. This makes it simple for 
developers who are already familiar with CSS or jQuery to start using jExt.

Below are some examples of common selector patterns:

``` javascript
// Select all elements with the class 'exampleClass'
jExt('.exampleClass');

// Select the element with the ID 'exampleId'
jExt('#exampleId');

// Select all 'p' elements
jExt('p');

// Select all 'li' elements that are children of 'ul' elements
jExt('ul > li');

// Select the first 'div' element
jExt('div:first');

// Select all 'input' elements of type 'text'
jExt('input[type="text"]');
```

For a comprehensive list of supported selectors and more detailed information, refer to the official jExt documentation.

[Next: DOM Manipulation](dom.md)