const notifications = document.querySelector("#notifications");
const display = document.querySelector("#display");
const allApplicants = document.querySelector("#all-applicants");

window.addEventListener("DOMContentLoaded", startEngine);

async function startEngine() {
  const newAdminAccounts = await (await checkAccountRequest()).json();
  //if any pending request, send to notifications panel
  displayNewAccounts(newAdminAccounts.requests);
  allApplicants.addEventListener("click", getAllApplicants);
}

//check for new account request notification
async function checkAccountRequest() {
  return await fetch("/admin/checkAccountRequest");
}

//display newAccounts in notifications panel
function displayNewAccounts(newAdminAccounts) {
  if (newAdminAccounts.length > 0) {
    newAdminAccounts.forEach((account) => {
      const notify = document.createElement("p");
      notify.id = "notify-para";
      notify.textContent = `${account.fullname} with email ${
        account.email
      } needs Admin Access as ${account.position.toUpperCase()}`;
      notifications.appendChild(notify);
    });
  }
}

//get all applicants
async function getAllApplicants() {
  const { applicants } = await (await fetch("/admin/getAllApplicants")).json();
  if (applicants.length > 0) {
    //clear display
    display.replaceChildren();
    const ul = document.createElement("ul");
    ul.className = "list-group";
    applicants.forEach((applicant) => {
      const li = document.createElement("li");
      li.addEventListener("click", explodeApplicant);
      //setting each id to applicant email address
      li.id = applicant.emailAddress;
      //important-----!!!!!
      li.data = applicant;
      li.className = "list-group-item";
      li.textContent = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`;
      ul.appendChild(li);
    });
    display.appendChild(ul);
  }
  //explode view for each applicant
  function explodeApplicant(event) {
    const data = event.target.data;
    //clear display ----important
    display.replaceChildren();
    const heading = document.createElement("h1");
    heading.style.display = "block";
    heading.style.textAlign = "center";
    heading.style.textDecoration = "underline";
    heading.textContent = `${data.firstName} ${data.middleName} ${data.lastName}`;
    //applicant details
    const form = document.createElement("form");
    const courseOfStudy = document.createElement("input");
    const currentLocation = document.createElement("input");
    const dateOfBirth = document.createElement("input");
    const emailAddress = document.createElement("input");
    const firstName = document.createElement("input");
    const gender = document.createElement("input");
    const gradeAchieved = document.createElement("input");
    const highestQualification = document.createElement("input");
    const lastName = document.createElement("input");
    const middleName = document.createElement("input");
    const nyscStatus = document.createElement("input");
    const phoneNumber = document.createElement("input");
    const stateOfOrigin = document.createElement("input");
    const whatsappNumber = document.createElement("input");
    const acceptApplicant = document.createElement("button");
    const rejectApplicant = document.createElement("button");
    //********************************************************** */
    //********************************************************** */
    //********************************************************** */
    courseOfStudy.value = data.courseOfStudy;
    courseOfStudy.placeholder = "Course of Study";
    currentLocation.value = data.currentLocation;
    currentLocation.placeholder = "Current Location";
    dateOfBirth.value = new Date(data.dateOfBirth).toDateString();
    dateOfBirth.placeholder = "Date of Birth";
    emailAddress.value = data.emailAddress;
    emailAddress.disabled = "true";
    emailAddress.placeholder = "Email Address";
    firstName.value = data.firstName;
    firstName.placeholder = "First Name";
    gender.value = data.gender;
    gender.placeholder = "Gender";
    gradeAchieved.value = data.gradeAchieved;
    gradeAchieved.placeholder = "Grade Achieved";
    highestQualification.value = data.highestQualification;
    highestQualification.placeholder = "Highest Qualification Achieved";
    lastName.value = data.lastName;
    lastName.placeholder = "Last Name";
    middleName.value = data.middleName;
    middleName.placeholder = "Middle Name";
    nyscStatus.value = data.nyscStatus;
    nyscStatus.placeholder = "NYSC status";
    phoneNumber.value = data.phoneNumber;
    phoneNumber.placeholder = "Phone Number";
    stateOfOrigin.value = data.stateOfOrigin;
    stateOfOrigin.placeholder = "State Of Origin";
    whatsappNumber.value = data.whatsappPhoneNumber;
    whatsappNumber.placeholder = "WhatsApp Number";
    rejectApplicant.textContent = "Reject Applicant";
    rejectApplicant.className = "btn btn-danger";
    acceptApplicant.textContent = "Accept Applicant";
    acceptApplicant.className = "btn btn-success";
    rejectApplicant.addEventListener("click", applicantsAction);
    acceptApplicant.addEventListener("click", applicantsAction);
    form.append(
      courseOfStudy,
      currentLocation,
      dateOfBirth,
      emailAddress,
      firstName,
      gender,
      gradeAchieved,
      highestQualification,
      lastName,
      middleName,
      nyscStatus,
      phoneNumber,
      stateOfOrigin,
      whatsappNumber,
      rejectApplicant,
      acceptApplicant
    );
    display.append(heading, form);

    //funtions for applicants buttons
    async function applicantsAction(event) {
      event.preventDefault();
      if (event.target.textContent === "Reject Applicant") {
        await fetch("/admin/deleteApplicant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailAddress.value,
          }),
        });
        location.reload();
      } else {
        //accept the applicant
        //steps move applicants details to successful in db and delete in current DB
        await fetch("/admin/acceptApplicant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        });
        location.reload();
      }
    }
  }
}
