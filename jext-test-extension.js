$.fn.elementText = function(newText) {
  if (newText) {
    this._forEach((element) => {
      element.textContent = newText;
    });
    return this;
  } else {
    return this.elements[0]?.textContent;
  }
};
