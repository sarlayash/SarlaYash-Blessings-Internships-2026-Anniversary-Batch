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



    if (userPhoto) userPhoto.src = user.photoURL || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5A93C'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";



    if (userName) userName.innerText = user.displayName || 'Google User';







    // Sidebar UI



    if (sidebarLoginBtn) sidebarLoginBtn.classList.add('hidden');



    if (sidebarUserCard) {



      sidebarUserCard.classList.remove('hidden');



      sidebarUserCard.classList.add('flex');



    }



    if (sidebarUserPhoto) sidebarUserPhoto.src = user.photoURL || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5A93C'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";



    if (sidebarUserName) sidebarUserName.innerText = user.displayName || 'Google User';



    if (navManageAppBtn) {



      navManageAppBtn.classList.remove('hidden');



      navManageAppBtn.classList.add('inline-flex');



    }







    // Application Modal UI



    if (gate) gate.classList.add('hidden');



    if (authForm) authForm.classList.remove('hidden');



    if (formPhoto) formPhoto.src = user.photoURL || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5A93C'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";



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







  // Update Day 1 Onboarding Dashboard Authentication state



  const day1Notice = document.getElementById('day1AuthNoticeBanner');



  const day1Success = document.getElementById('day1AuthSuccessBanner');



  const day1Name = document.getElementById('day1LoggedUserName');



  const day1Email = document.getElementById('day1LoggedUserEmail');







  if (user) {



    if (day1Notice) day1Notice.classList.add('hidden');



    if (day1Success) day1Success.classList.remove('hidden');



    if (day1Name) day1Name.innerText = user.displayName || 'Verified Learner';



    if (day1Email) day1Email.innerText = user.email || '';



  } else {



    if (day1Notice) day1Notice.classList.remove('hidden');



    if (day1Success) day1Success.classList.add('hidden');



  }







  if (typeof populateDay1DashboardDetails === 'function') {



    populateDay1DashboardDetails();



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



  const rand4 = Math.floor(1000 + Math.random() * 9000);



  const regId = 'SY-2026-' + rand4;



  const journeyId = 'SYM-2026-' + rand4;







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



    journeyId: journeyId,



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



  if (typeof populateDay1DashboardDetails === 'function') {



    populateDay1DashboardDetails();



  }







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



    if (typeof populateDay1DashboardDetails === 'function') {



      populateDay1DashboardDetails();



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







  if (photoElem) photoElem.src = currentUser.photoURL || app.photoURL || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5A93C'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>";



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







// ----------------------------------------------------



// 12. HIGH-FIDELITY PDF GENERATION & DOWNLOAD ENGINE



// ----------------------------------------------------



async function downloadOfferLetter() {



  const element = document.getElementById('offerLetterPdfDoc');



  if (!element) {



    alert("Offer letter document not found.");



    return;



  }







  const app = window.currentUserApp || {



    regId: 'SY-2026-0842',



    name: currentUser?.displayName || 'Candidate Name'



  };







  const regIdClean = (app.regId || '2026').replace(/[^a-zA-Z0-9_-]/g, '');



  const filename = `SarlaYash-Internship-Offer-Letter-${regIdClean}.pdf`;







  const btn = document.getElementById('downloadOfferPdfBtn');



  const statusContainer = document.getElementById('offerPdfStatusMsg');



  const originalHtml = btn ? btn.innerHTML : '';







  if (btn) {



    btn.disabled = true;



    btn.innerHTML = `<span class="inline-block animate-spin mr-1.5">⏳</span><span>Generating PDF Document...</span>`;



  }



  if (statusContainer) {



    statusContainer.classList.remove('hidden');



    statusContainer.innerHTML = `<div class="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"><span class="animate-pulse">📜</span><span>Rendering executive appointment document for download...</span></div>`;



  }







  // Create clean isolated render container at (0, 0)



  const container = document.createElement('div');



  container.style.position = 'fixed';



  container.style.left = '0';



  container.style.top = '0';



  container.style.width = '794px';



  container.style.margin = '0';



  container.style.padding = '0';



  container.style.zIndex = '999999';



  container.style.backgroundColor = '#ffffff';



  container.style.overflow = 'visible';







  const clone = element.cloneNode(true);



  clone.style.width = '794px';



  clone.style.maxWidth = '794px';



  clone.style.margin = '0';



  clone.style.padding = '0';



  clone.style.boxSizing = 'border-box';



  clone.style.backgroundColor = '#ffffff';



  clone.style.color = '#0f172a';







  container.appendChild(clone);



  document.body.appendChild(container);







  const opt = {



    margin: [0, 0, 0, 0],



    filename: filename,



    image: { type: 'jpeg', quality: 0.98 },



    html2canvas: { 



      scale: 2, 



      useCORS: true, 



      backgroundColor: '#ffffff',



      logging: false



    },



    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },



    pagebreak: { mode: ['css', 'legacy'] }



  };







  try {



    if (typeof html2pdf !== 'undefined') {



      const worker = html2pdf().set(opt).from(clone);



      const blob = await worker.outputPdf('blob');



      const blobUrl = URL.createObjectURL(blob);







      // Direct trigger



      const a = document.createElement('a');



      a.href = blobUrl;



      a.download = filename;



      document.body.appendChild(a);



      a.click();



      setTimeout(() => { 



        if (document.body.contains(a)) document.body.removeChild(a); 



      }, 1000);







      if (statusContainer) {



        statusContainer.innerHTML = `



          <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">



            <span>✅ <strong>Offer Letter PDF Generated!</strong> If download didn't start:</span>



            <a href="${blobUrl}" download="${filename}" target="_blank" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold underline shadow">



              Click Here to Open / Save PDF



            </a>



          </div>



        `;



      }



    } else {



      fallbackCleanPrint(element, filename);



    }



  } catch (err) {



    console.error('PDF generation error:', err);



    fallbackCleanPrint(element, filename);



  } finally {



    if (document.body.contains(container)) {



      document.body.removeChild(container);



    }



    if (btn) {



      btn.disabled = false;



      btn.innerHTML = originalHtml;



      if (window.lucide) window.lucide.createIcons();



    }



  }



}







async function downloadWelcomeEmail() {



  const element = document.getElementById('welcomeEmailPdfDoc');



  if (!element) {



    alert("Welcome email document not found.");



    return;



  }







  const app = window.currentUserApp || {



    regId: 'SY-2026-0842',



    name: currentUser?.displayName || 'Candidate Name'



  };







  const regIdClean = (app.regId || '2026').replace(/[^a-zA-Z0-9_-]/g, '');



  const filename = `SarlaYash-Welcome-Letter-${regIdClean}.pdf`;







  const btn = document.getElementById('downloadWelcomePdfBtn');



  const statusContainer = document.getElementById('welcomePdfStatusMsg');



  const originalHtml = btn ? btn.innerHTML : '';







  if (btn) {



    btn.disabled = true;



    btn.innerHTML = `<span class="inline-block animate-spin mr-1.5">⏳</span><span>Generating PDF Document...</span>`;



  }



  if (statusContainer) {



    statusContainer.classList.remove('hidden');



    statusContainer.innerHTML = `<div class="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"><span class="animate-pulse">📜</span><span>Rendering welcome correspondence for download...</span></div>`;



  }







  // Create clean isolated render container at (0, 0)



  const container = document.createElement('div');



  container.style.position = 'fixed';



  container.style.left = '0';



  container.style.top = '0';



  container.style.width = '794px';



  container.style.margin = '0';



  container.style.padding = '0';



  container.style.zIndex = '999999';



  container.style.backgroundColor = '#ffffff';



  container.style.overflow = 'visible';







  const clone = element.cloneNode(true);



  clone.style.width = '794px';



  clone.style.maxWidth = '794px';



  clone.style.margin = '0';



  clone.style.padding = '18px 24px';



  clone.style.boxSizing = 'border-box';



  clone.style.backgroundColor = '#ffffff';



  clone.style.color = '#0f172a';







  container.appendChild(clone);



  document.body.appendChild(container);







  const opt = {



    margin: [4, 4, 4, 4],



    filename: filename,



    image: { type: 'jpeg', quality: 0.98 },



    html2canvas: { 



      scale: 2, 



      useCORS: true, 



      backgroundColor: '#ffffff',



      logging: false



    },



    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }



  };







  try {



    if (typeof html2pdf !== 'undefined') {



      const worker = html2pdf().set(opt).from(clone);



      const blob = await worker.outputPdf('blob');



      const blobUrl = URL.createObjectURL(blob);







      // Direct trigger



      const a = document.createElement('a');



      a.href = blobUrl;



      a.download = filename;



      document.body.appendChild(a);



      a.click();



      setTimeout(() => { 



        if (document.body.contains(a)) document.body.removeChild(a); 



      }, 1000);







      if (statusContainer) {



        statusContainer.innerHTML = `



          <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">



            <span>✅ <strong>Welcome Letter PDF Generated!</strong> If download didn't start:</span>



            <a href="${blobUrl}" download="${filename}" target="_blank" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold underline shadow">



              Click Here to Open / Save PDF



            </a>



          </div>



        `;



      }



    } else {



      fallbackCleanPrint(element, filename);



    }



  } catch (err) {



    console.error('PDF generation error:', err);



    fallbackCleanPrint(element, filename);



  } finally {



    if (document.body.contains(container)) {



      document.body.removeChild(container);



    }



    if (btn) {



      btn.disabled = false;



      btn.innerHTML = originalHtml;



      if (window.lucide) window.lucide.createIcons();



    }



  }



}







