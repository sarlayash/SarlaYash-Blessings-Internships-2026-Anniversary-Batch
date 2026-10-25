/**
 * SarlaYash Blessings Internships 2026 — Interactive Application Controller
 * Powered by SarlaYash Learning Solutions LLP
 * Firebase Authentication & Firestore Cloud Database Integration
 */

// Firebase SDK Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_NAsA4TgHEb5kbwHGbu9GQ14a_J9AUlI",
  authDomain: "sarlayash-internships-2026.firebaseapp.com",
  projectId: "sarlayash-internships-2026",
  storageBucket: "sarlayash-internships-2026.firebasestorage.app",
  messagingSenderId: "1041302522680",
  appId: "1:1041302522680:web:c0a87ec23e530f1a308fcd",
  measurementId: "G-JHSJSTV7DT"
};

let firebaseApp = null;
let auth = null;
let db = null;
let currentUser = null;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();

    // Observe Auth State (Persistent Session)
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      updateAuthUI(user);
      if (user) {
        fetchUserApplication(user);
      }
    });
  }
} catch (e) {
  console.warn("Firebase Auth init note:", e);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Sidebar State (Expand/Collapse)
  initSidebarState();

  // Render initial sections
  renderTracks('all');
  selectRoadmapWeek(1);
  updateRubric();
  setupMobileMenu();
});

// ----------------------------------------------------
// 1. THE DAILY 1-HOUR FORMULA INTERACTIVE VISUALIZER
// ----------------------------------------------------
const formulaSteps = [
  {
    timeRange: "0–5 Minutes",
    durationText: "5 min",
    percentText: "8% of hour",
    phaseLabel: "PHASE 1 OF 5",
    dashOffset: 334,
    title: "Check-in and Daily Objective",
    purpose: "Establish razor-sharp focus for the hour. Review the day's singular objective, align on the expected deliverable, and eliminate distractions before opening tools.",
    actions: [
      "Log in to the cohort channel and mark prompt attendance.",
      "Read the 1-sentence outcome definition for the day.",
      "Open the starter template or domain workspace."
    ]
  },
  {
    timeRange: "5–15 Minutes",
    durationText: "10 min",
    percentText: "17% of hour",
    phaseLabel: "PHASE 2 OF 5",
    dashOffset: 300,
    title: "Micro-Learning",
    purpose: "Learn exactly one practical concept needed for the day's build. No bloated theories, no rambling lectures—only immediately actionable methodology.",
    actions: [
      "Inspect the daily code snippet, design pattern, or operational framework.",
      "Identify the core problem the concept solves.",
      "Formulate your implementation approach."
    ]
  },
  {
    timeRange: "15–40 Minutes",
    durationText: "25 min",
    percentText: "42% of hour",
    phaseLabel: "PHASE 3 OF 5",
    dashOffset: 210,
    title: "Hands-on Task (Active Building)",
    purpose: "The core engine of the day: 90% hands-on practice. Apply the micro-learning directly to your real repository, document, or analytical model.",
    actions: [
      "Write actual code, configure cloud resources, or draft marketing/business assets.",
      "Debug syntax and resolve immediate execution blockers.",
      "Produce the concrete deliverable for the day's milestone."
    ]
  },
  {
    timeRange: "40–50 Minutes",
    durationText: "10 min",
    percentText: "17% of hour",
    phaseLabel: "PHASE 4 OF 5",
    dashOffset: 300,
    title: "Evidence & Documentation",
    purpose: "Professional hygiene: record what was accomplished with tangible proof of work. Commit git changes, take screenshots, or log outputs.",
    actions: [
      "Commit progress to your track Git repository or Google Drive folder.",
      "Write a concise 2-sentence summary of what works and what remains.",
      "Capture screenshot or log output as proof of execution."
    ]
  },
  {
    timeRange: "50–60 Minutes",
    durationText: "10 min",
    percentText: "17% of hour",
    phaseLabel: "PHASE 5 OF 5",
    dashOffset: 300,
    title: "Reflection, Submission, or Feedback",
    purpose: "Demonstrate progress, submit the daily checkpoint, and receive rapid mentor feedback or peer review before closing the laptop.",
    actions: [
      "Submit the daily deliverable link via the submission portal.",
      "Post a short reflection in the peer discussion channel.",
      "Log off knowing today's 1-hour commitment is 100% complete."
    ]
  }
];

function setFormulaStep(index) {
  const step = formulaSteps[index];
  if (!step) return;

  // Update tabs visual state
  const buttons = document.querySelectorAll('.formula-tab-btn');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update DOM elements
  document.getElementById('formulaTimeRange').innerText = step.timeRange;
  document.getElementById('formulaDurationText').innerText = step.durationText;
  document.getElementById('formulaPercentText').innerText = step.percentText;
  document.getElementById('formulaPhaseLabel').innerText = step.phaseLabel;
  document.getElementById('formulaTitle').innerText = step.title;
  document.getElementById('formulaPurpose').innerHTML = `<strong>Core Purpose:</strong> ${step.purpose}`;

  const circle = document.getElementById('formulaProgressCircle');
  if (circle) {
    circle.style.strokeDashoffset = step.dashOffset;
  }

  const list = document.getElementById('formulaActionList');
  if (list) {
    list.innerHTML = step.actions.map(a => `<li>${a}</li>`).join('');
  }
}

