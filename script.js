// Compliance-Upgrade: Decision & Transfer Practice
// Week 6 Business Bending MVP

let startTime = null;
let timerInterval = null;
let endTime = null;

const state = {
  scenario1: {
    answer: null,
    correct: false
  },
  scenario2: {
    answer: null,
    correct: false
  }
};

// -------------------------
// TIMER
// -------------------------

function startTimer() {
  startTime = Date.now();
  endTime = null;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    updateTimer();
  }, 1000);

  updateTimer();
}

function stopTimer() {
  if (startTime) {
    endTime = Date.now();
  }

  clearInterval(timerInterval);
  timerInterval = null;
  updateTimer();
}

function getElapsedSeconds() {
  if (!startTime) return 0;

  const end = endTime || Date.now();
  return Math.floor((end - startTime) / 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function updateTimer() {
  const timerElement = document.getElementById("timer");

  if (timerElement) {
    timerElement.textContent = formatTime(getElapsedSeconds());
  }
}

// -------------------------
// SCREEN MANAGEMENT
// -------------------------

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// -------------------------
// START ASSESSMENT
// -------------------------

function startAssessment() {
  startTimer();

  state.scenario1.answer = null;
  state.scenario1.correct = false;

  state.scenario2.answer = null;
  state.scenario2.correct = false;

  const scenario1Form = document.getElementById("scenario1Form");
  const scenario2Form = document.getElementById("scenario2Form");

  if (scenario1Form) {
    scenario1Form.reset();
  }

  if (scenario2Form) {
    scenario2Form.reset();
  }

  showScreen("scenario1");
}

// -------------------------
// SCENARIO 1
// -------------------------

function submitScenario1() {
  const selected = document.querySelector(
    'input[name="scenario1"]:checked'
  );

  if (!selected) {
    alert("Please select an answer before continuing.");
    return;
  }

  state.scenario1.answer = selected.value;

  /*
    Validated safety cue:
    Sparks and smoke from an electrical junction box.

    The correct decision is to recognize that the rehearsed
    evacuation sequence should be reassessed because there
    is evidence of a new hazard.
  */

  if (selected.value === "reassess") {
    state.scenario1.correct = true;
  } else {
    state.scenario1.correct = false;
  }

  showScenario1Feedback();
}

function showScenario1Feedback() {
  const feedbackTitle = document.getElementById("scenario1FeedbackTitle");
  const feedbackText = document.getElementById("scenario1FeedbackText");

  if (!feedbackTitle || !feedbackText) {
    showScreen("scenario2");
    return;
  }

  if (state.scenario1.correct) {
    feedbackTitle.textContent = "Good decision";
    feedbackText.textContent =
      "You recognized the validated safety cue and reassessed the rehearsed sequence before continuing.";
  } else {
    feedbackTitle.textContent = "Reassess the situation";
    feedbackText.textContent =
      "The scenario included a validated safety cue. The safer decision was to pause and reassess instead of automatically continuing the rehearsed sequence.";
  }

  showScreen("scenario1Feedback");
}

// -------------------------
// SCENARIO 2
// -------------------------

function continueToScenario2() {
  /*
    Reset Scenario 2 radios when entering the transfer scenario.
    This prevents the previous selection from carrying over.
  */

  const scenario2Form = document.getElementById("scenario2Form");

  if (scenario2Form) {
    scenario2Form.reset();
  }

  state.scenario2.answer = null;
  state.scenario2.correct = false;

  showScreen("scenario2");
}

function submitScenario2() {
  const selected = document.querySelector(
    'input[name="scenario2"]:checked'
  );

  if (!selected) {
    alert("Please select an answer before continuing.");
    return;
  }

  state.scenario2.answer = selected.value;

  /*
    Transfer scenario:
    A different physical situation creates the same underlying
    decision conflict.

    The correct response is again to reassess when a validated
    safety cue conflicts with the rehearsed route.
  */

  if (selected.value === "transfer") {
    state.scenario2.correct = true;
  } else {
    state.scenario2.correct = false;
  }

  showScenario2Feedback();
}

function showScenario2Feedback() {
  const feedbackTitle = document.getElementById("scenario2FeedbackTitle");
  const feedbackText = document.getElementById("scenario2FeedbackText");

  if (!feedbackTitle || !feedbackText) {
    finishAssessment();
    return;
  }

  if (state.scenario2.correct) {
    feedbackTitle.textContent = "Transfer recognized";
    feedbackText.textContent =
      "You applied the same reassessment judgment to a different scenario.";
  } else {
    feedbackTitle.textContent = "Look for the safety cue";
    feedbackText.textContent =
      "This new scenario contains a validated hazard that conflicts with the rehearsed route. The decision should be reassessed.";
  }

  showScreen("scenario2Feedback");
}

// -------------------------
// FINISH ASSESSMENT
// -------------------------

function finishAssessment() {
  stopTimer();

  updateSummary();

  showScreen("summary");
}

// -------------------------
// SUMMARY
// -------------------------

function updateSummary() {
  const totalSeconds = getElapsedSeconds();

  const durationElement = document.getElementById("summaryDuration");
  const scenario1Element = document.getElementById("summaryScenario1");
  const scenario2Element = document.getElementById("summaryScenario2");
  const transferElement = document.getElementById("summaryTransfer");
  const targetElement = document.getElementById("summaryTarget");

  if (durationElement) {
    durationElement.textContent = formatTime(totalSeconds);
  }

  if (scenario1Element) {
    scenario1Element.textContent = state.scenario1.correct
      ? "Correct reassessment"
      : "Did not reassess";
  }

  if (scenario2Element) {
    scenario2Element.textContent = state.scenario2.correct
      ? "Correct transfer"
      : "Did not transfer";
  }

  if (transferElement) {
    transferElement.textContent =
      state.scenario1.correct && state.scenario2.correct
        ? "Yes"
        : "Not demonstrated";
  }

  if (targetElement) {
    if (totalSeconds < 180) {
      targetElement.textContent =
        "Within the sub-3-minute target.";
    } else {
      targetElement.textContent =
        "Above the sub-3-minute target.";
    }
  }
}

// -------------------------
// RESTART
// -------------------------

function restartAssessment() {
  clearInterval(timerInterval);

  timerInterval = null;
  startTime = null;
  endTime = null;

  state.scenario1.answer = null;
  state.scenario1.correct = false;

  state.scenario2.answer = null;
  state.scenario2.correct = false;

  const scenario1Form = document.getElementById("scenario1Form");
  const scenario2Form = document.getElementById("scenario2Form");

  if (scenario1Form) {
    scenario1Form.reset();
  }

  if (scenario2Form) {
    scenario2Form.reset();
  }

  const timerElement = document.getElementById("timer");

  if (timerElement) {
    timerElement.textContent = "00:00";
  }

  showScreen("overview");
}

// -------------------------
// INITIALIZE
// -------------------------

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startAssessment");
  const scenario1Button = document.getElementById("submitScenario1");
  const continueButton = document.getElementById("continueToScenario2");
  const scenario2Button = document.getElementById("submitScenario2");
  const finishButton = document.getElementById("finishAssessment");
  const restartButton = document.getElementById("restartAssessment");

  if (startButton) {
    startButton.addEventListener("click", startAssessment);
  }

  if (scenario1Button) {
    scenario1Button.addEventListener("click", submitScenario1);
  }

  if (continueButton) {
    continueButton.addEventListener("click", continueToScenario2);
  }

  if (scenario2Button) {
    scenario2Button.addEventListener("click", submitScenario2);
  }

  if (finishButton) {
    finishButton.addEventListener("click", finishAssessment);
  }

  if (restartButton) {
    restartButton.addEventListener("click", restartAssessment);
  }

  showScreen("overview");
});