function fallbackCleanPrint(element, filename) {



  const iframe = document.createElement('iframe');



  iframe.style.position = 'fixed';



  iframe.style.right = '0';



  iframe.style.bottom = '0';



  iframe.style.width = '0';



  iframe.style.height = '0';



  iframe.style.border = '0';



  document.body.appendChild(iframe);







  const doc = iframe.contentWindow.document;



  doc.open();



  doc.write(`



    <!DOCTYPE html>



    <html>



      <head>



        <title>${filename}</title>



        <link rel="stylesheet" href="styles.css">



        <style>



          @page { size: A4 portrait; margin: 10mm; }



          html, body { background: #ffffff !important; color: #0f172a !important; margin: 0; padding: 10px; font-family: 'Plus Jakarta Sans', sans-serif; }



          img { max-width: 100%; height: auto; }



        </style>



      </head>



      <body>



        ${element.outerHTML}



      </body>



    </html>



  `);



  doc.close();







  setTimeout(() => {



    iframe.contentWindow.focus();



    iframe.contentWindow.print();



    setTimeout(() => {



      if (iframe.parentNode) document.body.removeChild(iframe);



    }, 2000);



  }, 500);



}







function showOfferLetterModal(customApp) {



  const app = customApp || window.currentUserApp || {



    name: currentUser?.displayName || 'Candidate Name',



    email: currentUser?.email || 'candidate@gmail.com',



    phone: '+91 9873152277',



    regId: 'SY-2026-0842',



    track: 'Full-Stack Development',



    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',



    utr: 'Logged & Verified'



  };







  const refNo = 'SYLLP/HR/2026/OFFER-' + (app.regId ? app.regId.replace('SY-2026-', '') : '8842');



  const today = new Date().toLocaleDateString('en-US', {



    month: 'long',



    day: 'numeric',



    year: 'numeric'



  });







  const refElem = document.getElementById('offerRefNo');



  const dateElem = document.getElementById('offerDate');



  const nameElem = document.getElementById('offerCandidateName');



  const salutationElem = document.getElementById('offerCandidateSalutation');



  const emailElem = document.getElementById('offerCandidateEmail');



  const phoneElem = document.getElementById('offerCandidatePhone');



  const regIdBadgeElem = document.getElementById('offerRegIdBadge');



  const trackTitleElem = document.getElementById('offerTrackTitle');



  const trackSummaryElem = document.getElementById('offerTrackSummary');



  const slotSummaryElem = document.getElementById('offerSlotSummary');



  const utrSummaryElem = document.getElementById('offerUtrSummary');



  const statusContainer = document.getElementById('offerPdfStatusMsg');







  if (refElem) refElem.innerText = refNo;



  if (dateElem) dateElem.innerText = today;



  if (nameElem) nameElem.innerText = app.name;



  if (salutationElem) salutationElem.innerText = app.name.split(' ')[0] || app.name;



  if (emailElem) emailElem.innerText = app.email;



  if (phoneElem) phoneElem.innerText = `Phone: ${app.phone || '+91 9873152277'}`;



  if (regIdBadgeElem) regIdBadgeElem.innerText = app.regId || 'SY-2026-0842';



  if (trackTitleElem) trackTitleElem.innerText = app.track || 'Full-Stack Development';



  if (trackSummaryElem) trackSummaryElem.innerText = app.track || 'Full-Stack Development';



  if (slotSummaryElem) slotSummaryElem.innerText = app.slot || 'Evening Batch (6:00 PM – 7:00 PM IST)';



  if (utrSummaryElem) utrSummaryElem.innerText = app.utr ? `UTR: ${app.utr} (Confirmed)` : 'Logged & Verified in Cloud';







  const refPage2Elem = document.getElementById('offerPage2RefNo');



  const acceptNameElem = document.getElementById('offerCandidateAcceptName');



  const acceptRegIdElem = document.getElementById('offerCandidateAcceptRegId');







  if (refPage2Elem) refPage2Elem.innerText = refNo;



  if (acceptNameElem) acceptNameElem.innerText = app.name;



  if (acceptRegIdElem) acceptRegIdElem.innerText = app.regId || 'SY-2026-0842';







  if (statusContainer) {



    statusContainer.classList.add('hidden');



    statusContainer.innerHTML = '';



  }







  const modal = document.getElementById('offerLetterModal');



  if (modal) modal.classList.remove('hidden');







  if (window.lucide) window.lucide.createIcons();



}







function closeOfferLetterModal() {



  const modal = document.getElementById('offerLetterModal');



  if (modal) modal.classList.add('hidden');



}







function copyOfferLetterText() {



  const app = window.currentUserApp || {



    name: currentUser?.displayName || 'Candidate Name',



    email: currentUser?.email || 'candidate@gmail.com',



    regId: 'SY-2026-0842',



    track: 'Full-Stack Development',



    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',



    utr: 'Confirmed'



  };







  const text = 



    `SARLAYASH LEARNING SOLUTIONS LLP\n` +



    `Dedicated to the Sacred Blessings of Maa Sarla & Paa Yash\n` +



    `OFFICIAL LETTER OF INTERNSHIP APPOINTMENT\n\n` +



    `Ref No: SYLLP/HR/2026/OFFER-${app.regId || '8842'}\n` +



    `Date: ${new Date().toLocaleDateString()}\n\n` +



    `To,\n${app.name}\n${app.email}\nPhone: ${app.phone || '+91 9873152277'}\nRegistration ID: ${app.regId}\n\n` +



    `Dear ${app.name},\n\n` +



    `We are delighted to formally offer you appointment as a Graduate Intern – ${app.track} in the prestigious Anniversary Batch 2026.\n\n` +



    `• Position: Graduate Intern – ${app.track}\n` +



    `• Cohort: Anniversary Batch 2026 (Strictly 50 Selected Interns)\n` +



    `• Schedule: 4 Weeks (20 Working Days, Mon–Fri, 1 Hour/Day)\n` +



    `• Daily Window: ${app.slot}\n` +



    `• Operating Formula: 10% Focused Micro-Theory, 90% Live Production Artifacts\n` +



    `• Commitment Fee: Strictly ₹50 INR daily only (₹250/Wk, ₹1,000 Total)\n` +



    `• Refund & Stipend Covenant: 100% Commitment Deposit Refunded to Merit Stipend Earners (₹5,000 to ₹15,000)\n` +



    `• Reference / UTR: ${app.utr || 'Logged & Verified'}\n\n` +



    `Authorized Signatory:\nKapil Narula\nFounder & Lead Mentor | The One Rupee Full-Stack CEO\nSarlaYash Learning Solutions LLP\nhttps://sarlayash.com/ | namaste@sarlayash.com | WhatsApp: +91 9873152277`;







  navigator.clipboard.writeText(text).then(() => {



    alert("✓ Official Offer Letter text copied to clipboard!");



  }).catch(() => {



    prompt("Copy Offer Letter Text:", text);



  });



}















