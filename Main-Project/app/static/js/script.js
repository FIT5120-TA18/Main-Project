// Run on load only
document.addEventListener("DOMContentLoaded", function () {
  initStep1();
  initStep2();
  initPathwaysCountdown();
});

// Profile builder step 1 of 2
function initStep1() {

  // Element ID for Form in Step 1
  const form = document.getElementById("profileForm");
  if (!form) return;

  // Elements of step 1 page 
  const steps = document.querySelectorAll(".question-step"); // 
  const nextBtn = document.getElementById("nextBtn"); // Next button
  const backBtn = document.getElementById("backBtn"); // Go back button
  const progressFill = document.getElementById("progressFill"); // Bar at the top of the question
  const questionCounter = document.getElementById("questionCounter"); // Question number
  const formErrorBox = document.getElementById("formErrorBox"); // Error box
  const formErrorText = document.getElementById("formErrorText"); // Text in the box

  const incomeInput = document.getElementById("income"); // Input by user
  const incomeHidden = document.getElementById("incomeHidden"); // Hides after user submits
  const incomeWarning = document.getElementById("incomeWarning"); // Warning for income
  const incomeError = document.getElementById("incomeError"); // Error

  let currentStep = 0; // Initialize counter for progress bar

  function updateStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    // Question counter updating
    questionCounter.textContent = `Question ${currentStep + 1} of ${steps.length}`;

    // Filling progress bar to the corresponding number of questions done
    progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;

    // Do not show back button on Q1
    backBtn.style.visibility = currentStep === 0 ? "hidden" : "visible";

    // Change next to finish on last Q
    nextBtn.textContent = currentStep === steps.length - 1 ? "Finish" : "Next";

    hideGlobalError();
  }

  // Error handling message; Global setting
  function hideGlobalError() {
    if (!formErrorBox || !formErrorText) return;
    formErrorBox.classList.add("hidden");
    formErrorText.textContent = "Please complete all fields to continue.";
  }

  function showGlobalError(message) {
    if (!formErrorBox || !formErrorText) return;
    formErrorBox.classList.remove("hidden");
    formErrorText.textContent = message;
  }

  // After user fixes the error, they should go away, for different steps
  function clearStepErrors(step) {
    const errorText = step.querySelector(".field-error");
    const warning = step.querySelector(".field-warning");
    const tiles = step.querySelectorAll(".tile");

    if (errorText) errorText.textContent = "";
    if (warning) warning.classList.add("hidden");

    tiles.forEach(tile => tile.classList.remove("input-error"));

    if (incomeInput) incomeInput.classList.remove("input-error");
    if (incomeWarning) incomeWarning.classList.add("hidden");
    if (incomeError) incomeError.textContent = "";
  }

  // User Input validation
  function validateStep(stepIndex) {
    const step = steps[stepIndex];
    clearStepErrors(step);

    const tileGroup = step.querySelector(".tile-group");
    const warning = step.querySelector(".field-warning");
    const errorText = step.querySelector(".field-error");

    if (tileGroup) {
      const fieldName = tileGroup.dataset.name;
      const hiddenInput = document.getElementById(fieldName + "Input");

      if (!hiddenInput || !hiddenInput.value.trim()) {
        if (warning) warning.classList.remove("hidden");
        if (errorText) errorText.textContent = "Please complete this field to continue.";
        tileGroup.querySelectorAll(".tile").forEach(tile => tile.classList.add("input-error"));
        showGlobalError("Please complete the field to continue.");
        return false;
      }
    }

    // User input (text box) validation
    if (stepIndex === 3) {
      const rawValue = incomeInput.value.trim();

      // Empty input
      if (!rawValue) {
        if (incomeWarning) incomeWarning.classList.remove("hidden");
        if (incomeError) incomeError.textContent = "Please enter your weekly income.";
        incomeInput.classList.add("input-error");
        showGlobalError("Please complete this field to continue.");
        return false;
      }

      // Anything other than number
      if (!/^\d+$/.test(rawValue)) {
        if (incomeWarning) incomeWarning.classList.remove("hidden");
        if (incomeError) incomeError.textContent =
          "Please enter a valid weekly income amount in dollars.";
        incomeInput.classList.add("input-error");
        showGlobalError("Please enter a valid weekly income amount in dollars.");
        return false;
      }

      const numericValue = parseInt(rawValue, 10);

      // Only positive values, because income
      if (numericValue < 0) {
        if (incomeWarning) incomeWarning.classList.remove("hidden");
        if (incomeError) incomeError.textContent = "Income must be greater than $0";
        incomeInput.classList.add("input-error");
        showGlobalError("Income must be greater than $0");
        return false;
      }

      // Pass case
      incomeHidden.value = rawValue;
    }
    return true;
  }

  document.querySelectorAll(".tile-group").forEach(group => {
    const fieldName = group.dataset.name;
    const hiddenInput = document.getElementById(fieldName + "Input");
    const tiles = group.querySelectorAll(".tile");

    // Data from session store
    tiles.forEach(tile => {
      if (hiddenInput && tile.textContent.trim() === hiddenInput.value.trim()) {
        tile.classList.add("selected");
      }

    // Tile behavior - options 
      tile.addEventListener("click", function () {
        tiles.forEach(t => {
          t.classList.remove("selected");
          t.classList.remove("input-error");
        });

        tile.classList.add("selected");

        if (hiddenInput) {
          hiddenInput.value = tile.textContent.trim();
        }

        const currentStepEl = tile.closest(".question-step");
        if (currentStepEl) {
          const warning = currentStepEl.querySelector(".field-warning");
          const errorText = currentStepEl.querySelector(".field-error");
          if (warning) warning.classList.add("hidden");
          if (errorText) errorText.textContent = "";
        }

        hideGlobalError();
      });
    });
  });

  // Validation for numeric data
  if (incomeInput && incomeHidden) {
    incomeInput.value = incomeHidden.value;

    incomeInput.addEventListener("input", function () {
      incomeInput.value = incomeInput.value.replace(/[^\d]/g, "");
      incomeHidden.value = incomeInput.value;
      incomeInput.classList.remove("input-error");
      if (incomeWarning) incomeWarning.classList.add("hidden");
      if (incomeError) incomeError.textContent = "";
      hideGlobalError();
    });
  }

  // Proceed next button behaviour 
  nextBtn.addEventListener("click", function () {
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStep();
    } else {
      form.submit();
    }
  });

  // Back button
  backBtn.addEventListener("click", function () {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  updateStep();
}

// Profile builder step 2 of 2
function initStep2() {
  const form = document.getElementById("step2Form");
  const goalInput = document.getElementById("goalInput");

  if (!form || !goalInput) return;

  const goalTiles = document.querySelectorAll(".goal-tile");

  function syncSelectedGoal() {
    const currentValue = goalInput.value.trim();

    goalTiles.forEach(tile => {
      tile.classList.toggle("selected", tile.dataset.value === currentValue);
    });
  }

  goalTiles.forEach(tile => {
    tile.addEventListener("click", function () {
      goalInput.value = tile.dataset.value;
      syncSelectedGoal();

      const existingError = form.querySelector(".form-error-box");
      if (existingError) {
        existingError.classList.add("hidden");
      }
    });
  });

  form.addEventListener("submit", function (e) {
    if (!goalInput.value.trim()) {
      e.preventDefault();

      let errorBox = form.querySelector(".form-error-box");

      if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.className = "form-error-box";
        errorBox.innerHTML = `
          <span class="warning-icon">⚠</span>
          <span>Please select one option to continue.</span>
        `;
        form.insertBefore(errorBox, form.querySelector(".form-actions"));
      } else {
        errorBox.classList.remove("hidden");
      }
    }
  });

  syncSelectedGoal();
}