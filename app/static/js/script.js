document.addEventListener("DOMContentLoaded", function () {

  // Main form elements
  const form = document.getElementById("profileForm");
  const steps = document.querySelectorAll(".question-step");
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");

  // Progress and error display elements
  const progressFill = document.getElementById("progressFill");
  const questionCounter = document.getElementById("questionCounter");
  const formErrorBox = document.getElementById("formErrorBox");
  const formErrorText = document.getElementById("formErrorText");

  // Income field elements
  const incomeInput = document.getElementById("income");
  const incomeHidden = document.getElementById("incomeHidden");

  // Track the currently visible step
  let currentStep = 0;

  // Updates which step is shown and refreshes progress indicators
  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    questionCounter.textContent = `Question ${currentStep + 1} of ${steps.length}`;
    progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    backBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";
    nextBtn.textContent = currentStep === steps.length - 1 ? "Finish" : "Next";

    hideFormError();
  }

  // Shows the main validation error box
  function showFormError(message) {
    formErrorText.textContent = message;
    formErrorBox.classList.remove("hidden");
  }

  // Hides the main validation error box
  function hideFormError() {
    formErrorBox.classList.add("hidden");
  }

  // Clears step-level error styling before validating again
  function clearStepError(step) {
    const tileGroup = step.querySelector(".tile-group");
    const warning = step.querySelector(".field-warning");
    const error = step.querySelector(".field-error");
    const input = step.querySelector(".form-input");

    if (tileGroup) tileGroup.classList.remove("error");
    if (warning) warning.classList.add("hidden");
    if (error) error.textContent = "";
    if (input) input.classList.remove("error");
  }

  // Validates the current step before allowing navigation to continue
  function validateStep() {
    const step = steps[currentStep];
    const tileGroup = step.querySelector(".tile-group");
    const input = step.querySelector(".form-input");
    const warning = step.querySelector(".field-warning");
    const error = step.querySelector(".field-error");

    clearStepError(step);

    // Tile-based questions require one selected option
    if (tileGroup) {
      const selected = tileGroup.querySelector(".tile.selected");

      if (!selected) {
        tileGroup.classList.add("error");
        if (warning) warning.classList.remove("hidden");
        if (error) error.textContent = "Please complete all fields to continue.";
        showFormError("Please complete all fields to continue.");
        return false;
      }

      return true;
    }

    // Input-based question for weekly income only
    if (input) {
      const value = input.value.trim();

      if (!value) {
        input.classList.add("error");
        if (warning) warning.classList.remove("hidden");
        if (error) error.textContent = "Please complete all fields to continue.";
        showFormError("Please complete all fields to continue.");
        return false;
      }

      // Income must be numeric so backend receives a clean value
      if (!/^\d+$/.test(value)) {
        input.classList.add("error");
        if (warning) warning.classList.remove("hidden");
        if (error) error.textContent = "Please enter a valid weekly income amount.";
        showFormError("Please enter a valid weekly income amount.");
        return false;
      }

      return true;
    }

    return true;
  }

  // Handles tile selection and stores the chosen value in the matching hidden input
  document.querySelectorAll(".tile-group").forEach((group) => {
    const tiles = group.querySelectorAll(".tile");

    tiles.forEach((tile) => {
      tile.addEventListener("click", function () {
        tiles.forEach((t) => t.classList.remove("selected"));
        tile.classList.add("selected");

        const step = tile.closest(".question-step");
        clearStepError(step);
        hideFormError();

        const groupName = group.dataset.name;
        const hiddenInput = document.getElementById(`${groupName}Input`);

        if (hiddenInput) {
          hiddenInput.value = tile.textContent.trim();
        }
      });
    });
  });

  // Keeps income input numeric and copies the value into the hidden field for submission
  if (incomeInput && incomeHidden) {
    incomeInput.addEventListener("input", function () {
      const cleaned = this.value.replace(/[^\d]/g, "");
      this.value = cleaned;
      incomeHidden.value = cleaned;

      const step = this.closest(".question-step");
      clearStepError(step);
      hideFormError();
    });
  }

  // Moves forward only when the current step is valid
  nextBtn.addEventListener("click", function () {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep += 1;
      updateStep();
    } else {
      // Final step submits the completed profile form to Flask
      form.submit();
    }
  });

  // Moves back to the previous step without losing the selected values
  backBtn.addEventListener("click", function () {
    if (currentStep > 0) {
      currentStep -= 1;
      updateStep();
    }
  });

  // Initializes the first visible step when the page loads
  updateStep();
});