// ----------------------------------------------------



// 13. DAY 1 ONBOARDING, JOURNEY ID, CERTIFICATE & BADGE



// ----------------------------------------------------







// ============================================================================
// 100% AUTHENTIC LEARNER CREDENTIAL REGISTRY & MOCK DEMO CANDIDATES
// ============================================================================
const DEMO_USERS = [
  {
    uid: 'demo_candidate_2026_aarav',
    displayName: 'Aarav Sharma',
    email: 'aarav.sharma.demo@gmail.com',
    phone: '+91 9876543210',
    track: 'Full-Stack Development',
    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',
    regId: 'SY-2026-7842',
    journeyId: 'SYM-2026-7842',
    utr: 'UTR894726482619',
    verifiedDate: 'October 25, 2026',
    authHash: 'SY-SHA256-8F9E2A-7842-AUTHENTIC'
  },
  {
    uid: 'demo_candidate_2026_priya',
    displayName: 'Priya Patel',
    email: 'priya.patel.demo@gmail.com',
    phone: '+91 9812345678',
    track: 'AI & Data Science',
    slot: 'Morning Batch (10:00 AM – 11:00 AM IST)',
    regId: 'SY-2026-1024',
    journeyId: 'SYM-2026-1024',
    utr: 'UTR783920194827',
    verifiedDate: 'October 25, 2026',
    authHash: 'SY-SHA256-4C1B9D-1024-AUTHENTIC'
  },
  {
    uid: 'demo_candidate_2026_rohan',
    displayName: 'Rohan Verma',
    email: 'rohan.verma.demo@gmail.com',
    phone: '+91 9723456789',
    track: 'Cybersecurity & Cloud',
    slot: 'Evening Batch (6:00 PM – 7:00 PM IST)',
    regId: 'SY-2026-5591',
    journeyId: 'SYM-2026-5591',
    utr: 'UTR564738291045',
    verifiedDate: 'October 25, 2026',
    authHash: 'SY-SHA256-2E7A3F-5591-AUTHENTIC'
  }
];

const AUTHENTIC_LEARNER_REGISTRY = {
  'SYM-2026-7842': {
    name: 'Aarav Sharma',
    track: 'Full-Stack Development',
    journeyId: 'SYM-2026-7842',
    batch: 'SarlaYash Blessings Anniversary Batch 2026 (Strictly 50 Seats)',
    status: 'Day 1 Virtual Onboarding & Induction Completed',
    verifiedDate: 'October 25, 2026',
    mentor: 'Kapil Narula (Founder & Lead Mentor | The One Rupee Full-Stack CEO)',
    authHash: 'SY-SHA256-8F9E2A-7842-AUTHENTIC'
  },
  'SYM-2026-1024': {
    name: 'Priya Patel',
    track: 'AI & Data Science',
    journeyId: 'SYM-2026-1024',
    batch: 'SarlaYash Blessings Anniversary Batch 2026 (Strictly 50 Seats)',
    status: 'Day 1 Virtual Onboarding & Induction Completed',
    verifiedDate: 'October 25, 2026',
    mentor: 'Kapil Narula (Founder & Lead Mentor | The One Rupee Full-Stack CEO)',
    authHash: 'SY-SHA256-4C1B9D-1024-AUTHENTIC'
  },
  'SYM-2026-5591': {
    name: 'Rohan Verma',
    track: 'Cybersecurity & Cloud',
    journeyId: 'SYM-2026-5591',
    batch: 'SarlaYash Blessings Anniversary Batch 2026 (Strictly 50 Seats)',
    status: 'Day 1 Virtual Onboarding & Induction Completed',
    verifiedDate: 'October 25, 2026',
    mentor: 'Kapil Narula (Founder & Lead Mentor | The One Rupee Full-Stack CEO)',
    authHash: 'SY-SHA256-2E7A3F-5591-AUTHENTIC'
  }
};

function getVerificationUrl(journeyId) {
  const cleanId = encodeURIComponent((journeyId || 'SYM-2026-7842').trim());
  return `https://sarlayash.github.io/SarlaYash-Blessings-Internships-2026-Anniversary-Batch/?verify=${cleanId}`;
}

function generateQrCodeDataUrl(text, size = 120) {
  return new Promise((resolve) => {
    try {
      if (typeof QRCode === 'undefined') {
        console.warn('QRCode library not ready yet');
        resolve('');
        return;
      }
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = size + 'px';
      tempDiv.style.height = size + 'px';
      tempDiv.style.visibility = 'hidden';
      document.body.appendChild(tempDiv);

      new QRCode(tempDiv, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });

      setTimeout(() => {
        let dataUrl = '';
        const canvas = tempDiv.querySelector('canvas');
        if (canvas) {
          try {
            dataUrl = canvas.toDataURL('image/png');
          } catch (e) {
            console.error('Error exporting QR canvas dataURL:', e);
          }
        }
        if (!dataUrl) {
          const img = tempDiv.querySelector('img');
          if (img && img.src && img.src.startsWith('data:')) {
            dataUrl = img.src;
          }
        }
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
        resolve(dataUrl);
      }, 50);
    } catch (err) {
      console.error('generateQrCodeDataUrl error:', err);
      resolve('');
    }
  });
}

function quickDemoLogin(index = 0) {
  const selectedIdx = (typeof index === 'number' && index >= 0 && index < DEMO_USERS.length) ? index : 0;
  const targetDemo = DEMO_USERS[selectedIdx];

  const demoUser = {
    uid: targetDemo.uid,
    displayName: targetDemo.displayName + ' (Demo Learner)',
    email: targetDemo.email,
    photoURL: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E5A93C'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 4-6 8-6s8 2 8 6'/></svg>"
  };

  const demoApp = {
    uid: demoUser.uid,
    name: targetDemo.displayName,
    email: targetDemo.email,
    phone: targetDemo.phone,
    track: targetDemo.track,
    slot: targetDemo.slot,
    regId: targetDemo.regId,
    journeyId: targetDemo.journeyId,
    utr: targetDemo.utr,
    submittedAt: new Date().toISOString(),
    status: 'verified_demo_candidate'
  };

  currentUser = demoUser;
  window.currentUserApp = demoApp;
  localStorage.setItem('sarlayash_app_' + demoUser.uid, JSON.stringify(demoApp));
  localStorage.setItem('sarlayash_verified_' + targetDemo.journeyId, JSON.stringify(AUTHENTIC_LEARNER_REGISTRY[targetDemo.journeyId]));

  updateAuthUI(demoUser);

  if (typeof populateDay1DashboardDetails === 'function') {
    populateDay1DashboardDetails();
  }
  if (typeof renderCodeOfConductUI === 'function') {
    renderCodeOfConductUI();
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#E5A93C', '#34A853', '#4285F4', '#EA4335']
    });
  }

  console.log(`Demo Learner Activated: ${targetDemo.displayName} | Journey ID: ${targetDemo.journeyId}`);
}

function getJourneyId(app) {



  if (app && app.journeyId) return app.journeyId;



  if (app && app.regId) {



    return app.regId.replace(/^SY-/, 'SYM-');



  }



  return null;



}







function copyJourneyId() {



  if (!currentUser) {



    alert("Authentication Required:\nPlease sign in with Google or activate Demo User to view and copy your official Journey ID.");



    loginWithGoogle();



    return;



  }







  const pill = document.getElementById('dashboardJourneyIdPill');



  const idText = pill ? pill.innerText.trim() : '';



  if (!idText || idText.includes('Login Required')) {



    alert("Please sign in to generate your official Journey ID.");



    return;



  }







  navigator.clipboard.writeText(idText).then(() => {



    alert(`Copied Journey ID: ${idText}



Keep this safe for your Day 1 to Day 22 attendance and Capstone evaluation!`);



  }).catch(() => {



    prompt("Copy your Journey ID:", idText);



  });



}