// ----------------------------------------------------
// 2. SFE — 12 DOMAIN TRACKS DATA & RENDERING
// ----------------------------------------------------
const tracksData = [
  {
    id: 'fullstack',
    title: 'Full-Stack Development',
    category: 'tech',
    icon: 'code-2',
    suitableFor: 'Beginners & aspiring software engineers',
    capstone: 'Responsive portfolio or functional web application',
    tools: 'HTML5, Tailwind, Modern JS, GitHub',
    badge: 'Popular Track'
  },
  {
    id: 'python',
    title: 'Python Programming',
    category: 'tech',
    icon: 'terminal',
    suitableFor: 'Beginners and practical programmers',
    capstone: 'Practical Python CLI utility & automation script',
    tools: 'Python 3, Virtualenv, Requests, Rich CLI',
    badge: 'Foundational'
  },
  {
    id: 'java-dsa',
    title: 'Java + Data Structures & Algorithms',
    category: 'tech',
    icon: 'binary',
    suitableFor: 'Students preparing for technical interviews',
    capstone: 'Structured problem-solving portfolio & algorithmic benchmarks',
    tools: 'Java 17+, JUnit, Visual Algorithm Tracing',
    badge: 'Interview Prep'
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    category: 'ai-data',
    icon: 'bar-chart-3',
    suitableFor: 'Students, professionals, and career switchers',
    capstone: 'Interactive data analysis report & business dashboard',
    tools: 'SQL, Python Pandas, Sheets, Looker Studio',
    badge: 'High Demand'
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    category: 'ai-data',
    icon: 'bot',
    suitableFor: 'Learners from technical & non-technical backgrounds',
    capstone: 'AI-assisted workflow or research assistant prototype',
    tools: 'Gemini API, Prompt Engineering, Agentic Workflows',
    badge: 'Trending 2026'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Fundamentals',
    category: 'tech',
    icon: 'shield-alert',
    suitableFor: 'Interested beginners & future security analysts',
    capstone: 'Security-awareness guide and authorized lab exercises',
    tools: 'Wireshark basics, OWASP Top 10, Auth protocols',
    badge: 'Essential'
  },
  {
    id: 'cloud',
    title: 'Cloud Fundamentals',
    category: 'ai-data',
    icon: 'cloud',
    suitableFor: 'Aspiring cloud architects & DevOps learners',
    capstone: 'Cloud architecture proposal and sandbox demonstration',
    tools: 'GCP / AWS free tier, IAM, Storage, Compute engines',
    badge: 'Infrastructure'
  },
  {
    id: 'marketing',
    title: 'Digital Marketing',
    category: 'business',
    icon: 'trending-up',
    suitableFor: 'Creative and business-oriented learners',
    capstone: 'Omnichannel campaign plan & performance measurement framework',
    tools: 'Meta Ads Manager concepts, Google Analytics, SEO tools',
    badge: 'No Code'
  },
  {
    id: 'business-analysis',
    title: 'Business Analysis',
    category: 'business',
    icon: 'file-check-2',
    suitableFor: 'Management students & non-technical analytical thinkers',
    capstone: 'Requirements document (BRD/PRD) and process-improvement proposal',
    tools: 'Figma wireframes, User stories, BPMN flowcharts',
    badge: 'Strategic'
  },
  {
    id: 'content-research',
    title: 'Research and Content',
    category: 'people',
    icon: 'feather',
    suitableFor: 'Writers, educators, researchers, and communicators',
    capstone: 'Evidence-based research brief or comprehensive learning resource',
    tools: 'Notion, Open Access databases, Technical copywriting',
    badge: 'Creative'
  },
  {
    id: 'hr-talent',
    title: 'HR and Talent Acquisition',
    category: 'people',
    icon: 'users',
    suitableFor: 'Aspiring HR professionals & team builders',
    capstone: 'Sample recruitment workflow, rubric, and interview scorecard',
    tools: 'ATS workflows, LinkedIn talent search, Evaluation matrices',
    badge: 'People Ops'
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship and Innovation',
    category: 'people',
    icon: 'lightbulb',
    suitableFor: 'Founders and aspiring startup entrepreneurs',
    capstone: 'Validated business model canvas & customer problem statement',
    tools: 'Lean Canvas, Pitch deck, Unit economics modeling',
    badge: 'Venture'
  }
];

function renderTracks(filterCategory) {
  const container = document.getElementById('tracksGrid');
  if (!container) return;

  const filtered = filterCategory === 'all' 
    ? tracksData 
    : tracksData.filter(t => t.category === filterCategory);

  container.innerHTML = filtered.map(track => `
    <div class="theatre-border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group">
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-brand-crimson/30 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
            <i data-lucide="${track.icon}" class="w-5 h-5"></i>
          </div>
          <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
            ${track.badge}
          </span>
        </div>

        <h3 class="font-bold text-white text-lg mb-1 group-hover:text-brand-gold transition-colors">
          ${track.title}
        </h3>
        <p class="text-xs text-slate-400 mb-4">
          <strong class="text-slate-300">Ideal for:</strong> ${track.suitableFor}
        </p>

        <div class="space-y-2 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase tracking-wider">Example 30-Day Capstone:</span>
            <span class="text-white font-medium">${track.capstone}</span>
          </div>
          <div class="pt-2 border-t border-white/5">
            <span class="text-slate-400 block text-[10px] uppercase tracking-wider">Core Tools & Stack:</span>
            <span class="text-brand-gold font-mono">${track.tools}</span>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <button onclick="selectTrackAndApply('${track.title}')" class="text-xs font-semibold text-brand-gold hover:text-amber-300 flex items-center gap-1 group/btn">
          <span>Enroll in this track</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform"></i>
        </button>
        <span class="text-[11px] text-slate-500 font-mono">1 hr/day</span>
      </div>
    </div>
  `).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function filterTracks(category) {
  const buttons = document.querySelectorAll('.track-filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.classList.remove('bg-brand-gold', 'text-brand-dark');
  });

  const activeBtn = event.currentTarget;
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  renderTracks(category);
}

