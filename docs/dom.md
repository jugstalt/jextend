# DOM Manipulation

jExt provides various methods to manipulate the DOM (Document Object Model) in an efficient and easy-to-use manner. 
The following examples demonstrate some common DOM manipulation tasks using jExt.

``` javascript
function($) {
    // Append a new 'li' element to a 'ul' element
    $('ul').append('<li>New List Item</li>');

    // Prepend a new 'li' element to a 'ul' element
    $('ul').prepend('<li>New List Item at the Beginning</li>');

    // Insert a new 'p' element after a 'div' element
    $('div').after('<p>New Paragraph</p>');

    // Insert a new 'p' element before a 'div' element
    $('div').before('<p>New Paragraph</p>');

    // Remove all elements with the class 'toBeRemoved'
    $('.toBeRemoved').remove();

    // Empty the content of all 'div' elements
    $('div').empty();

    // Set the text content of all 'p' elements
    $('p').text('New paragraph content.');

    // Set the HTML content of all 'div' elements
    $('div').html('<strong>New HTML content.</strong>');

    // Add a class to all 'li' elements
    $('li').addClass('newClass');

    // Remove a class from all 'li' elements
    $('li').removeClass('oldClass');

    // Toggle a class on all 'li' elements
    $('li').toggleClass('toggleClass');

    // Append a new 'li' element to a 'ul' element using appendTo()
    $('<li>New List Item</li>').appendTo('ul');

    // Insert a new 'p' element before a 'div' element using insertBefore()
    $('<p>New Paragraph</p>').insertBefore('div');
}(jExt);

```

[Next: Events](events.md)