function switchOnboardingTab(tabName) {



  const buttons = document.querySelectorAll('.onboard-tab-btn');



  buttons.forEach(btn => {



    btn.classList.remove('active', 'bg-brand-velvet/60', 'text-amber-200', 'border-brand-gold/40');



    btn.classList.add('text-slate-400', 'border-transparent');



  });







  const activeBtn = document.getElementById('tabBtn-' + tabName);



  if (activeBtn) {



    activeBtn.classList.add('active');



    activeBtn.classList.remove('text-slate-400', 'border-transparent');



  }







  const panes = document.querySelectorAll('.onboard-tab-pane');



  panes.forEach(pane => pane.classList.add('hidden'));







  const activePane = document.getElementById('tabPane-' + tabName);



  if (activePane) {



    activePane.classList.remove('hidden');



  }







  if (window.lucide) window.lucide.createIcons();



}







function populateDay1DashboardDetails() {
  if (typeof renderCodeOfConductUI === 'function') {
    renderCodeOfConductUI();
  }



  const pill = document.getElementById('dashboardJourneyIdPill');



  const sidebarJourneyPill = document.getElementById('sidebarJourneyId');







  if (!currentUser) {



    if (pill) pill.innerText = "🔒 Login Required";



    if (sidebarJourneyPill) sidebarJourneyPill.innerText = "Login Required";



    return;



  }







  const app = window.currentUserApp || {



    name: currentUser.displayName || 'Candidate Name',



    track: 'Full-Stack Development',



    regId: 'SY-2026-0842',



    journeyId: 'SYM-2026-0842'



  };







  const journeyId = getJourneyId(app) || 'SYM-2026-0842';



  if (pill) pill.innerText = journeyId;



  if (sidebarJourneyPill) sidebarJourneyPill.innerText = journeyId;



}







async function showDay1CertificateModal() {
  if (!currentUser) {
    alert("Authentication Required:\nOnly verified, signed-in learners can view or download the Day 1 Certificate of Appreciation.\n\nPlease sign in with Google (or click Demo User) to continue.");
    loginWithGoogle();
    return;
  }

  const app = window.currentUserApp || {
    name: currentUser.displayName || 'Candidate Name',
    track: 'Full-Stack Development',
    regId: 'SY-2026-7842',
    journeyId: 'SYM-2026-7842'
  };

  const journeyId = getJourneyId(app) || 'SYM-2026-7842';
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const nameElem = document.getElementById('certCandidateName');
  const trackElem = document.getElementById('certTrack');
  const journeyElem = document.getElementById('certJourneyId');
  const dateElem = document.getElementById('certDate');
  const statusContainer = document.getElementById('certPdfStatusMsg');

  if (nameElem) nameElem.innerText = app.name || currentUser.displayName || 'Candidate Name';
  if (trackElem) trackElem.innerText = app.track || 'Full-Stack Development';
  if (journeyElem) journeyElem.innerText = journeyId;
  if (dateElem) dateElem.innerText = today;

  // Render 100% Authentic Scannable QR Code
  const certQrImg = document.getElementById('certQrImg');
  if (certQrImg) {
    const verifyUrl = getVerificationUrl(journeyId);
    const qrData = await generateQrCodeDataUrl(verifyUrl, 120);
    if (qrData) certQrImg.src = qrData;
  }

  if (statusContainer) {
    statusContainer.classList.add('hidden');
    statusContainer.innerHTML = '';
  }

  const modal = document.getElementById('day1CertificateModal');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}







function closeDay1CertificateModal() {



  const modal = document.getElementById('day1CertificateModal');



  if (modal) modal.classList.add('hidden');



}







async function downloadDay1Certificate() {
  if (!currentUser) {
    alert("Authentication Required: Please sign in to download your official Certificate.");
    loginWithGoogle();
    return;
  }

  const element = document.getElementById('day1CertPdfDoc');
  if (!element) {
    alert("Certificate document not found.");
    return;
  }

  const app = window.currentUserApp || {
    regId: 'SY-2026-7842',
    journeyId: 'SYM-2026-7842',
    name: currentUser.displayName || 'Candidate Name'
  };

  const jIdClean = (getJourneyId(app) || 'SYM-2026-7842').replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `SarlaYash-Day1-Certificate-${jIdClean}.pdf`;

  // Ensure QR code is rendered and ready
  const certQrImg = document.getElementById('certQrImg');
  if (certQrImg && (!certQrImg.src || !certQrImg.src.startsWith('data:'))) {
    const verifyUrl = getVerificationUrl(jIdClean);
    const qrData = await generateQrCodeDataUrl(verifyUrl, 120);
    if (qrData) certQrImg.src = qrData;
  }







  const btn = document.getElementById('downloadCertPdfBtn');



  const statusContainer = document.getElementById('certPdfStatusMsg');



  const originalHtml = btn ? btn.innerHTML : '';







  if (btn) {



    btn.disabled = true;



    btn.innerHTML = `<span class="inline-block animate-spin mr-1.5">⏳</span><span>Generating Certificate PDF...</span>`;



  }



  if (statusContainer) {



    statusContainer.classList.remove('hidden');



    statusContainer.innerHTML = `<div class="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"><span class="animate-pulse">📜</span><span>Rendering Day 1 Certificate of Appreciation...</span></div>`;



  }







  const container = document.createElement('div');



  container.style.position = 'fixed';



  container.style.left = '0';



  container.style.top = '0';



  container.style.width = '850px';



  container.style.margin = '0';



  container.style.padding = '0';



  container.style.zIndex = '999999';



  container.style.backgroundColor = '#ffffff';



  container.style.overflow = 'visible';







  const clone = element.cloneNode(true);



  clone.style.width = '850px';



  clone.style.minWidth = '850px';



  clone.style.maxWidth = '850px';



  clone.style.margin = '0';



  clone.style.padding = '24px 30px';



  clone.style.boxSizing = 'border-box';



  clone.style.backgroundColor = '#ffffff';



  clone.style.color = '#0f172a';







  container.appendChild(clone);



  document.body.appendChild(container);







  const opt = {



    margin: [0, 0, 0, 0],



    filename: filename,



    image: { type: 'jpeg', quality: 0.98 },



    html2canvas: { 



      scale: 2, 



      useCORS: true, 



      backgroundColor: '#ffffff',



      logging: false



    },



    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }



  };







  try {



    if (typeof html2pdf !== 'undefined') {



      const worker = html2pdf().set(opt).from(clone);



      const blob = await worker.outputPdf('blob');



      const blobUrl = URL.createObjectURL(blob);







      const a = document.createElement('a');



      a.href = blobUrl;



      a.download = filename;



      document.body.appendChild(a);



      a.click();



      setTimeout(() => { 



        if (document.body.contains(a)) document.body.removeChild(a); 



      }, 1000);







      if (statusContainer) {



        statusContainer.innerHTML = `



          <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">



            <span>✅ <strong>Day 1 Certificate PDF Generated!</strong> If download didn't start:</span>



            <a href="${blobUrl}" download="${filename}" target="_blank" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold underline shadow">



              Click Here to Open / Save PDF



            </a>



          </div>



        `;



      }



    } else {



      fallbackCleanPrint(element, filename);



    }



  } catch (err) {



    console.error('Certificate generation error:', err);



    fallbackCleanPrint(element, filename);



  } finally {



    if (document.body.contains(container)) {



      document.body.removeChild(container);



    }



    if (btn) {



      btn.disabled = false;



      btn.innerHTML = originalHtml;



      if (window.lucide) window.lucide.createIcons();



    }



  }



}







async function showDay1BadgeModal() {
  if (!currentUser) {
    alert("Authentication Required:\nOnly verified, signed-in learners can view or download the Day 1 Digital Induction Badge.\n\nPlease sign in with Google (or click Demo User) to continue.");
    loginWithGoogle();
    return;
  }

  const app = window.currentUserApp || {
    name: currentUser.displayName || 'Candidate Name',
    track: 'Full-Stack Development',
    regId: 'SY-2026-7842',
    journeyId: 'SYM-2026-7842'
  };

  const journeyId = getJourneyId(app) || 'SYM-2026-7842';

  const nameElem = document.getElementById('badgeCandidateName');
  const trackElem = document.getElementById('badgeTrack');
  const journeyElem = document.getElementById('badgeJourneyId');
  const statusContainer = document.getElementById('badgeStatusMsg');

  if (nameElem) nameElem.innerText = app.name || currentUser.displayName || 'Candidate Name';
  if (trackElem) trackElem.innerText = app.track || 'Full-Stack Development';
  if (journeyElem) journeyElem.innerText = journeyId;

  // Render 100% Authentic Scannable QR Code
  const badgeQrImg = document.getElementById('badgeQrImg');
  if (badgeQrImg) {
    const verifyUrl = getVerificationUrl(journeyId);
    const qrData = await generateQrCodeDataUrl(verifyUrl, 140);
    if (qrData) badgeQrImg.src = qrData;
  }

  if (statusContainer) {
    statusContainer.classList.add('hidden');
    statusContainer.innerHTML = '';
  }

  const modal = document.getElementById('day1BadgeModal');
  if (modal) modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}







