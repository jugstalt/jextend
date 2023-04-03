$(function () {
  // Create a new <li> element and append it to the end of the list
  const newItem = $("<li>").text("Item 4").appendTo("#demo-list");

  // Add the class "red" to all list items
  $("li").addClass("red");

  // Use the click() method to respond to click events
  $("#demo-button").click(function () {
    // Toggle the classes "red" and "blue" for all list items
    $("li").toggleClass("red").toggleClass("blue");
  });

  // Add a mouseover and mouseout event to the list
  $("#demo-list")
    .on("mouseover", function (e) {
      console.log(this);
      $(this).css({ "font-weight": "bold" });
    })
    .on("mouseout", function (e) {
      $(this).css({ "font-weight": "normal" });
    });

  // Additional demos

  // Create a button that adds a new element to the list
  $("<button>")
    .text("Add Item")
    .click(function () {
      const itemCount = $("#demo-list li").length + 1;
      $("<li>")
        .text("Item " + itemCount)
        .appendTo("#demo-list");
    })
    .appendTo("body");

  // Create a button that removes the last element from the list
  $("<button>")
    .text("Remove Item")
    .click(function () {
      $("#demo-list li:last-child").remove();
    })
    .appendTo("body");

  // Create a button that changes the background color of the list items
  $("<button>")
    .text("Change Background Color")
    .click(function () {
      $("#demo-list li").css({
        "background-color":
          "rgba(" +
          Math.floor(Math.random() * 256) +
          "," +
          Math.floor(Math.random() * 256) +
          "," +
          Math.floor(Math.random() * 256) +
          "," +
          Math.random().toFixed(2) +
          ")",
      });
    })
    .appendTo("body");

  // Example 4: Demonstrate width, outerWidth, and innerWidth
  const $box = $("<div>")
    .css({
      width: "80%",
      height: 80,
      margin: 10,
      padding: 11,
      border: "2px solid red",
      backgroundColor: "yellow",
    })
    .addClass("box")
    .appendTo("body");
  console.log("Width:", $box.width());
  console.log("Outer width:", $box.outerWidth());
  console.log("Inner width:", $box.innerWidth());

  // Example 5: Demonstrate offset
  const $offsetBox = $("<div>").addClass("offset-box").appendTo("body");
  console.log("Offset:", $offsetBox.offset());
  $offsetBox.offset({ top: 100, left: 100 });
  console.log("Updated offset:", $offsetBox.offset());

  console.log('window.width', $(window).width());
});
