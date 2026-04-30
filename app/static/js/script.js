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

  const allowanceBox = document.getElementById("allowanceBox");
  const allowanceInput = document.getElementById("allowanceInput");
  const allowanceFrequency = document.getElementById("allowanceFrequency");
  const allowanceError = document.getElementById("allowanceError");
  const weeklyEstimate = document.getElementById("weeklyEstimate");
  const weeklyEstimateValue = document.getElementById("weeklyEstimateValue");

  const industryBox = document.getElementById("industryBox");
  const industrySelect = document.getElementById("industrySelect");
  const industryInput = document.getElementById("industryInput");

  const rentBox = document.getElementById("rentBox");
  const rentInput = document.getElementById("rentInput");
  const rentHidden = document.getElementById("rentHidden");
  const rentError = document.getElementById("rentError");

  const locationSearchBox = document.getElementById("locationSearchBox");
  const locationInput = document.getElementById("locationInput");
  const localityInput = document.getElementById("localityInput");
  const postcodeInput = document.getElementById("postcodeInput");
  const locationSuggestions = document.getElementById("locationSuggestions");

  const studyFieldBox = document.getElementById("studyFieldBox");
  const studyFieldList = document.getElementById("studyFieldList");
  const studyFieldInput = document.getElementById("studyFieldInput");
  const studyFieldLabel = document.getElementById("studyFieldLabel");

  if (industrySelect && industryInput) {
  industrySelect.addEventListener("change", function () {
    industryInput.value = industrySelect.value;
    hideGlobalError();

    const currentStepEl = industrySelect.closest(".question-step");
    const errorText = currentStepEl.querySelector(".field-error");
    const warning = currentStepEl.querySelector(".field-warning");

    if (errorText) errorText.textContent = "";
    if (warning) warning.classList.add("hidden");
  });
}

  if (
    locationSearchBox &&
    document.getElementById("stateInput").value.trim()
  ) {
    locationSearchBox.classList.remove("hidden");
  }

  if (
    locationInput &&
    localityInput &&
    postcodeInput &&
    localityInput.value &&
    postcodeInput.value
  ) {
    locationInput.value = `${localityInput.value} (${postcodeInput.value})`;
  }

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

    // Age input validation
    if (stepIndex === 0) {
      const ageInput = document.getElementById("age");
      const ageHidden = document.getElementById("ageInput");
      const ageWarning = document.getElementById("ageWarning");

      const rawAge = ageInput.value.trim();

      // Empty Field
      if (!rawAge) {
        ageInput.classList.add("input-error");
        showGlobalError("Please complete this field to continue.");
        return false;
      }

      // If anything other than numbers
      if (!/^\d+$/.test(rawAge)) {
        ageInput.classList.add("input-error");
        showGlobalError("Please enter numbers only.");
        return false;
      }

      // Decimal Base 10 for consistency
      const ageNumber = parseInt(rawAge, 10);
      if (ageNumber < 18 || ageNumber > 22) {
        showGlobalError("Sorry! currently we only cater to audience from the age 18-22");
        return false;
      }
      ageHidden.value = ageNumber;
    }

    if (stepIndex === 1) {
      if (!localityInput.value.trim() || !postcodeInput.value.trim()) {
        showGlobalError("Please select a locality or postcode from the suggestions.");
        locationInput.classList.add("input-error");
        return false;
      }

      locationInput.classList.remove("input-error");
    }

    // User input (text box) validation
    if (stepIndex === 4) {
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

        // Rent validation only for Shared rental or Living alone
    if (stepIndex === 4) {
      const livingValue = document.getElementById("livingInput").value.trim();

      if (livingValue === "Shared rental" || livingValue === "Living alone") {
        const rawRent = rentInput.value.trim();

        if (!rawRent) {
          if (rentError) rentError.textContent = "Please enter your weekly rent.";
          rentInput.classList.add("input-error");
          showGlobalError("Please enter your weekly rent.");
          return false;
        }

        if (!/^\d+$/.test(rawRent)) {
          if (rentError) rentError.textContent = "Please enter a valid weekly rent amount.";
          rentInput.classList.add("input-error");
          showGlobalError("Please enter a valid weekly rent amount.");
          return false;
        }

        rentHidden.value = rawRent;
      }
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

        if (fieldName === "work") {
          const selectedWork = tile.textContent.trim();

          if (selectedWork === "Not working") {
            if (allowanceBox) allowanceBox.classList.remove("hidden");
            if (industryBox) industryBox.classList.add("hidden");
          } else {
            if (allowanceBox) allowanceBox.classList.add("hidden");

            if (industryBox) {
              industryBox.classList.remove("hidden");
              loadIndustries();
            }
          }
        }

        if (fieldName === "study") {
          const selectedStudy = tile.textContent.trim();

          if (studyFieldBox) {
            studyFieldBox.classList.remove("hidden");
          }

          if (studyFieldLabel) {
            if (selectedStudy === "No") {
              studyFieldLabel.textContent =
                "What field are you interested in pursuing a qualification in?";
            } else {
              studyFieldLabel.textContent =
                "What field are you pursuing your studies in?";
            }
          }

          if (studyFieldInput) {
            studyFieldInput.value = "";
          }

          if (studyFieldList) {
            studyFieldList.innerHTML = "";
          }

          loadStudyFields();
        }

        if (fieldName === "living") {
          const selectedLiving = tile.textContent.trim();

          if (selectedLiving === "Shared rental" || selectedLiving === "Living alone") {
            if (rentBox) rentBox.classList.remove("hidden");
          } else {
            if (rentBox) rentBox.classList.add("hidden");
            if (rentInput) rentInput.value = "";
            if (rentHidden) rentHidden.value = "";
            if (rentError) rentError.textContent = "";
          }
        }

        if (fieldName === "state") {
          if (locationSearchBox) {
            locationSearchBox.classList.remove("hidden");
          }

          if (locationInput) {
            locationInput.value = "";
            locationInput.focus();
          }

          if (localityInput) localityInput.value = "";
          if (postcodeInput) postcodeInput.value = "";
          if (locationSuggestions) locationSuggestions.innerHTML = "";
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

    if (rentInput && rentHidden) {
    rentInput.value = rentHidden.value;

    rentInput.addEventListener("input", function () {
      rentInput.value = rentInput.value.replace(/[^\d]/g, "");
      rentHidden.value = rentInput.value;

      rentInput.classList.remove("input-error");
      if (rentError) rentError.textContent = "";
      hideGlobalError();
    });
  }

    function updateAllowanceIncome() {
    if (!allowanceInput || !allowanceFrequency || !incomeHidden) return;

    allowanceInput.value = allowanceInput.value.replace(/[^\d]/g, "");

    const rawAmount = allowanceInput.value.trim();

    if (!rawAmount) {
      incomeHidden.value = "";
      if (weeklyEstimate) weeklyEstimate.classList.add("hidden");
      return;
    }

    const amount = parseFloat(rawAmount);

    if (allowanceFrequency.value === "weekly") {
      incomeHidden.value = Math.round(amount);
      if (weeklyEstimate) weeklyEstimate.classList.add("hidden");
    }

    if (allowanceFrequency.value === "monthly") {
      const weeklyAmount = (amount * 12) / 52;
      const roundedWeekly = Math.round(weeklyAmount);

      incomeHidden.value = roundedWeekly;

      if (weeklyEstimateValue) weeklyEstimateValue.textContent = roundedWeekly;
      if (weeklyEstimate) weeklyEstimate.classList.remove("hidden");
    }
  }

    async function loadIndustries() {
      if (!industrySelect) return;

      try {
        const response = await fetch("/api/industries");
        const data = await response.json();

        let industries = [];

        if (Array.isArray(data)) {
          industries = data;
        } else if (Array.isArray(data.industries)) {
          industries = data.industries;
        }

        industrySelect.innerHTML = `<option value="">Select an industry</option>`;

        industries.forEach((item) => {
          const industry = typeof item === "string" ? item : item.industry;
          if (!industry) return;

          const option = document.createElement("option");
          option.value = industry;
          option.textContent = industry;

          if (industryInput && industryInput.value === industry) {
            option.selected = true;
          }

          industrySelect.appendChild(option);
        });
      } catch (error) {
        console.error("Error loading industries:", error);
      }
    }

    async function loadStudyFields() {
    if (!studyFieldList) return;

    try {
      const response = await fetch("/api/industries");
      const data = await response.json();

      let fields = [];

      if (Array.isArray(data)) {
        fields = data;
      } else if (Array.isArray(data.industries)) {
        fields = data.industries;
      }

      studyFieldList.innerHTML = "";

      fields.forEach((item) => {
        const field = typeof item === "string" ? item : item.industry;
        if (!field) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "industry-option";
        btn.textContent = field;

        btn.addEventListener("click", function () {
          const allButtons = studyFieldList.querySelectorAll(".industry-option");
          allButtons.forEach((b) => b.classList.remove("selected"));

          btn.classList.add("selected");

          if (studyFieldInput) {
            studyFieldInput.value = field;
          }

          hideGlobalError();

          const currentStepEl = btn.closest(".question-step");
          const errorText = currentStepEl.querySelector(".field-error");
          const warning = currentStepEl.querySelector(".field-warning");

          if (errorText) errorText.textContent = "";
          if (warning) warning.classList.add("hidden");
        });

        studyFieldList.appendChild(btn);
      });
    } catch (error) {
      console.error("Error loading study fields:", error);
    }
  }

    if (industrySelect && industryInput) {
      industrySelect.addEventListener("change", function () {
        industryInput.value = industrySelect.value;
      });
    }

    if (allowanceInput) {
    allowanceInput.addEventListener("input", function () {
      allowanceInput.classList.remove("input-error");
      if (allowanceError) allowanceError.textContent = "";

      updateAllowanceIncome();
      hideGlobalError();
    });
  }

  if (allowanceFrequency) {
    allowanceFrequency.addEventListener("change", function () {
      updateAllowanceIncome();
    });
  }

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
      const workValue = document.getElementById("workInput").value.trim();

      // If user is not working, skip income question and go to study status
      if (currentStep === 3 && workValue === "Not working") {
        currentStep = 5;
      } else {
        currentStep++;
      }

      updateStep();
    } else {
      form.submit();
    }
  });

  // Back button
  backBtn.addEventListener("click", function () {
    if (currentStep > 0) {
      const workValue = document.getElementById("workInput").value.trim();

      // If coming back from Study and user is Not working, skip Income
      if (currentStep === 5 && workValue === "Not working") {
        currentStep = 3;
      } else {
        currentStep--;
      }

      updateStep();
    }
  });

  if (locationInput && locationSuggestions) {
  locationInput.addEventListener("input", async function () {
    const query = locationInput.value.trim();
    const selectedState = document.getElementById("stateInput").value.trim();

    if (localityInput) localityInput.value = "";
    if (postcodeInput) postcodeInput.value = "";

    if (!selectedState || query.length < 2) {
      locationSuggestions.innerHTML = "";
      return;
    }

    try {
      const response = await fetch(
        `/api/locations?state=${encodeURIComponent(selectedState)}&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!data.length) {
        locationSuggestions.innerHTML = `
          <div class="location-suggestion-item no-result">
            No matching locality found
          </div>
        `;
        return;
      }

      locationSuggestions.innerHTML = data.map(item => `
        <button
          type="button"
          class="location-suggestion-item"
          data-locality="${item.locality}"
          data-postcode="${item.postcode}"
        >
          ${item.locality} (${item.postcode})
        </button>
      `).join("");

    } catch (error) {
      locationSuggestions.innerHTML = "";
      console.error("Location fetch error:", error);
    }
  });

  locationSuggestions.addEventListener("click", function (e) {
    const item = e.target.closest(".location-suggestion-item");
    if (!item || item.classList.contains("no-result")) return;

    const locality = item.dataset.locality;
    const postcode = item.dataset.postcode;

    locationInput.value = `${locality} (${postcode})`;
    localityInput.value = locality;
    postcodeInput.value = postcode;

    locationSuggestions.innerHTML = "";
  });
  }

  const existingLiving = document.getElementById("livingInput").value.trim();

  if (existingLiving === "Shared rental" || existingLiving === "Living alone") {
    if (rentBox) rentBox.classList.remove("hidden");
  } else {
    if (rentBox) rentBox.classList.add("hidden");
  }

  const hash = window.location.hash;

  if (hash && hash.startsWith("#step-")) {
    const stepNumber = parseInt(hash.replace("#step-", ""), 10);

    if (!Number.isNaN(stepNumber)) {
      currentStep = stepNumber - 1;
    }
  }

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