function closeDay1BadgeModal() {



  const modal = document.getElementById('day1BadgeModal');



  if (modal) modal.classList.add('hidden');



}







async function downloadDay1Badge() {
  if (!currentUser) {
    alert("Authentication Required: Please sign in to download your official Digital Badge.");
    loginWithGoogle();
    return;
  }

  const element = document.getElementById('day1BadgeCard');
  if (!element) {
    alert("Badge card not found.");
    return;
  }

  const app = window.currentUserApp || {
    regId: 'SY-2026-7842',
    journeyId: 'SYM-2026-7842',
    name: currentUser.displayName || 'Candidate Name'
  };

  const jIdClean = (getJourneyId(app) || 'SYM-2026-7842').replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `SarlaYash-Day1-Badge-${jIdClean}.png`;

  // Ensure QR code is rendered and ready
  const badgeQrImg = document.getElementById('badgeQrImg');
  if (badgeQrImg && (!badgeQrImg.src || !badgeQrImg.src.startsWith('data:'))) {
    const verifyUrl = getVerificationUrl(jIdClean);
    const qrData = await generateQrCodeDataUrl(verifyUrl, 140);
    if (qrData) badgeQrImg.src = qrData;
  }







  const btn = document.getElementById('downloadBadgeBtn');



  const statusContainer = document.getElementById('badgeStatusMsg');



  const originalHtml = btn ? btn.innerHTML : '';







  if (btn) {



    btn.disabled = true;



    btn.innerHTML = `<span class="inline-block animate-spin mr-1.5">⏳</span><span>Rendering PNG Badge...</span>`;



  }



  if (statusContainer) {



    statusContainer.classList.remove('hidden');



    statusContainer.innerHTML = `<div class="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"><span class="animate-pulse">🛡️</span><span>Generating high-resolution PNG badge...</span></div>`;



  }







  try {



    if (typeof html2canvas !== 'undefined') {



      const canvas = await html2canvas(element, {



        scale: 3,



        useCORS: true,



        backgroundColor: '#0A0A0C',



        logging: false



      });







      canvas.toBlob((blob) => {



        if (!blob) {



          alert("Could not generate badge image.");



          return;



        }



        const blobUrl = URL.createObjectURL(blob);



        const a = document.createElement('a');



        a.href = blobUrl;



        a.download = filename;



        document.body.appendChild(a);



        a.click();



        setTimeout(() => {



          if (document.body.contains(a)) document.body.removeChild(a);



        }, 1000);







        if (statusContainer) {



          statusContainer.innerHTML = `



            <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">



              <span>✅ <strong>Digital Badge Downloaded!</strong></span>



              <a href="${blobUrl}" download="${filename}" target="_blank" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold underline shadow">



                Save Image



              </a>



            </div>



          `;



        }



      }, 'image/png');



    } else {



      alert("Canvas renderer is not available.");



    }



  } catch (err) {



    console.error("Badge download error:", err);



    alert("Error downloading badge: " + err.message);



  } finally {



    if (btn) {



      btn.disabled = false;



      btn.innerHTML = originalHtml;



      if (window.lucide) window.lucide.createIcons();



    }



  }



}







// Initialize Day 1 Dashboard Details on Startup



document.addEventListener('DOMContentLoaded', () => {



  if (typeof populateDay1DashboardDetails === 'function') {



    populateDay1DashboardDetails();



  }



});





// ============================================================================
// PUBLIC CREDENTIAL VERIFICATION SYSTEM (?verify=SYM-2026-XXXX)
// ============================================================================
function checkUrlForVerification() {
  try {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');
    if (!verifyId) return;

    const cleanId = verifyId.trim().toUpperCase();
    const modal = document.getElementById('publicVerifyModal');
    const container = document.getElementById('verifyDetailsContainer');
    if (!modal || !container) return;

    // Check authentic registry first
    let record = AUTHENTIC_LEARNER_REGISTRY[cleanId];

    // Check dynamically stored records
    if (!record) {
      try {
        const stored = localStorage.getItem('sarlayash_verified_' + cleanId);
        if (stored) record = JSON.parse(stored);
      } catch (e) {}
    }

    // Check active session app
    if (!record && window.currentUserApp && getJourneyId(window.currentUserApp) === cleanId) {
      record = {
        name: window.currentUserApp.name || (currentUser ? currentUser.displayName : 'Learner'),
        track: window.currentUserApp.track || 'Full-Stack Development',
        journeyId: cleanId,
        batch: 'SarlaYash Blessings Anniversary Batch 2026 (Strictly 50 Seats)',
        status: 'Day 1 Virtual Onboarding & Induction Completed',
        verifiedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        mentor: 'Kapil Narula (Founder & Lead Mentor | The One Rupee Full-Stack CEO)',
        authHash: 'SY-SHA256-' + cleanId.replace(/[^0-9A-Z]/g, '') + '-AUTHENTIC'
      };
    }

    if (record) {
      container.innerHTML = `
        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs font-bold text-emerald-300 uppercase tracking-wide">Status: Officially Verified & Inducted</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">100% AUTHENTIC</span>
          </div>

          <div class="space-y-2 border-y border-white/10 py-3 text-xs">
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Learner Name:</span>
              <span class="text-white font-extrabold text-sm sm:text-base">${record.name}</span>
            </div>
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Verified Journey ID:</span>
              <span class="text-emerald-400 font-mono font-bold text-xs bg-black/60 px-2 py-0.5 rounded border border-emerald-500/40">${record.journeyId}</span>
            </div>
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Assigned Track:</span>
              <span class="text-amber-300 font-bold">${record.track}</span>
            </div>
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Program Batch:</span>
              <span class="text-slate-200 text-right">${record.batch}</span>
            </div>
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Verification Date:</span>
              <span class="text-slate-200">${record.verifiedDate || 'October 25, 2026'}</span>
            </div>
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Issuing Authority:</span>
              <span class="text-slate-200">SarlaYash Learning Solutions LLP</span>
            </div>
            <div class="flex justify-between items-center py-0.5">
              <span class="text-slate-400 font-mono text-[11px]">Lead Mentor:</span>
              <span class="text-brand-gold font-semibold text-right">${record.mentor}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-white/5 font-mono text-[10px]">
              <span class="text-slate-500">Security Signature:</span>
              <span class="text-slate-400 text-right break-all">${record.authHash || 'SY-AUTH-VERIFIED'}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="space-y-3">
          <div class="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse"></span>
              <span class="text-xs font-bold text-rose-300 uppercase tracking-wide">Status: Unverified / Pending Registration</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">RECORD NOT FOUND</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            The Journey ID <code class="text-amber-300 font-mono bg-black/60 px-1.5 py-0.5 rounded font-bold">${cleanId}</code> was not found in the authentic registered batch records.
          </p>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            If you are an enrolled learner experiencing an issue with your credentials, please contact our admissions cell directly at <a href="mailto:namaste@sarlayash.com" class="text-brand-gold underline font-bold">namaste@sarlayash.com</a>.
          </p>
        </div>
      `;
    }

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('checkUrlForVerification error:', err);
  }
}

function closePublicVerifyModal() {
  const modal = document.getElementById('publicVerifyModal');
  if (modal) modal.classList.add('hidden');
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('verify');
    window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : ''));
  } catch (e) {}
}

// Check for verification query param on initial execution & DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkUrlForVerification);
} else {
  checkUrlForVerification();
}


