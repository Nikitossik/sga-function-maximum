// user interface

const equationForm = document.getElementById("equation-form");
const equationInputs = document.querySelectorAll(".form-equation__input");

let a = null,
  b = null,
  c = null;

if (equationInputs) {
  Array.from(equationInputs).forEach((input) => {
    input.addEventListener("input", (e) => {
      console.log("input");
      equationForm.classList.remove("form-equation--error");
    });
  });
}

equationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const isEmpty = Array.from(equationInputs).some((field) => !field.value);

  if (isEmpty) equationForm.classList.add("form-equation--error");
  else {
    a = +equationInputs[0].value;
    b = +equationInputs[1].value;
    c = +equationInputs[2].value;
    const solutions = getSolutions();
    downloadFile(solutions);
  }
});
