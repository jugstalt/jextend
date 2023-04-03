# Utilities

jExt provides a set of utility functions that can be helpful for various tasks when working with JavaScript. These utilities are designed to simplify common operations and make your code more readable and efficient.

## jExt.map()

`jExt.map()` is a utility function that applies a callback function to each element of an array or an object, creating a new array with the results.

``` javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = jExt.map(numbers, function(number) {
  return number * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]
```

## jExt.grep()

`jExt.grep()` is a utility function that filters an array based on a callback function. It returns a new array containing only the elements that satisfy the callback function's condition.

``` javascript
const words = ['apple', 'banana', 'cherry', 'date'];
const longWords = jExt.grep(words, function(word) {
  return word.length > 5;
});
console.log(longWords); // ['banana', 'cherry']
```

You can also provide an optional `invert` parameter, which returns an array of elements that do not satisfy the callback function's condition.

``` javascript
const shortWords = jExt.grep(words, function(word) {
  return word.length > 5;
}, true);
console.log(shortWords); // ['apple', 'date']
```

These utility functions in jExt can help you perform common tasks with less code, making your JavaScript more efficient and easier to understand.