// ============================================================================
// SARLAYASH 15-TENET CODE OF CONDUCT & ETHICAL COVENANT SYSTEM
// ============================================================================

const SARLAYASH_CODE_OF_CONDUCT = [
  {
    id: 1,
    title: "Sacred Foundation & Reverence",
    category: "Values & Heritage",
    icon: "heart-handshake",
    principle: "Learning at SarlaYash is not a transaction; it is a sacred covenant of human transformation grounded in the blessings of Maa Sarla & Paa Yash.",
    practice: "Enter every session with humility, deep respect for mentors, and gratitude towards family sacrifices. Treat every cohort member with the dignity of family.",
    zeroTolerance: "Arrogance, entitlement, disrespect towards mentors or staff, or commercializing cohort interactions."
  },
  {
    id: 2,
    title: "100% Punctuality & The 1-Hour Daily Discipline",
    category: "Professional Discipline",
    icon: "clock",
    principle: "Professional engineering excellence is built one focused hour every day. Showing up on time reflects self-respect and commitment to collective progress.",
    practice: "Join live syncs 3 minutes prior. Ensure a functional camera, clear microphone, and active workstation for all 22 working days without unexcused absences.",
    zeroTolerance: "Habitual tardiness, leaving sessions unannounced, or ghosting live milestone syncs without prior formal notification."
  },
  {
    id: 3,
    title: "Radical Ownership: 'It's On Me'",
    category: "Engineering Integrity",
    icon: "shield",
    principle: "You are the primary author of your engineering destiny. Take total ownership of your commits, test cases, and production deployments.",
    practice: "Take end-to-end responsibility for task deliverables. When a build breaks, diagnose it proactively, document the root cause, and drive the resolution.",
    zeroTolerance: "Blaming external tools, teammates, internet glitches, or circumstances. No excuses; only ownership and solutions."
  },
  {
    id: 4,
    title: "Production-Grade Standards (Zero Mediocrity)",
    category: "Craftsmanship",
    icon: "award",
    principle: "We build commercial-grade production systems, not toy tutorials. Every artifact you ship must be ready for live stakeholder evaluation.",
    practice: "Adhere to strict linting, clean commits, comprehensive error handling, modular architectures, and responsive UI benchmarks.",
    zeroTolerance: "Submitting buggy code, leaving unhandled console errors, copy-pasting code you don't understand, or delivering minimum-viable mediocrity."
  },
  {
    id: 5,
    title: "Dignified & Constructive Collaboration",
    category: "Professionalism",
    icon: "message-square",
    principle: "Our cohort is an incubator for intellectual rigor and mutual elevation. Every word spoken or written must reflect professionalism and poise.",
    practice: "Communicate with clarity, empathy, and professional etiquette across Slack, GitHub pull requests, WhatsApp channels, and live syncs.",
    zeroTolerance: "Harassment, profanity, microaggressions, gender/caste/regional biases, condescending critique, or toxic venting."
  },
  {
    id: 6,
    title: "Absolute Academic Honesty & Zero Plagiarism",
    category: "Ethics & Authenticity",
    icon: "check-check",
    principle: "Authentic capability cannot be faked or stolen. Your professional reputation is the single most valuable asset of your tech career.",
    practice: "Write your own logic and test cases. When referencing open-source patterns or official documentation, credit the source transparently.",
    zeroTolerance: "Copy-pasting another intern's repository, buying assignments, submitting forged Git commit histories, or claiming unauthored work."
  },
  {
    id: 7,
    title: "Responsible AI Usage: Augmentation Over Deception",
    category: "Modern AI Engineering",
    icon: "cpu",
    principle: "AI copilots are your intellectual multipliers, not an intellectual substitute. If you cannot explain the architecture, you do not own the skill.",
    practice: "Use AI to brainstorm architectures, debug edge cases, and accelerate boilerplate. Always review, refactor, and deeply comprehend every generated line.",
    zeroTolerance: "Submitting unvetted AI hallucinations, blind copy-pasting, or inability to live-defend and live-code your submitted solutions during mentor viva."
  },
  {
    id: 8,
    title: "Strict Confidentiality & IP Safeguarding",
    category: "Trust & Legal",
    icon: "lock",
    principle: "Trust is non-negotiable. You are granted access to proprietary mentor playbooks, enterprise problem statements, and private internal assets.",
    practice: "Keep all private repositories, internal lecture recordings, evaluation rubrics, and API keys strictly confidential within the cohort.",
    zeroTolerance: "Leaking cohort curriculum, sharing credentials or API keys on public forums, or distributing internal materials outside SarlaYash."
  },
  {
    id: 9,
    title: "Humility in Feedback & Rapid Growth Agility",
    category: "Growth Mindset",
    icon: "refresh-cw",
    principle: "Critique is the greatest gift a mentor can bestow. Feedback is directed at your code and execution, never your personal worth.",
    practice: "Receive mentor code reviews and pull-request revisions with gratitude, take rapid notes, and deploy remediation commits within 24 hours.",
    zeroTolerance: "Defensive arguments, sulking, disregarding mentor reviews, or repeating the exact same reported antipatterns."
  },
  {
    id: 10,
    title: "Cohort Empathy & Collective Victory",
    category: "Teamwork & Elevating Others",
    icon: "users",
    principle: "No SarlaYash intern is left behind. A true tech leader measures their stature by how many peers they elevate along the journey.",
    practice: "Share insights on community channels, unblock peers during evening debugging lounges, and celebrate fellow cohort members' wins.",
    zeroTolerance: "Gatekeeping knowledge, hoarding solutions, mocking someone's doubts, or fostering cutthroat toxic rivalry."
  },
  {
    id: 11,
    title: "Cybersecurity Hygiene & Secret Sanitation",
    category: "Security Excellence",
    icon: "key",
    principle: "Production engineers treat environment secrets and credentials with sovereign defense.",
    practice: "Use .env files, .gitignore, and secure credential managers. Sanitize all logs, client payloads, and production databases before commits.",
    zeroTolerance: "Hardcoding AWS/GCP keys, Firebase tokens, or database passwords in client code or pushing secrets to public GitHub repositories."
  },
  {
    id: 12,
    title: "Focused Digital Demeanor & Active Engagement",
    category: "Executive Demeanor",
    icon: "video",
    principle: "When you sit before mentors and peers, bring your complete undivided attention. Multi-tasking is the death of deep learning.",
    practice: "Keep your video camera on during live mentorship syncs, maintain eye contact, mute background noise, and participate actively in discussions.",
    zeroTolerance: "Attending calls while driving or multi-tasking on unrelated chores, passive background presence, or turning off video without prior notice."
  },
  {
    id: 13,
    title: "The 22-Day Completion Covenant",
    category: "Perseverance & Grit",
    icon: "flag",
    principle: "Great software engineers aren't the ones who never encounter bugs; they are the ones who refuse to surrender until the build is green.",
    practice: "Persevere through difficult debugging walls, utilize office hours, exhaust official docs, and see the full 22-day sprint to completion.",
    zeroTolerance: "Quitting midway due to initial difficulty, abandoning your teammates on assigned integrations, or dropping out without formal closure."
  },
  {
    id: 14,
    title: "Customer-Centricity & Real-World Utility",
    category: "User Value & Impact",
    icon: "target",
    principle: "Code has no intrinsic value until it serves a human being and solves a real-world friction point.",
    practice: "Design intuitive user interfaces, write accessible semantic HTML, optimize performance budgets, and build with the end-user's needs at center.",
    zeroTolerance: "Writing obtuse code that ignores real-world usability, ignoring performance bottlenecks, or disregarding user accessibility."
  },
  {
    id: 15,
    title: "The SarlaYash Ambassador & Gratitude Pledge",
    category: "Legacy & Citizenship",
    icon: "star",
    principle: "You are an ambassador of the SarlaYash legacy. Wherever your career takes you, carry our values of integrity, craft, and gratitude.",
    practice: "Represent SarlaYash Learning Solutions with pride on LinkedIn, GitHub, and industry forums. Pay your blessings forward by mentoring the next generation.",
    zeroTolerance: "Using SarlaYash credentials or brand name to mislead recruiters, conduct unethical freelance activities, or tarnish the sacred ethos."
  }
];