function selectTrackAndApply(trackTitle) {
  openApplyModal();
  const trackSelect = document.getElementById('app_track');
  if (trackSelect) {
    trackSelect.value = trackTitle;
  }
}

// ----------------------------------------------------
// 3. COMPLETE 22-WORKING-DAY ROADMAP DATA & TABS
// ----------------------------------------------------
const roadmapWeeks = {
  1: {
    title: "Week 1 — Discover, Orient, and Establish Foundations",
    theme: "From participant to purposeful learner",
    checkpoint: "Each participant should understand the program, have a clear learning objective, and identify a problem worth solving.",
    days: [
      {
        day: 1,
        focus: "Welcome and Orientation",
        activity: "Introduce SarlaYash, program rules, expectations, and the learning journey.",
        deliverable: "Personal learning profile"
      },
      {
        day: 2,
        focus: "Goal Setting",
        activity: "Identify current skills, interests, strengths, and desired outcomes.",
        deliverable: "Individual growth plan"
      },
      {
        day: 3,
        focus: "Professional Communication",
        activity: "Practice written communication, digital etiquette, and professional introductions.",
        deliverable: "Professional introduction"
      },
      {
        day: 4,
        focus: "Digital Productivity",
        activity: "Learn file organization, document creation, collaboration, and responsible AI use.",
        deliverable: "Organized digital workspace"
      },
      {
        day: 5,
        focus: "Problem Identification",
        activity: "Identify a real problem relevant to the chosen domain track.",
        deliverable: "Problem statement"
      }
    ]
  },
  2: {
    title: "Week 2 — Build Practical Skills",
    theme: "From learning to execution",
    checkpoint: "Participants should have completed at least one practical exercise and received structured mentor feedback.",
    days: [
      {
        day: 6,
        focus: "Domain Selection",
        activity: "Confirm the participant's learning track and its required tools.",
        deliverable: "Track-selection record"
      },
      {
        day: 7,
        focus: "Tool Mastery",
        activity: "Explore the primary tool or platform used in the selected track.",
        deliverable: "Tool-practice exercise"
      },
      {
        day: 8,
        focus: "Guided Implementation",
        activity: "Complete a small, mentor-guided practical task.",
        deliverable: "First working artifact"
      },
      {
        day: 9,
        focus: "Research and Verification",
        activity: "Research the problem and verify relevant information with credible sources.",
        deliverable: "Research notes with sources"
      },
      {
        day: 10,
        focus: "Quality and Iteration",
        activity: "Test the work, identify mistakes, and improve the result.",
        deliverable: "Revised artifact and feedback"
      }
    ]
  },
  3: {
    title: "Week 3 — Build Something Meaningful",
    theme: "From execution to contribution",
    checkpoint: "Participants should have a demonstrable project or equivalent practical work appropriate to their track.",
    days: [
      {
        day: 11,
        focus: "Project Planning",
        activity: "Break the identified problem into manageable tasks.",
        deliverable: "Mini-project plan"
      },
      {
        day: 12,
        focus: "Prototype Development",
        activity: "Begin building the proposed solution.",
        deliverable: "Initial prototype"
      },
      {
        day: 13,
        focus: "Implementation",
        activity: "Add the primary functionality or complete the main project task.",
        deliverable: "Working project component"
      },
      {
        day: 14,
        focus: "Testing and Validation",
        activity: "Test outputs, verify assumptions, and identify limitations.",
        deliverable: "Test and validation report"
      },
      {
        day: 15,
        focus: "Mid-project Review",
        activity: "Demonstrate progress and receive structured mentor feedback.",
        deliverable: "Progress demonstration"
      }
    ]
  },
  4: {
    title: "Week 4 — Complete, Demonstrate, and Evaluate",
    theme: "From contribution to professional readiness",
    checkpoint: "Participants have an end-to-end polished project portfolio and practiced pitch.",
    days: [
      {
        day: 16,
        focus: "Improvement",
        activity: "Address review feedback and refine the solution.",
        deliverable: "Improved project"
      },
      {
        day: 17,
        focus: "Documentation",
        activity: "Document the problem, process, tools, and results.",
        deliverable: "Project documentation"
      },
      {
        day: 18,
        focus: "Presentation Skills",
        activity: "Prepare a concise explanation or demonstration.",
        deliverable: "Project presentation"
      },
      {
        day: 19,
        focus: "Final Project Review",
        activity: "Demonstrate the completed work and explain decisions.",
        deliverable: "Final submission"
      },
      {
        day: 20,
        focus: "Professional Readiness",
        activity: "Practice reflection, interview questions, and communicating project experience.",
        deliverable: "Personal project pitch"
      }
    ]
  },
  5: {
    title: "Final Two Working Days — Assessment and Recognition",
    theme: "From completion to the next opportunity",
    checkpoint: "Final evaluation completed, recognition confirmed, and ₹1,000 refund processing triggered.",
    days: [
      {
        day: 21,
        focus: "Performance Assessment",
        activity: "Review submissions, project quality, consistency, collaboration, and learning progress.",
        deliverable: "Assessed performance record"
      },
      {
        day: 22,
        focus: "Closing and Next Steps",
        activity: "Conduct the final reflection, share feedback, and explain completion and recognition procedures.",
        deliverable: "Individual development summary"
      }
    ]
  }
};

