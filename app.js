(() => {
  "use strict";

  const modules = [
    {
      id: "inversion",
      title: "Inversion for Emphasis",
      level: "C1",
      description: "Use negative and restrictive adverbials to create sophisticated emphasis.",
      content: `<h3>Core pattern</h3><p>When a negative or restrictive expression begins a sentence, invert the auxiliary and subject:</p><p><code>Never have I seen such careful work.</code></p><p><code>Only after the meeting did she understand the problem.</code></p><h3>Common triggers</h3><p>Never, rarely, seldom, hardly, scarcely, no sooner, not only, under no circumstances, only then.</p>`
    },
    {
      id: "cleft",
      title: "Cleft Sentences",
      level: "C1",
      description: "Control focus with it-clefts, wh-clefts and all-clefts.",
      content: `<h3>It-cleft</h3><p><code>It was Jamie who designed the activity.</code></p><h3>Wh-cleft</h3><p><code>What the students need is more guided practice.</code></p><p>Cleft structures help you highlight one part of a message while keeping the rest as shared information.</p>`
    },
    {
      id: "mixed-conditionals",
      title: "Mixed Conditionals",
      level: "C1",
      description: "Connect unreal past causes with present results—and the reverse.",
      content: `<h3>Past condition → present result</h3><p><code>If I had accepted the offer, I would be living abroad now.</code></p><h3>Present condition → past result</h3><p><code>If she were more organised, she would not have missed the deadline.</code></p>`
    },
    {
      id: "modality",
      title: "Advanced Modality",
      level: "C1",
      description: "Express deduction, criticism, probability and distance with precision.",
      content: `<h3>Past deduction</h3><p><code>They must have misunderstood.</code> (strong conclusion)</p><p><code>They might have misunderstood.</code> (possibility)</p><h3>Past criticism</h3><p><code>You should have checked the source.</code></p>`
    },
    {
      id: "participle-clauses",
      title: "Participle Clauses",
      level: "C1",
      description: "Compress ideas elegantly in academic and professional writing.",
      content: `<p><code>Having reviewed the evidence, the committee changed its decision.</code></p><p><code>Designed for advanced learners, the course demands regular practice.</code></p><p>The understood subject must normally be the same as the subject in the main clause.</p>`
    },
    {
      id: "hedging",
      title: "Hedging & Academic Caution",
      level: "C1+",
      description: "Make defensible claims with appropriate academic restraint.",
      content: `<p>Compare:</p><p><code>This proves that...</code> → <code>This appears to suggest that...</code></p><p>Useful hedges include <em>tend to, may, might, arguably, apparently, to some extent</em> and <em>it is possible that</em>.</p>`
    }
  ];

  const quiz = [
    { q: "Choose the correctly inverted sentence.", options: ["Rarely I have seen such progress.", "Rarely have I seen such progress.", "Rarely did I have seen such progress."], answer: 1 },
    { q: "Complete the mixed conditional: If he had trained consistently, he ___ more confident now.", options: ["would be", "would have been", "is"], answer: 0 },
    { q: "Which option is the most appropriately hedged academic claim?", options: ["The data proves the method works everywhere.", "The data may indicate that the method is effective in this context.", "The method definitely works."], answer: 1 },
    { q: "Choose the correct participle clause.", options: ["Having completed the analysis, the report was submitted.", "Having completed the analysis, the team submitted the report.", "Completed the analysis, the team submitting the report."], answer: 1 }
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const loginView = $("#loginView");
  const dashboardView = $("#dashboardView");
  const loginForm = $("#loginForm");
  const loginMessage = $("#loginMessage");
  const moduleDialog = $("#moduleDialog");
  let currentModuleId = null;
  let quizIndex = 0;
  let quizScore = 0;
  let selectedOption = null;

  const progressKey = "valsetCompletedModules";
  const getCompleted = () => JSON.parse(localStorage.getItem(progressKey) || "[]");
  const setCompleted = (items) => localStorage.setItem(progressKey, JSON.stringify(items));

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0,2).map((part) => part[0]).join("").toUpperCase();
  }

  function setStudent(user) {
    sessionStorage.setItem("valsetUser", JSON.stringify(user));
    $("#studentName").textContent = user.displayName;
    $("#studentMeta").textContent = `${user.level} · ${user.group}`;
    $("#studentInitials").textContent = initials(user.displayName);
  }

  function showDashboard(user) {
    setStudent(user);
    loginView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    dashboardView.setAttribute("aria-hidden", "false");
    renderModules();
    updateProgress();
    renderQuiz();
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = $("#username").value.trim();
    const password = $("#password").value;
    const users = Array.isArray(window.STUDENT_USERS) ? window.STUDENT_USERS : [];
    const user = users.find((item) => item.username === username && item.password === password);
    if (!user) {
      loginMessage.textContent = "Username or password not recognised. Please try again.";
      return;
    }
    loginMessage.textContent = "";
    showDashboard(user);
  });

  $("#togglePassword").addEventListener("click", () => {
    const input = $("#password");
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    $("#togglePassword").textContent = showing ? "Show" : "Hide";
  });

  $("#logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("valsetUser");
    dashboardView.classList.add("hidden");
    loginView.classList.remove("hidden");
    loginForm.reset();
  });

  function moduleCard(module, index) {
    const completed = getCompleted().includes(module.id);
    return `<article class="module-card">
      <span class="module-number">${String(index + 1).padStart(2, "0")}</span>
      <h4>${module.title}</h4>
      <p>${module.description}</p>
      <footer><span class="level-badge">${module.level}</span>${completed ? '<span class="completed-badge">✓ Completed</span>' : `<button type="button" data-open-module="${module.id}">Open lesson →</button>`}</footer>
    </article>`;
  }

  function renderModules() {
    $("#featuredModules").innerHTML = modules.slice(0,3).map(moduleCard).join("");
    $("#allModules").innerHTML = modules.map(moduleCard).join("");
    $$('[data-open-module]').forEach((button) => button.addEventListener("click", () => openModule(button.dataset.openModule)));
  }

  function openModule(id) {
    const module = modules.find((item) => item.id === id);
    if (!module) return;
    currentModuleId = id;
    $("#dialogLevel").textContent = `${module.level} MASTERCLASS`;
    $("#dialogTitle").textContent = module.title;
    $("#dialogDescription").textContent = module.description;
    $("#dialogContent").innerHTML = module.content;
    $("#completeModule").textContent = getCompleted().includes(id) ? "Completed ✓" : "Mark as completed";
    moduleDialog.showModal();
  }

  $("#closeDialog").addEventListener("click", () => moduleDialog.close());
  moduleDialog.addEventListener("click", (event) => { if (event.target === moduleDialog) moduleDialog.close(); });
  $("#completeModule").addEventListener("click", () => {
    if (!currentModuleId) return;
    const completed = new Set(getCompleted());
    completed.add(currentModuleId);
    setCompleted([...completed]);
    $("#completeModule").textContent = "Completed ✓";
    renderModules();
    updateProgress();
  });

  function updateProgress() {
    const count = getCompleted().length;
    const percentage = Math.round((count / modules.length) * 100);
    $("#completedCount").textContent = count;
    $("#progressValue").textContent = `${percentage}%`;
    $("#progressBar").style.width = `${percentage}%`;
  }

  function navigate(section) {
    $$(".content-section").forEach((item) => item.classList.add("hidden"));
    $(`#${section}Section`).classList.remove("hidden");
    $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.section === section));
    const titles = { overview: "Learning overview", grammar: "Advanced grammar", practice: "Practice lab", resources: "Study resources" };
    $("#pageTitle").textContent = titles[section];
    $(".sidebar").classList.remove("open");
  }

  $$(".nav-item").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.section)));
  $$('[data-go-section]').forEach((button) => button.addEventListener("click", () => navigate(button.dataset.goSection)));
  $("#menuButton").addEventListener("click", () => $(".sidebar").classList.toggle("open"));

  $("#checkChallenge").addEventListener("click", () => {
    const answer = $("#challengeAnswer").value.trim().toLowerCase().replace(/[.]+$/, "");
    const feedback = $("#challengeFeedback");
    if (!answer) { feedback.textContent = "Write your answer first."; return; }
    if (answer.includes("never had i encountered")) {
      feedback.textContent = "Excellent: “Never had I encountered such a convincing argument.”";
      feedback.style.color = "#1d7b55";
    } else {
      feedback.textContent = "Almost. Begin with “Never”, then invert the auxiliary and subject: Never had I…";
      feedback.style.color = "#a31535";
    }
  });

  function renderQuiz() {
    const container = $("#quizContainer");
    if (quizIndex >= quiz.length) {
      container.innerHTML = `<p class="eyebrow">RESULT</p><h4>You scored ${quizScore} out of ${quiz.length}</h4><p class="muted">${quizScore >= 3 ? "Strong performance. Review the explanations and keep refining your control." : "Review the grammar modules, then repeat the practice lab."}</p><button id="restartQuiz" class="primary-button" type="button">Try again</button>`;
      $("#restartQuiz").addEventListener("click", () => { quizIndex = 0; quizScore = 0; selectedOption = null; renderQuiz(); });
      return;
    }
    const item = quiz[quizIndex];
    container.innerHTML = `<p class="quiz-progress">Question ${quizIndex + 1} of ${quiz.length}</p><h4>${item.q}</h4><div class="option-list">${item.options.map((option,index) => `<button class="option-button" data-option="${index}" type="button">${option}</button>`).join("")}</div><p id="quizFeedback" class="feedback" aria-live="polite"></p><div class="quiz-actions"><button id="submitAnswer" class="primary-button" type="button">Check answer</button></div>`;
    selectedOption = null;
    $$(".option-button").forEach((button) => button.addEventListener("click", () => {
      $$(".option-button").forEach((itemButton) => itemButton.classList.remove("selected"));
      button.classList.add("selected");
      selectedOption = Number(button.dataset.option);
    }));
    $("#submitAnswer").addEventListener("click", () => {
      const feedback = $("#quizFeedback");
      if (selectedOption === null) { feedback.textContent = "Select an answer."; return; }
      if (selectedOption === item.answer) { quizScore += 1; feedback.textContent = "Correct."; feedback.style.color = "#1d7b55"; }
      else { feedback.textContent = `Review: the correct answer is “${item.options[item.answer]}”`; feedback.style.color = "#a31535"; }
      $("#submitAnswer").textContent = "Next question";
      $("#submitAnswer").onclick = () => { quizIndex += 1; renderQuiz(); };
    });
  }

  const resources = {
    phrases: `<h3>Academic phrase bank</h3><p><strong>Adding:</strong> Furthermore, moreover, in addition.</p><p><strong>Contrasting:</strong> Nevertheless, by contrast, whereas.</p><p><strong>Hedging:</strong> It could be argued that…, The evidence appears to suggest…</p><p><strong>Concluding:</strong> Taken together, these findings indicate…</p>`,
    checklist: `<h3>Error analysis checklist</h3><ol><li>Check subject–verb agreement.</li><li>Verify tense sequence and aspect.</li><li>Review articles and countability.</li><li>Check clause boundaries and punctuation.</li><li>Replace vague vocabulary with precise alternatives.</li><li>Read aloud for rhythm and missing words.</li></ol>`,
    pronunciation: `<h3>Pronunciation focus</h3><p>Mark thought groups with slashes, underline the main stressed word in each group and reduce grammatical words where natural.</p><p><code>Although the proposal was expensive / it offered the most sustainable solution.</code></p>`
  };
  $$('[data-resource]').forEach((button) => button.addEventListener("click", () => {
    const viewer = $("#resourceViewer");
    viewer.innerHTML = resources[button.dataset.resource];
    viewer.classList.remove("hidden");
    viewer.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  const storedUser = sessionStorage.getItem("valsetUser");
  if (storedUser) {
    try { showDashboard(JSON.parse(storedUser)); } catch { sessionStorage.removeItem("valsetUser"); }
  }
})();
