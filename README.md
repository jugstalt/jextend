# jExtend - A Lightweight JavaScript Library (beta)

jExtend (jExt) is a lightweight JavaScript library designed to simplify the client-side scripting of HTML. Its primary motivation is to offer a minimalistic alternative to jQuery, 
providing the most commonly used features without the overhead of a larger library. jExt aims to be fast, efficient, and easy to use while maintaining compatibility with 
existing jQuery projects.

jExtend is a lightweight JavaScript framework that provides many useful features for web application development. Compared to jQuery, which is a more widely-known library, jExtend is significantly smaller in size. The full minified version, **jextend-full.min.js**, is only around **10kB**. This makes it an excellent choice for developers who want to minimize the overall size of their web applications without sacrificing essential functionality.

By using jExt, developers can enjoy the benefits of a smaller framework that still delivers on key features. This can lead to faster load times and better overall performance for web applications, making it an attractive option for those looking to optimize their projects.

> **_NOTE:_**
   This is a beta version an not for production!
   You can try and give feedback, Thx

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

jExtend (jExt) is a lightweight and efficient JavaScript library designed to provide a more accessible and user-friendly experience for developers 
who are looking to utilize some of the most essential features found in jQuery. By focusing on a minimalistic approach, jExt ensures that it remains quick and efficient without sacrificing the core functionality that developers have come to expect.

## Getting Started

To get started with jExt, simply include the library in your project and start using the jExt (or $) function to access and manipulate the DOM, 
handle events, perform Ajax requests, and more.

For more detailed information on each feature, check out the corresponding documentation pages linked in the Table of Contents above.

If you have existing projects using jQuery, you can do something like this, after you have 
loaded the libraries:

``` html
<script type="javascript">
    
    window.$ = jExt;

    // replace jQuery to jExt in your code or for testing/trying use this line
    window.jQuery = jExt;

</script>
```
Note, that not all methods from jQuery are implemented in jExtend. Maybe you have 
change your code in some places

[Next: Core](docs/core.md)