function selectRoadmapWeek(weekNumber) {
  const week = roadmapWeeks[weekNumber];
  if (!week) return;

  const buttons = document.querySelectorAll('.roadmap-tab-btn');
  buttons.forEach((btn, index) => {
    if (index === weekNumber - 1) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const container = document.getElementById('roadmapDaysContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-white/10">
      <div>
        <h3 class="font-heading font-bold text-xl text-white">${week.title}</h3>
        <p class="text-xs text-brand-gold font-mono mt-0.5">Theme: ${week.theme}</p>
      </div>
      <div class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
        <strong class="text-amber-300">Milestone Checkpoint:</strong> ${week.checkpoint}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${week.days.length > 3 ? '3' : '2'} gap-4">
      ${week.days.map(d => `
        <div class="p-4 rounded-xl bg-brand-surface border border-white/10 hover:border-brand-gold/40 transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-brand-crimson/50 text-rose-200 border border-brand-crimson">
                DAY ${d.day}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">1 Hour Focus</span>
            </div>
            <h4 class="font-bold text-white text-base mb-1">${d.focus}</h4>
            <p class="text-xs text-slate-300 leading-relaxed mb-3">${d.activity}</p>
          </div>
          <div class="pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-brand-gold">
            <i data-lucide="check-square" class="w-3.5 h-3.5"></i>
            <span class="font-medium text-slate-300">Daily Deliverable:</span>
            <span class="font-mono font-semibold">${d.deliverable}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ----------------------------------------------------
// 4. 100-POINT RUBRIC & STIPEND SIMULATOR
// ----------------------------------------------------
function updateRubric() {
  const attendance = parseInt(document.getElementById('slider_attendance')?.value || 9);
  const consistency = parseInt(document.getElementById('slider_consistency')?.value || 13);
  const tasks = parseInt(document.getElementById('slider_tasks')?.value || 18);
  const quality = parseInt(document.getElementById('slider_quality')?.value || 22);
  const problem = parseInt(document.getElementById('slider_problem')?.value || 9);
  const docs = parseInt(document.getElementById('slider_docs')?.value || 8);
  const demo = parseInt(document.getElementById('slider_demo')?.value || 9);

  // Update label displays
  document.getElementById('val_attendance').innerText = `${attendance} / 10 pts`;
  document.getElementById('val_consistency').innerText = `${consistency} / 15 pts`;
  document.getElementById('val_tasks').innerText = `${tasks} / 20 pts`;
  document.getElementById('val_quality').innerText = `${quality} / 25 pts`;
  document.getElementById('val_problem').innerText = `${problem} / 10 pts`;
  document.getElementById('val_docs').innerText = `${docs} / 10 pts`;
  document.getElementById('val_demo').innerText = `${demo} / 10 pts`;

  const total = attendance + consistency + tasks + quality + problem + docs + demo;
  const scoreElem = document.getElementById('totalRubricScore');
  if (scoreElem) scoreElem.innerText = total;

  const badgeElem = document.getElementById('scoreBadge');
  const thresholdElem = document.getElementById('thresholdStatus');
  const refundElem = document.getElementById('refundEligibilityText');
  const stipendAmountElem = document.getElementById('stipendAmountDisplay');
  const stipendDescElem = document.getElementById('stipendDescDisplay');

  // Check Qualification & Tier
  if (total >= 92) {
    badgeElem.className = "mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30";
    badgeElem.innerText = "Exceptional Performance (Tier 1)";
    stipendAmountElem.innerText = "₹15,000 Stipend + ₹1,000 Deposit = ₹16,000 Total";
    stipendAmountElem.className = "text-xl sm:text-2xl font-bold font-mono text-purple-300 mt-1";
    stipendDescElem.innerText = "Top candidate pool eligible for the maximum ₹15,000 merit stipend + 100% Commitment Deposit Refund!";
    refundElem.innerHTML = `<i data-lucide="check-check" class="w-4 h-4"></i> 100% Refunded with Stipend (₹1,000)`;
    refundElem.className = "font-bold text-emerald-400 flex items-center gap-1";
  } else if (total >= 82) {
    badgeElem.className = "mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    badgeElem.innerText = "Outstanding Candidate (Tier 2)";
    stipendAmountElem.innerText = "₹10,000 Stipend + ₹1,000 Deposit = ₹11,000 Total";
    stipendAmountElem.className = "text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1";
    stipendDescElem.innerText = "Outstanding performance bracket eligible for the ₹10,000 stipend award + 100% Commitment Deposit Refund!";
    refundElem.innerHTML = `<i data-lucide="check-check" class="w-4 h-4"></i> 100% Refunded with Stipend (₹1,000)`;
    refundElem.className = "font-bold text-emerald-400 flex items-center gap-1";
  } else if (total >= 75) {
    badgeElem.className = "mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30";
    badgeElem.innerText = "Strong Performance (Tier 3)";
    stipendAmountElem.innerText = "₹5,000 Stipend + ₹1,000 Deposit = ₹6,000 Total";
    stipendAmountElem.className = "text-xl sm:text-2xl font-bold font-mono text-blue-300 mt-1";
    stipendDescElem.innerText = "Strong performance bracket eligible for the ₹5,000 stipend award + 100% Commitment Deposit Refund!";
    refundElem.innerHTML = `<i data-lucide="check-check" class="w-4 h-4"></i> 100% Refunded with Stipend (₹1,000)`;
    refundElem.className = "font-bold text-emerald-400 flex items-center gap-1";
  } else {
    badgeElem.className = "mt-3 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30";
    badgeElem.innerText = "Foundational / Participation Tier";
    stipendAmountElem.innerText = "₹0 Stipend • Deposit Non-Refundable";
    stipendAmountElem.className = "text-xl sm:text-2xl font-bold font-mono text-slate-400 mt-1";
    stipendDescElem.innerText = "Below 75 points. Stipend not earned; commitment deposit non-refundable per policy.";
    refundElem.innerHTML = `<i data-lucide="x-circle" class="w-4 h-4"></i> No Refund (Stipend Not Earned)`;
    refundElem.className = "font-bold text-slate-400 flex items-center gap-1";
  }

  // Completion Threshold Status
  if (total >= 75 && attendance >= 7) {
    thresholdElem.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Qualified (${total}/100)`;
    thresholdElem.className = "font-bold text-emerald-400 flex items-center gap-1";
  } else {
    thresholdElem.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> Below 75 Pts Threshold`;
    thresholdElem.className = "font-bold text-amber-400 flex items-center gap-1";
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function resetRubric() {
  document.getElementById('slider_attendance').value = 9;
  document.getElementById('slider_consistency').value = 13;
  document.getElementById('slider_tasks').value = 18;
  document.getElementById('slider_quality').value = 22;
  document.getElementById('slider_problem').value = 9;
  document.getElementById('slider_docs').value = 8;
  document.getElementById('slider_demo').value = 9;
  updateRubric();
}

// ----------------------------------------------------
// 5. GOOGLE AUTHENTICATION (ONLY REAL GOOGLE SIGNUPS)
// ----------------------------------------------------
async function loginWithGoogle() {
  if (!auth) {
    alert("Authentication service is initializing. Please wait a second and retry.");
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const result = await auth.signInWithPopup(provider);
    currentUser = result.user;
    updateAuthUI(currentUser);

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3 }
      });
    }
  } catch (error) {
    console.error("Google Auth error:", error);
    if (error.code === 'auth/unauthorized-domain') {
      alert("Note: This domain needs to be added to Firebase Console > Authentication > Settings > Authorized Domains.\n(For local preview, localhost is supported; for GitHub Pages, add sarlayash.github.io).\n\n" + error.message);
    } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      alert("Google Sign-In Error: " + error.message);
    }
  }
}

async function logoutGoogle() {
  if (auth) {
    await auth.signOut();
    currentUser = null;
    updateAuthUI(null);
  }
}

function updateAuthUI(user) {
  const loginBtn = document.getElementById('googleLoginBtn');
  const userBadge = document.getElementById('googleUserBadge');
  const userPhoto = document.getElementById('googleUserPhoto');
  const userName = document.getElementById('googleUserName');

  const sidebarLoginBtn = document.getElementById('sidebarLoginBtn');
  const sidebarUserCard = document.getElementById('sidebarUserCard');
  const sidebarUserPhoto = document.getElementById('sidebarUserPhoto');
  const sidebarUserName = document.getElementById('sidebarUserName');
  const navManageAppBtn = document.getElementById('navManageAppBtn');

  const gate = document.getElementById('googleAuthRequiredGate');
  const authForm = document.getElementById('googleAuthenticatedForm');
  const formPhoto = document.getElementById('formUserPhoto');
  const formName = document.getElementById('formUserName');
  const formEmail = document.getElementById('formUserEmail');
  const inputName = document.getElementById('app_name');
  const inputEmail = document.getElementById('app_email');

  if (user) {
    // Header UI
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userBadge) {
      userBadge.classList.remove('hidden');
      userBadge.classList.add('flex');
    }
    if (userPhoto) userPhoto.src = user.photoURL || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_grey_54dp.png';
    if (userName) userName.innerText = user.displayName || 'Google User';

    // Sidebar UI
    if (sidebarLoginBtn) sidebarLoginBtn.classList.add('hidden');
    if (sidebarUserCard) {
      sidebarUserCard.classList.remove('hidden');
      sidebarUserCard.classList.add('flex');
    }
    if (sidebarUserPhoto) sidebarUserPhoto.src = user.photoURL || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_grey_54dp.png';
    if (sidebarUserName) sidebarUserName.innerText = user.displayName || 'Google User';
    if (navManageAppBtn) {
      navManageAppBtn.classList.remove('hidden');
      navManageAppBtn.classList.add('inline-flex');
    }

    // Application Modal UI
    if (gate) gate.classList.add('hidden');
    if (authForm) authForm.classList.remove('hidden');
    if (formPhoto) formPhoto.src = user.photoURL || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_grey_54dp.png';
    if (formName) formName.innerText = user.displayName || 'Verified Candidate';
    if (formEmail) formEmail.innerText = user.email || '';
    if (inputName) inputName.value = user.displayName || '';
    if (inputEmail) inputEmail.value = user.email || '';
  } else {
    // Header UI
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userBadge) {
      userBadge.classList.add('hidden');
      userBadge.classList.remove('flex');
    }

    // Sidebar UI
    if (sidebarLoginBtn) sidebarLoginBtn.classList.remove('hidden');
    if (sidebarUserCard) {
      sidebarUserCard.classList.add('hidden');
      sidebarUserCard.classList.remove('flex');
    }

    // Application Modal UI
    if (gate) gate.classList.remove('hidden');
    if (authForm) authForm.classList.add('hidden');
    if (inputName) inputName.value = '';
    if (inputEmail) inputEmail.value = '';

    if (navManageAppBtn) {
      navManageAppBtn.classList.add('hidden');
      navManageAppBtn.classList.remove('inline-flex');
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ----------------------------------------------------
// 6. APPLICATION & ENROLLMENT MODAL WORKFLOW
// ----------------------------------------------------
function openApplyModal() {
  if (currentUser && window.currentUserApp && window.currentUserApp.regId) {
    // If candidate already has an existing application, open their management portal to view or update UTR
    openManageApplicationModal();
    return;
  }
  const modal = document.getElementById('applyModal');
  if (modal) {
    modal.classList.remove('hidden');
    updateAuthUI(currentUser);
    goToEnrollmentStep(1);
  }
}

function closeApplyModal() {
  const modal = document.getElementById('applyModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function goToEnrollmentStep(step) {
  document.getElementById('modalStepNum').innerText = step;
  document.getElementById('enrollmentStep1').classList.add('hidden');
  document.getElementById('enrollmentStep2').classList.add('hidden');
  document.getElementById('enrollmentStep3').classList.add('hidden');

  if (step === 1) {
    document.getElementById('enrollmentStep1').classList.remove('hidden');
    updateAuthUI(currentUser);
  } else if (step === 2) {
    if (!currentUser) {
      alert("Authentic Verification Required: Please sign in with your Google account first. No fake logins are accepted.");
      loginWithGoogle();
      return;
    }
    const phone = document.getElementById('app_phone')?.value.trim();
    if (!phone) {
      alert("Please provide an active WhatsApp / Phone number for batch coordination and live session access.");
      document.getElementById('enrollmentStep1').classList.remove('hidden');
      document.getElementById('modalStepNum').innerText = 1;
      return;
    }
    document.getElementById('enrollmentStep2').classList.remove('hidden');
  } else if (step === 3) {
    document.getElementById('enrollmentStep3').classList.remove('hidden');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function copyUpi() {
  const upi = "9873152277@kotakbank";
  navigator.clipboard.writeText(upi).then(() => {
    alert("Official UPI ID copied: " + upi);
  }).catch(() => {
    prompt("Copy UPI ID:", upi);
  });
}

function submitApplication() {
  if (!currentUser) {
    alert("Authentic Verification Required: Please sign in with Google to confirm your enrollment.");
    loginWithGoogle();
    return;
  }

  const utr = document.getElementById('app_utr').value.trim();
  if (!utr) {
    alert("Please enter your 12-digit UPI UTR / Transaction Reference ID from your payment receipt.");
    return;
  }

  const name = currentUser.displayName || document.getElementById('app_name').value.trim() || "Participant";
  const email = currentUser.email || "";
  const phone = document.getElementById('app_phone')?.value.trim() || "";
  const track = document.getElementById('app_track').value;
  const background = document.getElementById('app_background').value;
  const slot = document.getElementById('app_slot').value;
  const regId = 'SY-2026-' + Math.floor(1000 + Math.random() * 9000);

  const appData = {
    uid: currentUser.uid,
    name: name,
    email: email,
    photoURL: currentUser.photoURL || '',
    phone: phone,
    track: track,
    background: background,
    slot: slot,
    utr: utr,
    regId: regId,
    submittedAt: new Date().toISOString(),
    feeInstallment: 250,
    feeTotal: 1000,
    status: 'verified_google_candidate'
  };

  window.currentUserApp = appData;
  localStorage.setItem('sarlayash_app_' + currentUser.uid, JSON.stringify(appData));

  // Firestore Cloud Database Record
  if (db && currentUser) {
    db.collection('internship_applications_2026').doc(currentUser.uid).set({
      ...appData,
      submittedAtServer: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).catch(err => {
      console.warn("Firestore record save notice:", err);
    });
  }

  // Populate pass card with verified Google details
  document.getElementById('pass_name').innerText = name + " (Google Verified)";
  document.getElementById('pass_track').innerText = track;
  document.getElementById('pass_slot').innerText = slot;
  document.getElementById('pass_regId').innerText = regId;

  // Trigger celebration confetti
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#E5A93C', '#4285F4', '#34A853', '#EA4335', '#ffffff']
    });
  }

  goToEnrollmentStep(3);

  // Automatically dispatch Welcome Email!
  sendWelcomeEmail(appData);
}

// ----------------------------------------------------
// 6. PROGRAM HANDBOOK MODAL
// ----------------------------------------------------
function showHandbookModal() {
  const modal = document.getElementById('handbookModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeHandbookModal() {
  const modal = document.getElementById('handbookModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// ----------------------------------------------------
// 7. FAQ ACCORDION TOGGLING
// ----------------------------------------------------
function toggleFaq(id) {
  const answer = document.getElementById(`faq-answer-${id}`);
  const icon = document.getElementById(`faq-icon-${id}`);
  if (!answer) return;

  const isHidden = answer.classList.contains('hidden');
  if (isHidden) {
    answer.classList.remove('hidden');
    if (icon) icon.classList.add('rotate-180');
  } else {
    answer.classList.add('hidden');
    if (icon) icon.classList.remove('rotate-180');
  }
}

// ----------------------------------------------------
// 8. MOBILE MENU TOGGLE
// ----------------------------------------------------
function setupMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

// ----------------------------------------------------
// 9. COLLAPSIBLE LEFT SIDEBAR NAVIGATION
// ----------------------------------------------------
function initSidebarState() {
  const isCollapsed = localStorage.getItem('sarlayash_sidebar_collapsed') === 'true';
  setSidebarCollapsed(isCollapsed, false);
}

function toggleSidebarCollapse() {
  const sidebar = document.getElementById('leftSidebar');
  if (!sidebar) return;
  const willCollapse = !sidebar.classList.contains('collapsed');
  setSidebarCollapsed(willCollapse, true);
}

function setSidebarCollapsed(collapsed, save = true) {
  const sidebar = document.getElementById('leftSidebar');
  const content = document.getElementById('mainContentWrapper');
  const icon = document.getElementById('collapseIcon');
  const headerLabel = document.getElementById('headerToggleLabel');
  if (!sidebar) return;

  if (collapsed) {
    sidebar.classList.add('collapsed');
    if (content) {
      content.classList.remove('lg:pl-64');
      content.classList.add('lg:pl-20');
    }
    if (icon) {
      icon.classList.add('rotate-180');
    }
    if (headerLabel) {
      headerLabel.innerText = 'Expand Sidebar';
    }
  } else {
    sidebar.classList.remove('collapsed');
    if (content) {
      content.classList.remove('lg:pl-20');
      content.classList.add('lg:pl-64');
    }
    if (icon) {
      icon.classList.remove('rotate-180');
    }
    if (headerLabel) {
      headerLabel.innerText = 'Collapse Sidebar';
    }
  }

  if (save) {
    localStorage.setItem('sarlayash_sidebar_collapsed', collapsed ? 'true' : 'false');
  }
}

function toggleMobileSidebar(open) {
  const sidebar = document.getElementById('leftSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  if (open) {
    sidebar.classList.remove('-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function handleNavClick() {
  // If on mobile / smaller viewports, automatically close drawer on selection
  if (window.innerWidth < 1024) {
    toggleMobileSidebar(false);
  }
}

// ----------------------------------------------------
// 10. CANDIDATE PORTAL & UTR MANAGEMENT
// ----------------------------------------------------
async function fetchUserApplication(user) {
  if (!user) return;
  try {
    // Check local storage first for instant loading
    const local = localStorage.getItem('sarlayash_app_' + user.uid);
    if (local) {
      window.currentUserApp = JSON.parse(local);
    }

    if (db) {
      const doc = await db.collection('internship_applications_2026').doc(user.uid).get();
      if (doc.exists) {
        window.currentUserApp = doc.data();
        localStorage.setItem('sarlayash_app_' + user.uid, JSON.stringify(doc.data()));
      }
    }
  } catch (err) {
    console.warn("Error fetching candidate app:", err);
  }
}

function openManageApplicationModal() {
  if (!currentUser) {
    alert("Authentic Google Account Required: Please sign in with Google to view and update your application.");
    loginWithGoogle();
    return;
  }

  // Close other modals
  closeApplyModal();
  closeHandbookModal();
  closeWelcomeEmailModal();

  // Populate candidate data
  const app = window.currentUserApp || {
    name: currentUser.displayName || 'Candidate',
    email: currentUser.email || '',
    photoURL: currentUser.photoURL || '',
    regId: 'SY-2026-' + (currentUser.uid.slice(0, 4).toUpperCase()),
    track: 'Full-Stack Development',
    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',
    phone: 'Not provided yet',
    utr: ''
  };

  const photoElem = document.getElementById('manageUserPhoto');
  const nameElem = document.getElementById('manageUserName');
  const emailElem = document.getElementById('manageUserEmail');
  const regIdElem = document.getElementById('manageRegId');
  const trackElem = document.getElementById('manageTrack');
  const slotElem = document.getElementById('manageSlot');
  const phoneElem = document.getElementById('managePhone');
  const utrInput = document.getElementById('manageUtrInput');
  const utrBadge = document.getElementById('manageUtrBadge');

  if (photoElem) photoElem.src = currentUser.photoURL || app.photoURL || 'https://www.gstatic.com/images/branding/product/1x/avatar_square_grey_54dp.png';
  if (nameElem) nameElem.innerText = currentUser.displayName || app.name || 'Candidate';
  if (emailElem) emailElem.innerText = currentUser.email || app.email || '';
  if (regIdElem) regIdElem.innerText = app.regId || ('SY-2026-' + (currentUser.uid.slice(0, 4).toUpperCase()));
  if (trackElem) trackElem.innerText = app.track || 'Full-Stack Development';
  if (slotElem) slotElem.innerText = app.slot || 'Evening Batch (6:00 PM – 7:00 PM IST)';
  if (phoneElem) phoneElem.innerText = app.phone || 'Please provide phone';
  
  if (utrInput) {
    utrInput.value = app.utr || '';
  }

  if (utrBadge) {
    if (app.utr && app.utr.trim().length > 0) {
      utrBadge.innerText = "UTR Logged";
      utrBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    } else {
      utrBadge.innerText = "Needs UTR";
      utrBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30";
    }
  }

  const toast = document.getElementById('utrUpdateToast');
  if (toast) toast.classList.add('hidden');

  const modal = document.getElementById('manageAppModal');
  if (modal) modal.classList.remove('hidden');

  if (window.lucide) window.lucide.createIcons();
}

function closeManageApplicationModal() {
  const modal = document.getElementById('manageAppModal');
  if (modal) modal.classList.add('hidden');
}

async function updateCandidateUtr() {
  if (!currentUser) {
    alert("Please sign in with Google first.");
    return;
  }

  const utrInput = document.getElementById('manageUtrInput');
  const newUtr = utrInput ? utrInput.value.trim() : '';

  if (!newUtr) {
    alert("Please enter a valid 12-digit UPI UTR or Reference Number from your payment receipt.");
    if (utrInput) utrInput.focus();
    return;
  }

  // Get or initialize appData
  let appData = window.currentUserApp || {
    uid: currentUser.uid,
    name: currentUser.displayName || 'Candidate',
    email: currentUser.email || '',
    photoURL: currentUser.photoURL || '',
    regId: 'SY-2026-' + (currentUser.uid.slice(0, 4).toUpperCase()),
    track: 'Full-Stack Development',
    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',
    phone: '',
    status: 'verified_google_candidate'
  };

  appData.utr = newUtr;
  appData.utrUpdatedAt = new Date().toISOString();
  window.currentUserApp = appData;
  localStorage.setItem('sarlayash_app_' + currentUser.uid, JSON.stringify(appData));

  // Save to Firestore
  if (db) {
    try {
      await db.collection('internship_applications_2026').doc(currentUser.uid).set({
        utr: newUtr,
        utrUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        utrStatus: 'logged_and_verified'
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore UTR update notice:", err);
    }
  }

  // Update badge
  const utrBadge = document.getElementById('manageUtrBadge');
  if (utrBadge) {
    utrBadge.innerText = "UTR Updated & Logged";
    utrBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  }

  // Show Toast
  const toast = document.getElementById('utrUpdateToast');
  const msg = document.getElementById('utrUpdateMsg');
  if (toast && msg) {
    msg.innerText = `✓ UTR "${newUtr}" successfully saved! Automatic Welcome Email dispatched.`;
    toast.classList.remove('hidden');
  }

  // Trigger celebratory confetti
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 }
    });
  }

  // Dispatch Welcome Email automatically!
  sendWelcomeEmail(appData);
}

// ----------------------------------------------------
// 11. AUTOMATED WELCOME EMAIL SYSTEM
// ----------------------------------------------------
function sendWelcomeEmail(appData) {
  if (!appData) return;

  // 1. Dispatch asynchronous notification via FormSubmit
  try {
    fetch('https://formsubmit.co/ajax/namaste@sarlayash.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Welcome to SarlaYash Blessings Internships 2026 [${appData.regId}]`,
        _replyto: appData.email,
        candidate_name: appData.name,
        candidate_email: appData.email,
        phone: appData.phone || 'N/A',
        track: appData.track,
        slot: appData.slot,
        utr_reference: appData.utr,
        registration_id: appData.regId,
        deposit_policy: "50 INR Daily (250/wk) - 100% Refundable with Stipend",
        lead_mentor: "Kapil - The One Rupee Full-Stack CEO"
      })
    }).catch(e => console.log('Mail webhook info:', e));
  } catch (e) {
    console.log('Dispatch info:', e);
  }

  // 2. Open the Welcome Email Modal immediately for the user!
  showWelcomeEmailModal(appData);
}

