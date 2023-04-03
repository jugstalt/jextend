# Events

jExt provides a simple way to handle events on elements. You can bind and unbind events, as well as create custom events.

## Binding events

Use the `on()` method to bind an event to an element:

``` javascript
function clickEventbuttonEventHandlerHandler(e) {
    e.stopPropagation();
    alert('Button clicked!');
}

$('button').on('click', buttonEventHandler);
// or
$('button').on(['click', '<other events>'], buttonEventHandler);
// or
$('button').bind('click <other events>', buttonEventHandler);
// or
$('button').click(buttonEventHandler);
```

## Unbinding events

Use the `off()` method to unbind an event from an element:

``` javascript
$('button').off('click', buttonEventHandler);
```

[Next: Ajax](ajax.md)