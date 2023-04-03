$("<div>")
  .addClass('my-class1')
  .attr('id', 'div-id')
  .appendTo('body')
  .elementText('123');

$("body").addClass('body-class1');

var $ul=$("<ul>").appendTo('body');

for(var i=0;i<10;i++) {
  $("<li>")
    .elementText('listitem'+i)
    .appendTo($ul);
}

$("ul li")
  .addClass('list-item-class class3 class2')
  .removeClass('class3')
  .toggleClass('class2')
  .toggleClass('class4')

$("<input type='text'>")
  .val('hello world')
  .css('width','500px')
  .css({ paddingLeft: 30, backgroundColor: 'black', color: 'white' })
  .appendTo($('body'));

function outerClick(e) {
  console.log('Outer div clicked/mousever');
}

$('<button>')
  .text('Click me')
  .on('click', function (e) {
    console.log('Clicked!', e.originalEvent);
    $outerdiv.trigger('click').off('mouseover', outerClick);
  })
  .appendTo('body');

var $outerdiv = $('<div>')
  .text('Mouse events')
  .css({backgroundColor: 'red', padding: 50})
  .on(['click', 'mouseover'], outerClick)
  .appendTo('body');

var $innerDiv = $("<div>")
  .text('inner div')
  .css('background-color','yellow')
  .on('click', function(e) {
    e.stopPropagation();
    console.log('inner div clicked');
  })
  .appendTo($outerdiv);

  let target = { a: 1, b: 2 };
  let obj1 = { b: 3, c: 4 };
  let obj2 = { c: 5, d: 6 };

  console.log($.fn.extend(target, obj1, obj2));

  target = { a: 1, b: { c: 2 } };
  obj1 = { b: { d: 3 }, e: 4 };
  obj2 = { b: { e: 5 }, f: 6 };
  

  console.log($.fn.extend(true, target, obj1, obj2)); // { a: 1, b: { c: 2, d: 3, e: 5 }, e: 4, f: 6 }
  console.log($.fn.extend(false, target, obj1, obj2));

  $('li').each(function(i, e) {
      var $e = $(e);

      $e.addClass('new-class-from each');
      console.log(i, $(e));
  });

console.log($innerDiv.closest('div'));
$innerDiv.closest('div').addClass('i-am-your-child');

console.log($('body').find('li'));
console.log($('body').children('li'));
console.log($('ul').find('li'));
  

  