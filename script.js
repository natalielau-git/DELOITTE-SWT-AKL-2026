const TOTAL_QUESTIONS = 6;

// Access code shown on the Microsoft Forms thank-you page.
// Note: this is a light gate for event flow, not strong security.
const QUIZ_ACCESS_CODE = "SWT2026";
const UNLOCK_STORAGE_KEY = "swtAkl2026QuizUnlocked";

const passwordSection = document.getElementById("passwordSection");
const landingSection = document.getElementById("landingSection");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");
const passwordForm = document.getElementById("passwordForm");
const accessCodeInput = document.getElementById("accessCode");
const passwordError = document.getElementById("passwordError");
const quizForm = document.getElementById("quizForm");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const errorBox = document.getElementById("errorBox");

function isUnlocked() {
  return sessionStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
}

function unlockQuiz() {
  sessionStorage.setItem(UNLOCK_STORAGE_KEY, "true");
  setVisible(landingSection);
}

function lockQuiz() {
  sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
  quizForm.reset();
  errorBox.style.display = "none";
  updateSelectedCards();
  updateProgress();
  accessCodeInput.value = "";
  passwordError.style.display = "none";
  setVisible(passwordSection);
}

function classifyMaturity(score) {
  if (score <= 10) {
    return {
      maturity: "AI Explorer",
      description: "AI activity is mostly experimentation-focused. The next step is creating the leadership, data and governance foundations needed for scale.",
      recommendation: "Focus on aligning leaders around priority use cases, clarifying ownership and establishing practical governance foundations before scaling further."
    };
  }

  if (score <= 15) {
    return {
      maturity: "AI Builder",
      description: "Strong momentum exists, but foundations are still developing. Focus should shift from pilots toward repeatable enterprise capability.",
      recommendation: "Move from isolated pilots to repeatable delivery patterns, measurable value tracking and a clearer path for adoption across business teams."
    };
  }

  if (score <= 20) {
    return {
      maturity: "AI Scaler",
      description: "AI is beginning to deliver measurable value across the organisation. The challenge is now scaling securely and consistently.",
      recommendation: "Strengthen enterprise guardrails, reusable platforms, adoption support and value measurement so successful AI use cases can scale with confidence."
    };
  }

  return {
    maturity: "AI Leader",
    description: "Your organisation demonstrates many of the characteristics required to scale AI successfully. The focus shifts toward optimisation, agentic AI and sustaining competitive advantage.",
    recommendation: "Explore advanced operating models, agentic AI opportunities and continuous optimisation of AI-enabled workflows to sustain differentiation."
  };
}

function getAnsweredCount() {
  let answered = 0;

  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    if (document.querySelector(`input[name="q${i}"]:checked`)) {
      answered += 1;
    }
  }

  return answered;
}

function updateProgress() {
  const answered = getAnsweredCount();
  const percent = Math.round((answered / TOTAL_QUESTIONS) * 100);

  progressText.textContent = `${answered} of ${TOTAL_QUESTIONS} answered`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function updateSelectedCards() {
  document.querySelectorAll(".option").forEach(option => {
    const input = option.querySelector("input");
    option.classList.toggle("selected", Boolean(input && input.checked));
  });
}

function getQuizData() {
  let score = 0;

  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) return null;
    score += Number(selected.value);
  }

  const biggestChallenge = document.getElementById("biggestChallenge").value;
  if (!biggestChallenge) return null;

  const result = classifyMaturity(score);
  return { score, biggestChallenge, ...result };
}

function setVisible(section) {
  [passwordSection, landingSection, quizSection, resultSection].forEach(s => s.classList.add("hidden"));
  section.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

passwordForm.addEventListener("submit", event => {
  event.preventDefault();

  const submittedCode = accessCodeInput.value.trim().toUpperCase();
  const expectedCode = QUIZ_ACCESS_CODE.trim().toUpperCase();

  if (submittedCode === expectedCode) {
    passwordError.style.display = "none";
    unlockQuiz();
  } else {
    passwordError.style.display = "block";
  }
});

document.getElementById("startBtn").addEventListener("click", () => setVisible(quizSection));
document.getElementById("backToStartBtn").addEventListener("click", () => setVisible(landingSection));
document.getElementById("lockBtn").addEventListener("click", lockQuiz);
document.getElementById("lockFromResultBtn").addEventListener("click", lockQuiz);

document.getElementById("startAgainBtn").addEventListener("click", () => {
  quizForm.reset();
  errorBox.style.display = "none";
  updateSelectedCards();
  updateProgress();
  setVisible(landingSection);
});

document.querySelectorAll("input[type='radio']").forEach(input => {
  input.addEventListener("change", () => {
    errorBox.style.display = "none";
    updateSelectedCards();
    updateProgress();
  });
});

document.getElementById("biggestChallenge").addEventListener("change", () => {
  errorBox.style.display = "none";
});

quizForm.addEventListener("submit", event => {
  event.preventDefault();

  const quizData = getQuizData();

  if (!quizData) {
    errorBox.style.display = "block";
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  document.getElementById("resultTitle").textContent = quizData.maturity;
  document.getElementById("scoreText").textContent = `Score: ${quizData.score} / 24`;
  document.getElementById("resultDescription").textContent = quizData.description;
  document.getElementById("challengeText").textContent = quizData.biggestChallenge;
  document.getElementById("recommendationText").textContent = quizData.recommendation;

  setVisible(resultSection);
});

if (isUnlocked()) {
  setVisible(landingSection);
} else {
  setVisible(passwordSection);
}

updateProgress();
