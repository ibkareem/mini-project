const container = document.querySelector(".container");

const header = document.createElement("h1");
const form = document.createElement("form");
const emailInput = document.createElement("input");
const passwordInput = document.createElement("input");
const submitForm = document.createElement("input");

//start-----important
window.addEventListener("DOMContentLoaded", startEngine);

function startEngine() {
  let container = pageLogin();
  submitForm.addEventListener("click", pageValidation);
}

function pageLogin() {
  header.textContent = "Admin Login";
  emailInput.placeholder = "Enter Email";
  passwordInput.placeholder = "Enter Password";
  passwordInput.type = "password";
  submitForm.type = "submit";
  submitForm.value = "Login";
  form.append(header, emailInput, passwordInput, submitForm);
  container.appendChild(form);
  return container;
}

async function pageValidation(event) {
  event.preventDefault();
  if (emailInput.value === "" || passwordInput.value === "") {
    header.textContent = "Check Input and Try Again";
  } else {
    let token = await fetch("/admin/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });
    let { token: newToken } = await token.json();
    if (newToken === "invalid") {
    } else {
      location.replace(`/admin/dashboard?auth=${newToken}`);
    }
  }
}
