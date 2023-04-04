# Events

jExt provides a simple way to handle events on elements. You can bind and unbind events, as well as create custom events.

## Binding events

Use the `on()` method to bind an event to an element:

``` javascript
function clickEventbuttonEventHandlerHandler(e) {
    e.stopPropagation();
    alert('Button clicked!');
}

jExt('button').on('click', buttonEventHandler);
// or
jExt('button').on(['click', '<other events>'], buttonEventHandler);
// or
jExt('button').bind('click <other events>', buttonEventHandler);
// or
jExt('button').click(buttonEventHandler);
```

## Unbinding events

Use the `off()` method to unbind an event from an element:

``` javascript
jExt('button').off('click', buttonEventHandler);
```

[Next: Ajax](ajax.md)