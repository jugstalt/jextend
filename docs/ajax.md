# AJAX

jExt provides a simple and easy-to-use AJAX method for making HTTP requests, allowing you to retrieve and send data to the server without reloading the page.

## Basic AJAX request

Here's a basic example of making a GET request with jExt:

``` javascript
jExt.ajax({
  type: 'GET',
  url: 'https://api.example.com/data',
  success: function(data) {
    console.log('Data received:', data);
  },
  error: function(err) {
    console.log('Error:', err);
  }
});
```

## POST request

To make a POST request, simply change the type property to 'POST' and provide the data to be sent:

``` javascript
jExt.ajax({
  type: 'POST',
  url: 'https://api.example.com/data',
  data: {
    key1: 'value1',
    key2: 'value2'
  },
  success: function(data) {
    console.log('Data received:', data);
  },
  error: function(err) {
    console.log('Error:', err);
  }
});
```

## Handling JSON

jExt can automatically parse JSON data based on the response's content type or you can implicitly define the `dataType`:

``` javascript
jExt.ajax({
  type: 'GET',
  url: 'https://api.example.com/data',
  dataType: 'json',
  success: function(data) {
    console.log('JSON data received:', data);
  },
  error: function(err) {
    console.log('Error:', err);
  }
});
```

These examples demonstrate how to use jExt's AJAX method to make HTTP requests and handle the responses, 
making it easy to interact with APIs and server-side resources.

[Next: Utilities](utilities.md)
