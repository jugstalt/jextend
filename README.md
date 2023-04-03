# jExt - A Lightweight JavaScript Library

jExt is a lightweight JavaScript library designed to simplify the client-side scripting of HTML. Its primary motivation is to offer a minimalistic alternative to jQuery, 
providing the most commonly used features without the overhead of a larger library. jExt aims to be fast, efficient, and easy to use while maintaining compatibility with 
existing jQuery projects.

- Select elements: 
``` Javascript 
    $('#myElement')
```

- Manipulate DOM: 
``` Javascript 
    $('#myElement').html('Hello, World!')
```

- Handle events: 
``` Javascript 
    $('#myButton').on('click', () => alert('Button clicked!'))
```

- Perform Ajax requests: 

``` Javascript 
    $.ajax({ url: 'https://api.example.com/data', success: data => console.log(data) })
```

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core](docs/core.md)
4. [Selectors](docs/selectors.md)
5. [DOM Manipulation](docs/dom.md)
6. [Events](docs/events.md)
7. [Ajax](docs/ajax.md)
8. [Utilities](docs/utilities.md)
9. [Extensions](docs/extensions.md)

## Introduction

jExt is a lightweight and efficient JavaScript library designed to provide a more accessible and user-friendly experience for developers 
who are looking to utilize some of the most essential features found in jQuery. By focusing on a minimalistic approach, jExt ensures that it remains quick and efficient without sacrificing the core functionality that developers have come to expect.

## Getting Started

To get started with jExt, simply include the library in your project and start using the jExt (or $) function to access and manipulate the DOM, 
handle events, perform Ajax requests, and more.

For more detailed information on each feature, check out the corresponding documentation pages linked in the Table of Contents above.

