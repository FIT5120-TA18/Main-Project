let q1Answer = null;
let q2Answer = null;

function selectOption(btn, question) {
  const parent = btn.closest(".option-list");
  parent
    .querySelectorAll(".option-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");

  if (question === "q1") {
    q1Answer = btn.dataset.value;
    document.getElementById("q1NextBtn").disabled = false;
  } else {
    q2Answer = btn.dataset.value;
    document.getElementById("q2NextBtn").disabled = false;
  }
}

function goStep1() {
  if (!q1Answer) return;

  const routes = window.appRoutes || {};

  if (q1Answer === "no") {
    sessionStorage.setItem(
      "debtAwareness",
      JSON.stringify({ creditType: "none", payer: "none" }),
    );
    window.location.href =
      routes.knowledge_hub || "underdevelopment/knowledge_hub";
    return;
  }

  if (q1Answer === "considering") {
    sessionStorage.setItem(
      "debtAwareness",
      JSON.stringify({ creditType: "considering", payer: "none" }),
    );
    window.location.href =
      routes.debt_projection || "underdevelopment/debt_projection";
    return;
  }

  // Show Q2
  document.getElementById("step0").classList.remove("active");
  document.getElementById("step1").classList.add("active");
  document.getElementById("dot0").classList.remove("active");
  document.getElementById("dot0").classList.add("done");
  document.getElementById("dot1").style.display = "block";
  document.getElementById("dot1").classList.add("active");
}

function goBack() {
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step0").classList.add("active");
  document.getElementById("dot1").classList.remove("active");
  document.getElementById("dot1").style.display = "none";
  document.getElementById("dot0").classList.remove("done");
  document.getElementById("dot0").classList.add("active");
}

function goToProjection() {
  if (!q2Answer) return;
  const routes = window.appRoutes || {};
  sessionStorage.setItem(
    "debtAwareness",
    JSON.stringify({ creditType: q1Answer, payer: q2Answer }),
  );
  window.location.href = routes.debt_projection || "/debt_projection";
}
