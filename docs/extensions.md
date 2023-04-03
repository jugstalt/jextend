# Extensions

jExt allows you to extend its functionality by adding custom methods to the jExt object or to the jExt objects created by the main jExt function. 
This allows you to create reusable components or plugins, which can be easily integrated into your projects.

## Adding custom methods to jExt objects

To add a custom method to jExt objects, you can extend the jExt.fn object. This makes your custom method available to all jExt objects.

For example, let's say you want to create a custom method to change the background color of elements:

``` javascript
jExt.fn.setBackgroundColor = function(color) {
  this.css('backgroundColor', color);
  return this;
};

// Usage:
$('.some-class').setBackgroundColor('red');
```

## Adding custom static methods to jExt

You can also add custom static methods directly to the jExt object. These methods can be called directly on the jExt object itself, rather than on instances of jExt objects.

For example, let's create a custom utility method to sum the values of an array:

``` javascript
jExt.sum = function(array) {
  return array.reduce(function(a, b) {
    return a + b;
  }, 0);
};

// Usage:
const numbers = [1, 2, 3, 4, 5];
const total = jExt.sum(numbers);
console.log(total); // 15
```

By extending jExt with your own custom methods, you can create a more powerful and flexible toolkit tailored to your specific needs. 
This can help improve the maintainability and reusability of your code.