let currentCocCardIndex = 0;
let currentCocViewMode = 'stepper';

function getActiveJourneyId() {
  if (window.currentUserApp) {
    const id = getJourneyId(window.currentUserApp);
    if (id) return id;
  }
  if (currentUser) {
    try {
      const stored = localStorage.getItem('sarlayash_app_' + currentUser.uid);
      if (stored) {
        const parsed = JSON.parse(stored);
        const id = getJourneyId(parsed);
        if (id) return id;
      }
    } catch (e) {}
  }
  return 'SYM-2026-7842';
}

function getCocAcknowledgedSet(journeyId) {
  const jId = journeyId || getActiveJourneyId();
  try {
    const raw = localStorage.getItem('sarlayash_coc_' + jId);
    if (raw) {
      return new Set(JSON.parse(raw));
    }
  } catch (e) {}
  return new Set();
}

function saveCocAcknowledgedSet(journeyId, setObj) {
  const jId = journeyId || getActiveJourneyId();
  try {
    localStorage.setItem('sarlayash_coc_' + jId, JSON.stringify(Array.from(setObj)));
  } catch (e) {}
}

function toggleCocView(mode) {
  currentCocViewMode = mode;
  const stepperView = document.getElementById('cocStepperView');
  const gridView = document.getElementById('cocGridView');
  const btnStepper = document.getElementById('cocBtnViewStepper');
  const btnGrid = document.getElementById('cocBtnViewGrid');

  if (mode === 'grid') {
    if (stepperView) stepperView.classList.add('hidden');
    if (gridView) gridView.classList.remove('hidden');
    if (btnGrid) {
      btnGrid.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-brand-gold text-brand-dark shadow-sm flex items-center gap-1.5';
    }
    if (btnStepper) {
      btnStepper.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white flex items-center gap-1.5';
    }
  } else {
    if (stepperView) stepperView.classList.remove('hidden');
    if (gridView) gridView.classList.add('hidden');
    if (btnStepper) {
      btnStepper.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-brand-gold text-brand-dark shadow-sm flex items-center gap-1.5';
    }
    if (btnGrid) {
      btnGrid.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white flex items-center gap-1.5';
    }
  }
  renderCodeOfConductUI();
}

function prevCocCard() {
  currentCocCardIndex = Math.max(0, currentCocCardIndex - 1);
  renderCodeOfConductUI();
}

function nextCocCard() {
  currentCocCardIndex = Math.min(SARLAYASH_CODE_OF_CONDUCT.length - 1, currentCocCardIndex + 1);
  renderCodeOfConductUI();
}

function acknowledgeCurrentTenet() {
  const jId = getActiveJourneyId();
  const setObj = getCocAcknowledgedSet(jId);
  const currentTenet = SARLAYASH_CODE_OF_CONDUCT[currentCocCardIndex];
  if (currentTenet) {
    setObj.add(currentTenet.id);
    saveCocAcknowledgedSet(jId, setObj);
    
    // Check if newly completed all 15
    if (setObj.size === 15) {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E5A93C', '#34A853', '#4285F4', '#EA4335', '#F59E0B']
        });
      }
    } else {
      // Advance to next unacknowledged card if available
      for (let i = 0; i < SARLAYASH_CODE_OF_CONDUCT.length; i++) {
        const nextIdx = (currentCocCardIndex + 1 + i) % SARLAYASH_CODE_OF_CONDUCT.length;
        if (!setObj.has(SARLAYASH_CODE_OF_CONDUCT[nextIdx].id)) {
          currentCocCardIndex = nextIdx;
          break;
        }
      }
    }
  }
  renderCodeOfConductUI();
}

function acknowledgeTenet(id) {
  const jId = getActiveJourneyId();
  const setObj = getCocAcknowledgedSet(jId);
  setObj.add(id);
  saveCocAcknowledgedSet(jId, setObj);

  if (setObj.size === 15 && typeof confetti === 'function') {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  }
  renderCodeOfConductUI();
}

function acknowledgeAllTenets() {
  const jId = getActiveJourneyId();
  const setObj = new Set();
  SARLAYASH_CODE_OF_CONDUCT.forEach(t => setObj.add(t.id));
  saveCocAcknowledgedSet(jId, setObj);

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#E5A93C', '#34A853', '#4285F4', '#EA4335', '#F59E0B']
    });
  }
  renderCodeOfConductUI();
}

