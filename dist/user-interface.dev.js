"use strict";

// user interface
var equationForm = document.getElementById("equation-form");
var equationInputs = document.querySelectorAll(".form-equation__input");
var a = null,
    b = null,
    c = null;

if (equationInputs) {
  Array.from(equationInputs).forEach(function (input) {
    input.addEventListener("input", function (e) {
      console.log("input");
      equationForm.classList.remove("form-equation--error");
    });
  });
}

equationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var isEmpty = Array.from(equationInputs).some(function (field) {
    return !field.value;
  });
  if (isEmpty) equationForm.classList.add("form-equation--error");else {
    a = +equationInputs[0].value;
    b = +equationInputs[1].value;
    c = +equationInputs[2].value;
    var solutions = getSolutions();
    downloadFile(solutions);
  }
});