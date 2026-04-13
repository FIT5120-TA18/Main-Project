document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".question-step");
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const progressFill = document.getElementById("progressFill");
  const questionCounter = document.getElementById("questionCounter");

  const incomeInput = document.getElementById("income");
  const incomeError = document.getElementById("incomeError");
  const incomeWarning = document.getElementById("incomeWarning");

  let currentStep = 0;

  function showFormError(message) {
    const box = document.getElementById("formErrorBox");
    const text = document.getElementById("formErrorText");
    text.textContent = message;
    box.classList.remove("hidden");
  }

  function hideFormError() {
    document.getElementById("formErrorBox").classList.add("hidden");
  }

  function getCurrentStepElement() {
    return steps[currentStep];
  }

  function showTileGroupError(group) {
    group.classList.add("error");

    const shell = group.closest(".field-shell");
    const warning = shell.querySelector(".field-warning");
    const errorText = shell.parentElement.querySelector(".field-error");

    if (warning) warning.classList.remove("hidden");
    if (errorText) errorText.textContent = "Please complete all fields to continue.";
  }

  function clearTileGroupError(group) {
    group.classList.remove("error");

    const shell = group.closest(".field-shell");
    const warning = shell.querySelector(".field-warning");
    const errorText = shell.parentElement.querySelector(".field-error");

    if (warning) warning.classList.add("hidden");
    if (errorText) errorText.textContent = "";
  }

  function showIncomeError(message) {
    incomeInput.classList.add("error");
    if (incomeWarning) incomeWarning.classList.remove("hidden");
    if (incomeError) incomeError.textContent = message;
  }

  function clearIncomeError() {
    incomeInput.classList.remove("error");
    if (incomeWarning) incomeWarning.classList.add("hidden");
    if (incomeError) incomeError.textContent = "";
  }

  function updateStepUI() {
    steps.forEach((step, index) => {
      if (index === currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    questionCounter.textContent = `Question ${currentStep + 1} of ${steps.length}`;
    progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    backBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";
    nextBtn.textContent = currentStep === steps.length - 1 ? "Continue" : "Next";
  }

  function validateCurrentStep() {
    const step = getCurrentStepElement();
    const tileGroup = step.querySelector(".tile-group");

    hideFormError();

    if (tileGroup) {
      const selected = tileGroup.querySelector(".selected");

      if (!selected) {
        showTileGroupError(tileGroup);
        showFormError("Please complete all fields to continue.");
        return false;
      }

      clearTileGroupError(tileGroup);
      return true;
    }

    if (step.contains(incomeInput)) {
      const incomeValue = incomeInput.value.trim();

      if (incomeValue === "") {
        showIncomeError("Please complete all fields to continue.");
        showFormError("Please complete all fields to continue.");
        return false;
      }

      if (!/^\d+$/.test(incomeValue)) {
        showIncomeError("Please enter a valid weekly income amount in dollars.");
        showFormError("Please enter a valid weekly income amount in dollars.");
        return false;
      }

      const numericValue = Number(incomeValue);

      if (numericValue < 0 || numericValue > 5000) {
        showIncomeError("Please enter a valid weekly income amount in dollars.");
        showFormError("Please enter a valid weekly income amount in dollars.");
        return false;
      }

      clearIncomeError();
      return true;
    }

    return true;
  }

  document.querySelectorAll(".tile-group").forEach((group) => {
    const tiles = group.querySelectorAll(".tile");

    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        tiles.forEach((t) => t.classList.remove("selected"));
        tile.classList.add("selected");
        clearTileGroupError(group);
        hideFormError();
      });
    });
  });

  if (incomeInput) {
    incomeInput.addEventListener("input", () => {
      const value = incomeInput.value.trim();

      if (value === "") {
        clearIncomeError();
        return;
      }

      if (!/^\d+$/.test(value)) {
        showIncomeError("Please enter a valid weekly income amount in dollars.");
        return;
      }

      const numericValue = Number(value);

      if (numericValue < 0 || numericValue > 5000) {
        showIncomeError("Please enter a valid weekly income amount in dollars.");
        return;
      }

      clearIncomeError();
      hideFormError();
    });
  }

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep += 1;
      hideFormError();
      updateStepUI();
    } else {
      window.location.href = "/quick-profile-step-2";
    }
  });

  backBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      hideFormError();
      updateStepUI();
    }
  });

  updateStepUI();
});