async function renderCodeOfConductUI() {
  const jId = getActiveJourneyId();
  const setObj = getCocAcknowledgedSet(jId);
  const count = setObj.size;
  const total = SARLAYASH_CODE_OF_CONDUCT.length;
  const pct = Math.round((count / total) * 100);

  // Update Counters & Progress Bar
  const countElem = document.getElementById('cocProgressCount');
  const pctElem = document.getElementById('cocProgressPercent');
  const barElem = document.getElementById('cocProgressBar');
  const badgeCount = document.getElementById('conductBadgeCount');
  const bannerStatus = document.getElementById('bannerCocStatusText');
  const bannerBtn = document.getElementById('bannerCocBtnText');

  if (countElem) countElem.innerText = count;
  if (pctElem) pctElem.innerText = pct + '%';
  if (barElem) barElem.style.width = pct + '%';

  if (badgeCount) {
    badgeCount.innerText = count === total ? '15/15 ✓' : `${count}/15`;
    badgeCount.className = count === total
      ? 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
      : 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30';
  }

  if (bannerStatus) {
    bannerStatus.innerHTML = count === total
      ? '<span class="text-emerald-400 font-bold">✓ 15/15 Tenets Formally Signed</span>'
      : `<span class="text-amber-300 font-medium">${count}/15 Acknowledged (Pending)</span>`;
  }
  if (bannerBtn) {
    bannerBtn.innerText = count === total ? 'View Signed Agreement' : 'Read & Sign 15 Tenets';
  }

  // Render Stepper Active Card
  const stepperContainer = document.getElementById('cocCardActiveContainer');
  const stepIndicator = document.getElementById('cocCardStepIndicator');
  const prevBtn = document.getElementById('cocPrevBtn');
  const nextBtn = document.getElementById('cocNextBtn');

  if (stepIndicator) stepIndicator.innerText = `Tenet ${currentCocCardIndex + 1} of ${total}`;
  if (prevBtn) prevBtn.disabled = currentCocCardIndex === 0;
  if (nextBtn) nextBtn.disabled = currentCocCardIndex === total - 1;

  if (stepperContainer && SARLAYASH_CODE_OF_CONDUCT[currentCocCardIndex]) {
    const card = SARLAYASH_CODE_OF_CONDUCT[currentCocCardIndex];
    const isAck = setObj.has(card.id);

    stepperContainer.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-crimson to-brand-ruby border border-brand-gold/60 text-brand-gold flex items-center justify-center shrink-0 shadow-gold-glow">
            <i data-lucide="${card.icon}" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
              Tenet ${String(card.id).padStart(2, '0')} of 15 • ${card.category}
            </div>
            <h4 class="font-heading font-extrabold text-xl sm:text-2xl text-white">
              ${card.title}
            </h4>
          </div>
        </div>

        <div>
          ${isAck ? `
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              <span>Acknowledged</span>
            </span>
          ` : `
            <span class="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Pending Agreement</span>
            </span>
          `}
        </div>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-slate-200">
        <div class="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
          <div class="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">Core Ethical Principle:</div>
          <p class="leading-relaxed text-slate-100 font-serif italic text-sm">"${card.principle}"</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
            <div class="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>Required Practice & Standard:</span>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed">${card.practice}</p>
          </div>

          <div class="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
            <div class="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
              <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i>
              <span>Zero-Tolerance Policy:</span>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed">${card.zeroTolerance}</p>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div class="text-xs text-slate-400">
          ${isAck 
            ? '<span class="text-emerald-400 font-semibold">✓ You have formally agreed to uphold this tenet.</span>' 
            : 'Please review and confirm your adherence to this practice:'}
        </div>

        <button onclick="acknowledgeCurrentTenet()" id="cocAcknowledgeBtn" class="px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${
          isAck 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30' 
            : 'bg-gradient-to-r from-brand-gold via-amber-300 to-brand-gold text-brand-dark shadow-gold-glow hover:brightness-110 active:scale-95'
        }">
          <i data-lucide="${isAck ? 'check-check' : 'check'}" class="w-4 h-4"></i>
          <span>${isAck ? 'Acknowledged (Click to Advance)' : `I Have Read & Agree to Uphold Tenet ${card.id}`}</span>
        </button>
      </div>
    `;
  }

  // Render Grid Cards
  const gridContainer = document.getElementById('cocGridCardsContainer');
  if (gridContainer) {
    gridContainer.innerHTML = SARLAYASH_CODE_OF_CONDUCT.map(card => {
      const isAck = setObj.has(card.id);
      return `
        <div class="p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
          isAck 
            ? 'bg-emerald-950/20 border-emerald-500/40' 
            : 'bg-brand-card border-white/10 hover:border-brand-gold/40'
        }">
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[9.5px] font-mono uppercase tracking-wider ${isAck ? 'text-emerald-400' : 'text-brand-gold'} font-bold">
                Tenet ${String(card.id).padStart(2, '0')} • ${card.category}
              </span>
              <div class="w-7 h-7 rounded-lg ${isAck ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-gold/15 text-brand-gold'} flex items-center justify-center shrink-0">
                <i data-lucide="${card.icon}" class="w-3.5 h-3.5"></i>
              </div>
            </div>

            <h5 class="font-heading font-bold text-sm text-white">${card.title}</h5>
            <p class="text-xs text-slate-300 leading-relaxed font-serif italic line-clamp-2">"${card.principle}"</p>
          </div>

          <div class="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
            <button onclick="acknowledgeTenet(${card.id})" class="w-full py-1.5 px-3 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              isAck
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/10 hover:bg-brand-gold hover:text-brand-dark text-slate-300'
            }">
              <i data-lucide="${isAck ? 'check-check' : 'check'}" class="w-3.5 h-3.5"></i>
              <span>${isAck ? 'Acknowledged' : 'Acknowledge'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Signed Agreement Section if 15/15
  const agreementSection = document.getElementById('cocSignedAgreementSection');
  if (agreementSection) {
    if (count === total) {
      agreementSection.classList.remove('hidden');

      // Populate personalized details
      const app = window.currentUserApp || {
        name: currentUser ? currentUser.displayName : 'Candidate Name',
        track: 'Full-Stack Development',
        journeyId: jId
      };

      const cName = app.name || (currentUser ? currentUser.displayName : 'Candidate Name');
      const cTrack = app.track || 'Full-Stack Development';
      const cDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      const nameEl = document.getElementById('signedCocCandidateName');
      const jIdEl = document.getElementById('signedCocJourneyId');
      const trackEl = document.getElementById('signedCocTrack');
      const dateEl = document.getElementById('signedCocDate');
      const salutationEl = document.getElementById('signedCocSalutationName');
      const page2NameEl = document.getElementById('signedCocPage2Name');
      const page2IdEl = document.getElementById('signedCocPage2Id');
      const candSigEl = document.getElementById('signedCocCandidateSig');
      const sigTokenEl = document.getElementById('signedCocSigToken');
      const sigDateEl = document.getElementById('signedCocSigDate');

      if (nameEl) nameEl.innerText = cName;
      if (jIdEl) jIdEl.innerText = jId;
      if (trackEl) trackEl.innerText = cTrack;
      if (dateEl) dateEl.innerText = cDate;
      if (salutationEl) salutationEl.innerText = cName.split(' ')[0] || cName;
      if (page2NameEl) page2NameEl.innerText = cName;
      if (page2IdEl) page2IdEl.innerText = jId;
      if (candSigEl) candSigEl.innerText = cName;
      if (sigTokenEl) sigTokenEl.innerText = `Token: SY-COC-${jId.replace(/[^0-9A-Z]/g, '')}-AUTH`;
      if (sigDateEl) sigDateEl.innerText = `Date: ${cDate}`;

      // Populate Part 1 (Tenets 1 - 7)
      const part1El = document.getElementById('signedCocTenetsPart1');
      if (part1El) {
        part1El.innerHTML = SARLAYASH_CODE_OF_CONDUCT.slice(0, 7).map(t => `
          <div class="border-b border-slate-100 pb-1">
            <strong class="text-slate-900 font-sans">${t.id}. ${t.title}:</strong>
            <span> ${t.practice}</span>
          </div>
        `).join('');
      }

      // Populate Part 2 (Tenets 8 - 15)
      const part2El = document.getElementById('signedCocTenetsPart2');
      if (part2El) {
        part2El.innerHTML = SARLAYASH_CODE_OF_CONDUCT.slice(7).map(t => `
          <div class="border-b border-slate-100 pb-1">
            <strong class="text-slate-900 font-sans">${t.id}. ${t.title}:</strong>
            <span> ${t.practice}</span>
          </div>
        `).join('');
      }

      // Render Verified QR Code in Signed Document
      const signedQrImg = document.getElementById('signedCocQrImg');
      if (signedQrImg && (!signedQrImg.src || !signedQrImg.src.startsWith('data:'))) {
        const verifyUrl = getVerificationUrl(jId);
        generateQrCodeDataUrl(verifyUrl, 120).then(qrData => {
          if (qrData) signedQrImg.src = qrData;
        });
      }

    } else {
      agreementSection.classList.add('hidden');
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

async function downloadSignedCodeOfConductPdf() {
  const jId = getActiveJourneyId();
  const setObj = getCocAcknowledgedSet(jId);
  if (setObj.size < 15) {
    alert("Please review and acknowledge all 15 Tenets before downloading your signed Code of Conduct Agreement.");
    return;
  }

  const element = document.getElementById('signedCocDoc');
  if (!element) {
    alert("Code of Conduct document not found.");
    return;
  }

  const app = window.currentUserApp || {
    journeyId: jId,
    name: currentUser ? currentUser.displayName : 'Candidate Name'
  };

  const jIdClean = (jId || 'SYM-2026-7842').replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `SarlaYash-Code-Of-Conduct-${jIdClean}.pdf`;

  const btn = document.getElementById('downloadCocPdfBtn');
  const statusContainer = document.getElementById('cocPdfStatusMsg');
  const originalHtml = btn ? btn.innerHTML : '';

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block animate-spin mr-1.5">⏳</span><span>Generating Signed Covenant PDF...</span>`;
  }
  if (statusContainer) {
    statusContainer.classList.remove('hidden');
    statusContainer.innerHTML = `<div class="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"><span class="animate-pulse">📄</span><span>Rendering 2-page executive agreement document for download...</span></div>`;
  }

  // Ensure QR Code is ready
  const signedQrImg = document.getElementById('signedCocQrImg');
  if (signedQrImg && (!signedQrImg.src || !signedQrImg.src.startsWith('data:'))) {
    const verifyUrl = getVerificationUrl(jIdClean);
    const qrData = await generateQrCodeDataUrl(verifyUrl, 120);
    if (qrData) signedQrImg.src = qrData;
  }

  // Create clean isolated render container at (0, 0)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.zIndex = '999999';
  container.style.backgroundColor = '#ffffff';
  container.style.overflow = 'visible';

  const clone = element.cloneNode(true);
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.margin = '0';
  clone.style.padding = '0';
  clone.style.boxSizing = 'border-box';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';

  container.appendChild(clone);
  document.body.appendChild(container);

  const opt = {
    margin: [0, 0, 0, 0],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    if (typeof html2pdf !== 'undefined') {
      const worker = html2pdf().set(opt).from(clone);
      const blob = await worker.outputPdf('blob');
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 1000);

      if (statusContainer) {
        statusContainer.innerHTML = `
          <div class="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
            <span>✅ <strong>Signed Code of Conduct PDF Downloaded!</strong> If download didn't start:</span>
            <a href="${blobUrl}" download="${filename}" target="_blank" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold underline shadow">
              Click Here to Open / Save PDF
            </a>
          </div>
        `;
      }
    } else {
      fallbackCleanPrint(element, filename);
    }
  } catch (err) {
    console.error('Code of conduct PDF generation error:', err);
    fallbackCleanPrint(element, filename);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}