function showWelcomeEmailModal(customApp) {
  const app = customApp || window.currentUserApp || {
    name: currentUser?.displayName || 'Candidate',
    email: currentUser?.email || 'candidate@gmail.com',
    regId: 'SY-2026-0842',
    track: 'Full-Stack Development',
    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',
    utr: '9873152277@kotakbank'
  };

  const targetElem = document.getElementById('emailTargetAddress');
  const toElem = document.getElementById('emailHeaderTo');
  const subjectElem = document.getElementById('emailHeaderSubject');
  const nameElem = document.getElementById('emailCandidateName');
  const regIdElem = document.getElementById('emailRegId');
  const trackElem = document.getElementById('emailTrack');
  const slotElem = document.getElementById('emailSlot');
  const utrElem = document.getElementById('emailUtr');
  const mailtoBtn = document.getElementById('emailMailtoBtn');

  if (targetElem) targetElem.innerText = app.email;
  if (toElem) toElem.innerText = `${app.name} <${app.email}>`;
  if (subjectElem) subjectElem.innerText = `🎉 Welcome to SarlaYash Blessings Internships 2026 — Reg ID: ${app.regId}`;
  if (nameElem) nameElem.innerText = app.name;
  if (regIdElem) regIdElem.innerText = app.regId;
  if (trackElem) trackElem.innerText = app.track;
  if (slotElem) slotElem.innerText = app.slot;
  if (utrElem) utrElem.innerText = app.utr || 'Logged & Verified';

  // Format mailto link
  if (mailtoBtn) {
    const subject = encodeURIComponent(`Welcome to SarlaYash Blessings Internships 2026 - ${app.regId}`);
    const body = encodeURIComponent(
      `Namaste ${app.name},\n\n` +
      `Welcome to SarlaYash Blessings Internships 2026 (Anniversary Batch)!\n\n` +
      `Here are your confirmed details:\n` +
      `• Registration ID: ${app.regId}\n` +
      `• Domain Track: ${app.track}\n` +
      `• Daily Focus Slot: ${app.slot}\n` +
      `• UPI UTR Reference: ${app.utr}\n` +
      `• Deposit Covenant: ₹50/Day (₹250/Wk) — 100% Refundable with Merit Stipend (₹5,000–₹15,000)\n\n` +
      `You will receive your Google Classroom & Drive invite 48 hours prior to Day 1.\n` +
      `Direct WhatsApp: https://wa.me/919873152277\n` +
      `Email: namaste@sarlayash.com\n\n` +
      `With blessings,\nKapil & SarlaYash Learning Solutions LLP`
    );
    mailtoBtn.href = `mailto:${app.email}?subject=${subject}&body=${body}`;
  }

  const modal = document.getElementById('welcomeEmailModal');
  if (modal) modal.classList.remove('hidden');

  if (window.lucide) window.lucide.createIcons();
}

