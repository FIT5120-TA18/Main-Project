document.querySelectorAll(".tile-group").forEach((group) => {
  group.addEventListener("click", (e) => {
    if (e.target.classList.contains("tile")) {
      group.querySelectorAll(".tile").forEach((tile) => {
        tile.classList.remove("selected");
      });

      e.target.classList.add("selected");
      group.classList.remove("error");
      hideFormError();
    }
  });
});

const incomeInput = document.getElementById("income");
const incomeError = document.getElementById("incomeError");

if (incomeInput) {
  incomeInput.addEventListener("input", () => {
    incomeInput.value = incomeInput.value.replace(/[^\d]/g, "");

    if (incomeInput.value !== "") {
      const incomeValue = Number(incomeInput.value);

      if (incomeValue >= 0 && incomeValue <= 5000) {
        incomeInput.classList.remove("error");
        incomeError.textContent = "";
        hideFormError();
      }
    }
  });
}

function showFormError(message) {
  const box = document.getElementById("formErrorBox");
  const text = document.getElementById("formErrorText");
  text.textContent = message;
  box.classList.remove("hidden");
}

function hideFormError() {
  const box = document.getElementById("formErrorBox");
  box.classList.add("hidden");
}

function validateForm() {
  let valid = true;
  let hasMissingFields = false;

  document.querySelectorAll(".tile-group").forEach((group) => {
    const selected = group.querySelector(".selected");
    if (!selected) {
      group.classList.add("error");
      hasMissingFields = true;
      valid = false;
    } else {
      group.classList.remove("error");
    }
  });

  const incomeValue = incomeInput.value.trim();

  if (incomeValue === "") {
    incomeInput.classList.add("error");
    incomeError.textContent = "Please complete all fields to continue.";
    hasMissingFields = true;
    valid = false;
  } else if (isNaN(incomeValue) || Number(incomeValue) < 0 || Number(incomeValue) > 5000) {
    incomeInput.classList.add("error");
    incomeError.textContent = "Please enter a valid weekly income amount in dollars.";
    valid = false;
  } else {
    incomeInput.classList.remove("error");
    incomeError.textContent = "";
  }

  if (!valid) {
    if (hasMissingFields) {
      showFormError("Please complete all fields to continue.");
    } else {
      showFormError("Please enter a valid weekly income amount in dollars.");
    }
    return;
  }

  hideFormError();

  window.location.href = "/quick-profile-step-2";
}