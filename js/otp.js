const inputs = document.querySelectorAll(".otp-field > input");
const button = document.querySelector(".btn-submit-otp");

window.addEventListener("load", () => inputs[0].focus());

button.setAttribute("disabled", "disabled");

inputs[0].addEventListener("paste", function (event) {
  event.preventDefault();

  const pastedValue = (event.clipboardData || window.clipboardData).getData(
    "text"
  );
  const otpLength = inputs.length;

  for (let i = 0; i < otpLength; i++) {
      if (i < pastedValue.length) {
          if (Number(pastedValue[i])) {
              inputs[i].value = pastedValue[i];
              inputs[i].removeAttribute("disabled");
              inputs[i].focus();
          }
      } else {
          inputs[i].value = "";
          inputs[i].focus;
      }
  }

});
let BackspaceKeyPressTime = []

inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    const currentInput = input;
    const nextInput = input.nextElementSibling;
    const prevInput = input.previousElementSibling;

    if (currentInput.value.length > 1) {
    let value = currentInput.value.split("")
      currentInput.value = Number(value[value.length - 1]);
      return;
    }
    if(currentInput.value){
        currentInput.classList.remove("otp_error");
        // currentInput.removeClass('otp_error');
    }

    if (
      nextInput &&
      nextInput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
        nextInput.removeAttribute("disabled");
        nextInput.focus();
    }
      if (e.key === "Backspace") {
          BackspaceKeyPressTime.push(e.key)
          inputs.forEach((input, index2) => {
              if (index1 <= index2 && prevInput) {
                  input.value = "";
                  if (BackspaceKeyPressTime.length > 1) {
                    BackspaceKeyPressTime = []
                      input.setAttribute("disabled", true);
                      prevInput.focus();
                  }
              }
          });
      }

    button.classList.remove("active");
    button.setAttribute("disabled", "disabled");

    const inputsNo = inputs.length;
    if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
      button.classList.add("active");
      button.removeAttribute("disabled");
      return;
    }
  });
});