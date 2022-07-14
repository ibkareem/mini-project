const container = document.querySelector(".container");

//elements on page load
const header = document.createElement("h1");
const form = document.createElement("form");
const username = document.createElement("input");
const emailInput = document.createElement("input");
const accountType = document.createElement("select");
const submitForm = document.createElement("input");

//start-----important
window.addEventListener("DOMContentLoaded", startEngine);

// ----important---on page load
async function startEngine() {
  let container = pageSignup();
  submitForm.addEventListener("click", pageValidation);
}

function pageSignup() {
  header.textContent = "Send Account Request";
  username.placeholder = "Enter Full Name";
  emailInput.placeholder = "Decagon Approved Email";
  //loop to append option values to the select element ---->important
  const positions = ["Please Choose Your Position", "finance", "pa", "pl"];
  positions.forEach((position, i) => {
    const option = document.createElement("option");
    option.textContent = position;
    if (i === 0) {
      option.disabled = "true";
      option.selected = "true";
    }
    accountType.appendChild(option);
  });
  submitForm.type = "submit";
  submitForm.value = "Send Request";
  form.append(header, username, emailInput, accountType, submitForm);
  container.append(form);
  return container;
}

async function pageValidation(event) {
  event.preventDefault();
  if (
    username.value === "" ||
    emailInput.value === "" ||
    accountType.value === "Please Choose Your Position"
  ) {
    header.textContent = "Check Input and Try Again";
  } else {
    await fetch("/admin/admin-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: username.value,
        email: emailInput.value,
        accountType: accountType.value,
      }),
    });
  }
}