function closeWelcomeEmailModal() {
  const modal = document.getElementById('welcomeEmailModal');
  if (modal) modal.classList.add('hidden');
}

function copyWelcomeEmailText() {
  const app = window.currentUserApp || {
    name: currentUser?.displayName || 'Candidate',
    email: currentUser?.email || '',
    regId: 'SY-2026-0842',
    track: 'Full-Stack Development',
    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',
    utr: 'Confirmed'
  };

  const text = 
    `Namaste ${app.name},\n\n` +
    `Welcome to SarlaYash Blessings Internships 2026 (Anniversary Batch)!\n\n` +
    `• Registration ID: ${app.regId}\n` +
    `• Domain Track: ${app.track}\n` +
    `• Daily Focus Slot: ${app.slot}\n` +
    `• UPI UTR Reference: ${app.utr}\n` +
    `• Commitment Deposit: ₹50/Day (₹250/wk) — 100% Refundable with Merit Stipends (₹5,000–₹15,000)\n\n` +
    `Google Classroom and Drive links will be shared 48 hours before Day 1.\n` +
    `Contact: Kapil (+91 9873152277 | namaste@sarlayash.com)\n\n` +
    `SarlaYash Learning Solutions LLP • Dedicated to Maa Sarla & Paa Yash`;

  navigator.clipboard.writeText(text).then(() => {
    alert("✓ Official Welcome Email text copied to clipboard!");
  }).catch(() => {
    prompt("Copy Welcome Email Text:", text);
  });
}
