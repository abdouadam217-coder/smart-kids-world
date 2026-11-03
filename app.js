/* منطق تطبيق عالم الصغار الذكي — نسخة مطابقة لتصميم Base44 */

const state = {
  view: "login",
  grade: "5",
  subjectId: "math",
  studentName: "",
  loginMode: "login",
  weakFilter: "all",
  historyFilter: "all",
  historyQuery: "",
  busy: false,
  answerTimer: null,
  attachments: []
};

const $ = (id) => document.getElementById(id);

const DEFAULT_GRADE = "5";
const DEFAULT_SUBJECT = "math";

const SUBJECT_TINTS = {
  math: "sky",
  science: "emerald",
  arabic: "rose",
  english: "violet",
  islamic: "teal",
  social: "amber"
};

const SUBJECT_ICONS = {
  math: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
  science: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8 2h8"/><path d="M7 15h10"/></svg>',
  arabic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>',
  english: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
  islamic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>',
  social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
};

const ICON_SPARKLES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 14.5l.6 1.6 1.6.6-1.6.6L19 19l-.6-1.6-1.6-.6 1.6-.6z"/></svg>';
const ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>';
const ICON_GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
const ICON_LAYERS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
const ICON_CHEVRON = '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
const ICON_BRAIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>';
const QUIZ_LETTERS = ["أ", "ب", "ج", "د"];
const ICON_FILE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/></svg>';
const ICON_CLIP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 12-8.5 8.5a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>';

/* ---------- مساعدات ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[\u0623\u0622\u0671]/g, "\u0627")
    .replace(/[\u0625]/g, "\u0627")
    .replace(/[\u0624]/g, "\u0648")
    .replace(/[\u0626]/g, "\u064A");
}

function scoreTerm(term, norm) {
  let score = 0;
  for (const kw of term.keywords) {
    const k = normalize(kw);
    if (k && norm.includes(k)) score += k.includes(" ") ? 3 : 1;
  }
  return score;
}

function pickTerms(subjectId, text) {
  const subject = SUBJECTS[subjectId] || SUBJECTS[DEFAULT_SUBJECT];
  const norm = normalize(text);
  const scored = subject.terms
    .map((t) => ({ t, s: scoreTerm(t, norm) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return { subject, terms: scored.slice(0, 2).map((x) => x.t) };
}

function sentences(text) {
  const found = String(text || "").match(/[^.؟!\n]+[.؟!]?/g) || [];
  return found.map((s) => s.trim()).filter(Boolean);
}

function exampleText(t) {
  return String((t && t.example) || "").replace(/^مثال\s*:\s*/, "");
}

function tintFor(subjectId) {
  return "tint-" + (SUBJECT_TINTS[subjectId] || "violet");
}

function subjectName(subjectId) {
  return SUBJECTS[subjectId] ? SUBJECTS[subjectId].name : "";
}

function formatAsked(count) {
  const n = Number(count) || 1;
  if (n === 1) return "سألت عنه مرة واحدة";
  if (n === 2) return "سألت عنه مرتين";
  if (n <= 10) return "سألت عنه " + n + " مرات";
  return "سألت عنه " + n + " مرة";
}

/* ---------- التخزين ---------- */
function readSavedStudent() {
  let raw = null;
  try { raw = localStorage.getItem("skw_student"); } catch (e) { return ""; }
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.name) return String(parsed.name);
    if (typeof parsed === "string") return parsed;
  } catch (e) {}
  return String(raw);
}

function loadPrefs() {
  let grade = null;
  let subject = null;
  try {
    grade = localStorage.getItem("skw_grade");
    subject = localStorage.getItem("skw_subject");
  } catch (e) {}
  const grades = (typeof GRADES !== "undefined" ? GRADES : [5, 6, 7, 8]).map(String);
  state.grade = grades.includes(grade) ? grade : DEFAULT_GRADE;
  state.subjectId = SUBJECTS[subject] ? subject : DEFAULT_SUBJECT;
}

function weakStorageKey() {
  return "skw_weak_" + (state.studentName || "زائر");
}

function lastAnswerKey() {
  return "skw_last_" + (state.studentName || "زائر");
}

function getWeakList() {
  try {
    const raw = localStorage.getItem(weakStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveWeakList(list) {
  try {
    localStorage.setItem(weakStorageKey(), JSON.stringify(list));
  } catch (e) {}
}

function findTerm(key) {
  const parts = String(key || "").split("::");
  const subject = SUBJECTS[parts[0]];
  if (!subject) return null;
  return subject.terms.find((t) => t.key === key) || null;
}

/* ---------- سجل الأسئلة والتدريب ---------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value == null ? fallback : value;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function historyKey() {
  return "skw_history_" + (state.studentName || "زائر");
}

function quizLogKey() {
  return "skw_quizlog_" + (state.studentName || "زائر");
}

function parentEmailKey() {
  return "skw_parent_email_" + (state.studentName || "زائر");
}

function getHistory() {
  const list = readJSON(historyKey(), []);
  return Array.isArray(list) ? list : [];
}

function pushHistory(entry) {
  const list = getHistory();
  list.push(entry);
  if (list.length > 200) list.splice(0, list.length - 200);
  try {
    localStorage.setItem(historyKey(), JSON.stringify(list));
    return;
  } catch (e) {}
  // مساحة التخزين ممتلئة؟ نحفظ بدون صور المرفقات حتى لا يضيع السؤال.
  const light = list.map((item) => {
    if (!Array.isArray(item.attachments)) return item;
    return Object.assign({}, item, {
      attachments: item.attachments.map((a) => ({ kind: a.kind, name: a.name }))
    });
  });
  writeJSON(historyKey(), light);
}

function getQuizLog() {
  const list = readJSON(quizLogKey(), []);
  return Array.isArray(list) ? list : [];
}

function logQuiz(total, correct) {
  const list = getQuizLog();
  list.push({ ts: Date.now(), total: total, correct: correct });
  if (list.length > 300) list.splice(0, list.length - 300);
  writeJSON(quizLogKey(), list);
}

function startOfWeek(ts) {
  const date = new Date(ts);
  const shift = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - shift);
  return date.getTime();
}

function accuracyOf(logs) {
  let correct = 0;
  let total = 0;
  for (const item of logs) {
    correct += Number(item.correct) || 0;
    total += Number(item.total) || 0;
  }
  return total > 0 ? Math.round((correct / total) * 100) : null;
}

function timeAgo(ts) {
  const diff = Date.now() - Number(ts || 0);
  if (!diff || diff < 60000) return "الآن";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return "قبل " + minutes + " دقيقة";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return "قبل " + hours + " ساعة";
  const days = Math.floor(hours / 24);
  if (days < 7) return "قبل " + days + " يوم";
  const date = new Date(Number(ts));
  return date.toLocaleDateString("ar", { day: "numeric", month: "short" });
}

/* ---------- بناء اختبار سريع ---------- */
function hashString(value) {
  let hash = 2166136261;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(list, seed) {
  const items = list.slice();
  let stateSeed = seed || 1;
  for (let i = items.length - 1; i > 0; i -= 1) {
    stateSeed = (Math.imul(stateSeed, 1103515245) + 12345) >>> 0;
    const j = stateSeed % (i + 1);
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }
  return items;
}

function shortText(text) {
  const value = String(text || "").trim();
  const found = value.match(/^[\s\S]*?[.؟!](?=\s|$)/);
  return found ? found[0].trim() : value;
}

function questionIntent(question) {
  const q = String(question || "").trim();
  if (/^(ليش|لماذا|لِماذا|لمَ|علشان|بسبب|ما سبب|ما السبب|وش سبب)/.test(q)) return "why";
  if (/^(كيف|كيفاش|كيفية|بأي طريقة|ما طريقة)/.test(q)) return "how";
  if (/^(هل|صح|صحيح|ممكن)/.test(q)) return "yesno";
  return "what";
}

function intentLead(intent) {
  if (intent === "why") return "سؤالك عن السبب — وهذه الفكرة التي يدور حولها:";
  if (intent === "how") return "سؤالك عن الطريقة — وهذه الفكرة الأساسية:";
  if (intent === "yesno") return "لنجيب على سؤالك، هذه الفكرة الأساسية:";
  return "سؤالك عن المعنى — وهذا أبسط شرح:";
}

function intentTip(intent, first, second) {
  if (intent === "why") {
    return "دوّن في دفترك الجملة التي تبدأ بـ«لأن» في درس «" + first.ar + "»؛ ستجد السبب هناك.";
  }
  if (intent === "how") {
    return "رتّب الخطوات على ورقة، ثم اشرحها لصديق بالترتيب نفسه.";
  }
  if (second) {
    return "اربط بين «" + first.ar + "» و«" + second.ar + "» في جملة واحدة من عندك.";
  }
  return "جرّب أن تشرح «" + first.ar + "» لصديق بكلماتك؛ الشرح للغير يثبّت المعلومة.";
}

/* التعريف بدون اسم المصطلح — حتى لا يكون سؤال «أي مصطلح يطابق التعريف» سهلًا جدًا */
function definitionClue(term) {
  const full = shortText(term.simple);
  const names = [term.ar, term.en].filter(Boolean);
  for (const name of names) {
    if (full.startsWith(name)) {
      const rest = full.slice(name.length).replace(/^[\s:،,.\-–]+/, "").trim();
      if (rest.length >= 12) return rest;
      break;
    }
  }
  return full;
}

function timesText(n) {
  const count = Number(n) || 0;
  if (count === 1) return "مرة واحدة";
  if (count === 2) return "مرتين";
  if (count >= 3 && count <= 10) return count + " مرات";
  return count + " مرة";
}

function questionsText(n) {
  const count = Number(n) || 0;
  if (count === 1) return "سؤال واحد";
  if (count === 2) return "سؤالين";
  if (count >= 3 && count <= 10) return count + " أسئلة";
  return count + " سؤالًا";
}

function pointsText(n) {
  const count = Math.abs(Number(n) || 0);
  if (count === 1) return "نقطة واحدة";
  if (count === 2) return "نقطتين";
  if (count >= 3 && count <= 10) return count + " نقاط";
  return count + " نقطة";
}

function buildQuiz(terms, subjectId) {
  const subject = SUBJECTS[subjectId];
  if (!subject || !terms.length) return [];
  const others = subject.terms.filter((t) => !terms.some((x) => x.key === t.key));
  const questions = [];

  terms.slice(0, 2).forEach((term, index) => {
    const seed = hashString(term.key + "::" + index);
    const distractors = seededShuffle(others, seed).slice(0, 3);
    const definitionOptions = seededShuffle([term].concat(distractors), seed + 17)
      .map((t) => shortText(t.simple));
    const definitionAnswer = definitionOptions.indexOf(shortText(term.simple));
    questions.push({
      question: "ما معنى «" + term.ar + "»؟",
      options: definitionOptions,
      answer: definitionAnswer,
      difficulty: "سهل",
      why: "«" + term.ar + "»: " + shortText(term.simple)
    });

    if (index === 0) {
      const clue = definitionClue(term);
      const nameOptions = seededShuffle([term].concat(distractors), seed + 31).map((t) => t.ar);
      const nameAnswer = nameOptions.indexOf(term.ar);
      questions.push({
        question: "أي مصطلح يطابق هذا التعريف: «" + clue + "»؟",
        options: nameOptions,
        answer: nameAnswer,
        difficulty: "متوسط",
        why: "«" + term.ar + "»: " + shortText(term.simple)
      });
    }
  });

  return questions;
}

function difficultyClass(difficulty) {
  if (difficulty === "صعب") return "diff-hard";
  if (difficulty === "متوسط") return "diff-medium";
  return "diff-easy";
}

function quizHTML(questions) {
  if (!questions.length) return "";
  const items = questions.map((q, index) => {
    const options = q.options.map((option, optionIndex) =>
      '<button type="button" class="quiz-option" data-index="' + optionIndex + '">' +
        '<span class="quiz-letter">' + QUIZ_LETTERS[optionIndex] + "</span>" +
        "<span>" + esc(option) + "</span>" +
      "</button>"
    ).join("");
    return '<li class="quiz-item" data-answer="' + q.answer + '" data-why="' + esc(q.why) + '">' +
      '<p class="quiz-question">' +
        '<span class="quiz-num">' + (index + 1) + ".</span>" +
        "<span>" + esc(q.question) + "</span>" +
        '<span class="quiz-diff ' + difficultyClass(q.difficulty) + '">' + esc(q.difficulty) + "</span>" +
      "</p>" +
      '<div class="quiz-options">' + options + "</div>" +
      '<p class="quiz-feedback" hidden></p>' +
    "</li>";
  }).join("");

  return '<section class="quiz-card" data-quiz data-total="' + questions.length +
    '" data-answered="0" data-logged="false">' +
    '<div class="quiz-head">' +
      '<h3 class="card-title">' + ICON_BRAIN + " اختبر فهمك</h3>" +
      '<span class="quiz-progress">0 من ' + questions.length + "</span>" +
    "</div>" +
    '<ol class="quiz-list">' + items + "</ol>" +
    '<p class="quiz-score" hidden></p>' +
  "</section>";
}

/* ---------- المرفقات (صورة أو ملف نصي مع السؤال) ---------- */
const ATTACH_MAX = 2;
const ATTACH_MAX_BYTES = 4 * 1024 * 1024;
const ATTACH_TEXT_LIMIT = 4000;

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsText(file, "utf-8");
  });
}

function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode"));
      img.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round((img.width || 1) * scale));
        const h = Math.max(1, Math.round((img.height || 1) * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          try {
            resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.72), width: w, height: h });
            return;
          } catch (e) {}
        }
        resolve({ dataUrl: String(reader.result), width: w, height: h });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function clearAttachments() {
  state.attachments = [];
  const notice = $("attachNotice");
  if (notice) notice.hidden = true;
  renderAttachments();
}

function renderAttachments() {
  const list = $("attachList");
  if (!list) return;
  if (!state.attachments.length) {
    list.hidden = true;
    list.innerHTML = "";
    return;
  }
  list.hidden = false;
  list.innerHTML = state.attachments.map((a, index) => {
    const thumb = a.kind === "image"
      ? '<img class="attach-thumb" src="' + esc(a.dataUrl) + '" alt="معاينة ' + esc(a.name) + '" />'
      : '<span class="attach-doc">' + ICON_FILE + "</span>";
    const meta = a.kind === "image"
      ? "صورة مرفقة"
      : "ملف نصي • " + a.text.length + " حرفًا";
    return '<div class="attach-item">' +
        thumb +
        '<div class="attach-meta">' +
          '<p class="attach-name">' + esc(a.name) + "</p>" +
          '<p class="attach-kind">' + esc(meta) + "</p>" +
        "</div>" +
        '<button type="button" class="attach-remove" data-attach="' + index + '" aria-label="حذف المرفق ' + esc(a.name) + '">×</button>' +
      "</div>";
  }).join("");
}

async function addAttachments(files) {
  const notice = $("attachNotice");
  const say = (text) => {
    if (!notice) return;
    notice.textContent = text;
    notice.hidden = false;
  };
  if (notice) notice.hidden = true;

  for (const file of Array.from(files || [])) {
    if (state.attachments.length >= ATTACH_MAX) {
      say("يمكن إرفاق ملفين فقط مع السؤال الواحد — احذف أحد المرفقين أولًا.");
      break;
    }
    if (file.size > ATTACH_MAX_BYTES) {
      say("حجم «" + file.name + "» أكبر من 4 ميجابايت — جرّب ملفًا أصغر.");
      continue;
    }
    const isImage = /^image\//.test(file.type);
    const isText = /^text\//.test(file.type) || /\.(txt|md|csv)$/i.test(file.name);
    if (!isImage && !isText) {
      say("نوع «" + file.name + "» غير مدعوم. المسموح: صور (jpg / png / webp) أو ملفات txt / md / csv.");
      continue;
    }
    try {
      if (isImage) {
        const image = await shrinkImage(file);
        state.attachments.push({
          kind: "image",
          name: file.name,
          dataUrl: image.dataUrl,
          width: image.width,
          height: image.height
        });
      } else {
        const text = (await readFileAsText(file)).replace(/\r/g, "").trim();
        if (!text) {
          say("الملف «" + file.name + "» فارغ.");
          continue;
        }
        state.attachments.push({
          kind: "text",
          name: file.name,
          text: text.slice(0, ATTACH_TEXT_LIMIT)
        });
      }
    } catch (e) {
      say("تعذّر قراءة «" + file.name + "». جرّب ملفًا آخر.");
    }
  }

  renderAttachments();
}

function attachmentsHTML(attachments) {
  if (!attachments || !attachments.length) return "";
  const items = attachments.map((a) => {
    if (a.kind === "image") {
      return '<figure class="q-attach">' +
          '<img src="' + esc(a.dataUrl) + '" alt="مرفق: ' + esc(a.name) + '" loading="lazy" />' +
          '<figcaption>' + ICON_CLIP + esc(a.name) + "</figcaption>" +
        "</figure>";
    }
    const preview = a.text ? a.text.slice(0, 180) : (a.preview || "");
    return '<div class="q-attach q-attach-text">' +
        '<p class="q-attach-name">' + ICON_FILE + esc(a.name) + "</p>" +
        '<p class="q-attach-preview">' + esc(preview) + "…</p>" +
      "</div>";
  }).join("");
  return '<div class="q-attachments">' + items + "</div>";
}

/* ---------- ملفات المعلم / ولي الأمر ---------- */
const SOURCE_MAX_FILES = 5;
const SOURCE_MAX_BYTES = 2 * 1024 * 1024;
const SOURCE_STOPWORDS = [
  "هذا", "هذه", "ذلك", "تلك", "كيف", "ليش", "لماذا", "ماذا", "متى", "اين",
  "هل", "عن", "في", "من", "على", "الى", "هو", "هي", "ما", "لا", "مع", "ثم",
  "كل", "بعد", "قبل", "بين", "عند", "حول", "ايش", "وش", "اي", "او", "ان"
];

function sourcesKey() {
  return "skw_sources_" + (state.studentName || "زائر");
}

function getSources() {
  const list = readJSON(sourcesKey(), []);
  return Array.isArray(list) ? list : [];
}

function saveSources(list) {
  writeJSON(sourcesKey(), list);
}

function parseSourceText(text) {
  const notes = [];
  String(text || "").split(/\r?\n/).forEach((raw) => {
    let line = raw.trim().replace(/^[-*•]\s+/, "");
    if (!line) return;
    line = line.replace(/^#{1,6}\s*/, "").trim();
    if (line.length < 4) return;
    const parts = line.split("|").map((s) => s.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      notes.push({
        term: parts[0].slice(0, 80),
        def: parts[1].slice(0, 400),
        example: (parts[2] || "").slice(0, 240)
      });
    } else {
      notes.push({ term: "", def: line.slice(0, 400), example: "" });
    }
  });
  return notes.slice(0, 300);
}

function matchSources(text) {
  const words = normalize(text)
    .replace(/[\u060C\u061B\u061F\u06D4\u066A-\u066D]/g, " ")
    .split(/[^a-z0-9\u0600-\u06FF]+/)
    .filter((w) => w.length >= 3 && !SOURCE_STOPWORDS.includes(w));
  if (!words.length) return [];

  const unique = Array.from(new Set(words));
  const hits = [];
  for (const file of getSources()) {
    for (const note of file.notes || []) {
      const hay = normalize((note.term || "") + " " + (note.def || "") + " " + (note.example || ""));
      let score = 0;
      for (const w of unique) {
        if (hay.includes(w)) score += w.length >= 5 ? 2 : 1;
      }
      if (score > 0) hits.push({ file: file.name, note, score });
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 3);
}

function sourcesCardHTML(hits) {
  const list = hits.map((hit) => {
    const note = hit.note;
    return "<li>" +
        (note.term ? '<p class="source-note-term">' + esc(note.term) + "</p>" : "") +
        '<p class="source-note-def">' + esc(note.def) + "</p>" +
        (note.example ? '<p class="source-note-example">مثال: ' + esc(note.example) + "</p>" : "") +
        '<p class="source-note-from">من: ' + esc(hit.file) + "</p>" +
      "</li>";
  }).join("");
  return '<div class="source-card">' +
      '<h3 class="card-title">' + ICON_FILE + " من ملفات معلمك</h3>" +
      '<ul class="source-notes">' + list + "</ul>" +
    "</div>";
}

function renderSources() {
  const list = $("sourceList");
  const empty = $("sourceEmpty");
  const count = $("sourcesCount");
  if (!list) return;

  const sources = getSources();
  if (count) count.textContent = sources.length ? sources.length + " من " + SOURCE_MAX_FILES + " ملفات" : "";
  if (empty) empty.hidden = sources.length > 0;

  list.innerHTML = sources.map((file) => {
    const total = (file.notes || []).length;
    const countText = total === 1 ? "ملاحظة واحدة" : total === 2 ? "ملاحظتان" : total + " ملاحظات";
    return '<li class="source-item" data-source-id="' + esc(file.id) + '">' +
        '<div class="source-item-main">' +
          '<span class="source-item-icon">' + ICON_FILE + "</span>" +
          "<div>" +
            '<p class="source-name">' + esc(file.name) + "</p>" +
            '<p class="source-meta">' + esc(countText) + " • " + esc(timeAgo(file.addedAt)) + "</p>" +
          "</div>" +
        "</div>" +
        '<button type="button" class="btn-outline btn-sm source-remove">حذف</button>' +
      "</li>";
  }).join("");
}

async function handleSourceFiles(files) {
  const notice = $("sourceNotice");
  const error = $("sourceError");
  const ok = (text) => {
    if (notice) { notice.textContent = text; notice.hidden = false; }
    if (error) error.hidden = true;
  };
  const fail = (text) => {
    if (error) { error.textContent = text; error.hidden = false; }
    if (notice) notice.hidden = true;
  };

  const list = getSources();
  let added = 0;
  let skipped = 0;

  for (const file of Array.from(files || [])) {
    if (list.length >= SOURCE_MAX_FILES) { skipped++; continue; }
    if (!/\.(txt|md|csv)$/i.test(file.name) && !/^text\//.test(file.type)) { skipped++; continue; }
    if (file.size > SOURCE_MAX_BYTES) { skipped++; continue; }
    try {
      const notes = parseSourceText(await readFileAsText(file));
      if (!notes.length) { skipped++; continue; }
      list.push({
        id: "src_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        name: file.name,
        addedAt: Date.now(),
        notes
      });
      added++;
    } catch (e) {
      skipped++;
    }
  }

  saveSources(list);
  renderSources();

  if (added === 1) ok("أضفنا ملفًا واحدًا — ستظهر ملاحظاته داخل الشرح عندما يتعلق السؤال بها.");
  else if (added === 2) ok("أضفنا ملفين — ستظهر ملاحظاتهما داخل الشرح عندما يتعلق السؤال بها.");
  else if (added > 2) ok("أضفنا " + added + " ملفات — ستظهر ملاحظاتها داخل الشرح عندما يتعلق السؤال بها.");
  else fail(skipped
    ? "لم نتمكن من إضافة الملف. المسموح: txt / md / csv بحجم أقل من 2 ميجابايت، وبحد أقصى " + SOURCE_MAX_FILES + " ملفات."
    : "لم يُضف أي ملف.");
}

/* ---------- بناء الإجابة ---------- */
function buildAnswerData(subjectId, question) {
  const { subject, terms } = pickTerms(subjectId, question);
  if (!terms.length) {
    return {
      fallback: true,
      subjectId: subject.id,
      subjectName: subject.name,
      grade: state.grade,
      question,
      terms: [],
      bullets: [],
      example: "",
      suggestions: (SUGGESTIONS[subject.id] || []).slice(0, 3)
    };
  }

  const bullets = [];
  for (const t of terms) {
    const lines = sentences(t.simple).slice(0, 2);
    lines.forEach((s, index) => {
      if (terms.length > 1 && index === 0) {
        const body = s.startsWith(t.ar + " ") ? s.slice(t.ar.length + 1) : s;
        bullets.push(t.ar + ": " + body);
      } else {
        bullets.push(s);
      }
    });
    if (bullets.length >= 4) break;
  }

  const firstTerm = terms[0];
  const firstLine = sentences(firstTerm.simple)[0] || firstTerm.simple;
  const summaryLine = firstLine.startsWith(firstTerm.ar + " ")
    ? firstLine.slice(firstTerm.ar.length + 1)
    : firstLine;
  const intent = questionIntent(question);

  return {
    fallback: false,
    subjectId: subject.id,
    subjectName: subject.name,
    grade: state.grade,
    question,
    terms,
    lead: intentLead(intent),
    bullets: bullets.slice(0, 4),
    example: exampleText(terms[0]),
    summary: {
      term: firstTerm.ar,
      line: summaryLine,
      tip: intentTip(intent, terms[0], terms[1] || null)
    },
    suggestions: []
  };
}

function termCardHTML(t) {
  return `
    <article class="term-card" data-term-key="${esc(t.key)}">
      <div class="term-head">
        <h4 class="term-ar">${esc(t.ar)}</h4>
        <span class="term-en" dir="ltr">${esc(t.en)}</span>
      </div>
      <p class="term-simple">${esc(t.simple)}</p>
      <p class="term-example"><strong>مثال: </strong>${esc(exampleText(t))}</p>
      <div class="term-actions">
        <button type="button" class="btn-outline btn-sm explain-btn" aria-expanded="false">
          ${ICON_SPARKLES}
          <span>اشرح أبسط</span>
        </button>
        <span class="explain-ok" hidden>✓ صار أوضح</span>
      </div>
      <div class="term-easier" hidden>
        <p class="term-easier-label">شرح أبسط:</p>
        <p>${esc(t.easier)}</p>
      </div>
    </article>`;
}

function renderAnswer(data) {
  const area = $("answerArea");
  if (!area) return;
  const tint = tintFor(data.subjectId);
  const sourceHits = matchSources((data.searchText || "") + " " + data.question);
  const sourcesHtml = sourceHits.length ? sourcesCardHTML(sourceHits) : "";

  let html =
    '<div class="question-card">' +
      '<div class="q-meta">' +
        '<span class="subject-badge ' + tint + '">' + esc(data.subjectName) + "</span>" +
        '<span class="grade-badge">الصف ' + esc(data.grade) + "</span>" +
      "</div>" +
      '<p class="question-text">' + esc(data.question) + "</p>" +
      attachmentsHTML(data.attachments) +
    "</div>";

  if (data.fallback) {
    const chips = data.suggestions
      .map((s) => '<button type="button" class="example-chip" data-suggestion="' + esc(s) + '">' + esc(s) + "</button>")
      .join("");
    html +=
      '<div class="answer-card">' +
        '<h3 class="card-title">' + ICON_SPARKLES + " خلنا نفكر معك</h3>" +
        '<p class="fallback-text">سؤالك جميل ومفيد! لم أجد مصطلحًا محددًا في ' + esc(data.subjectName) +
          "، لكن جرّب أن تسأل عن أحد المفاهيم التالية وسأشرحه لك بجمل قصيرة ومثال من حياتك.</p>" +
        '<div class="suggestion-row">' + chips + "</div>" +
      "</div>";
    if (sourcesHtml) html += sourcesHtml;
  } else {
    const list = data.bullets
      .map((b) => '<li><span class="dot ' + tint + '"></span><span>' + esc(b) + "</span></li>")
      .join("");

    html +=
      '<div class="answer-card">' +
        '<h3 class="card-title">' + ICON_BOOK + " الشرح بمستوى صفك</h3>" +
        (data.lead ? '<p class="explain-lead">' + esc(data.lead) + "</p>" : "") +
        '<ul class="explain-list">' + list + "</ul>" +
      "</div>";

    if (data.example) {
      html +=
        '<div class="example-card">' +
          '<h3 class="card-title">' + ICON_GLOBE + " مثال من حياتك اليومية</h3>" +
          "<p>" + esc(data.example) + "</p>" +
        "</div>";
    }

    if (data.summary) {
      html +=
        '<div class="summary-card">' +
          '<h3 class="card-title">' + ICON_SPARKLES + " خلاصة سريعة</h3>" +
          '<p class="summary-line"><strong>«' + esc(data.summary.term) + '»:</strong> ' + esc(data.summary.line) + "</p>" +
          '<p class="summary-tip">' + esc(data.summary.tip) + "</p>" +
        "</div>";
    }

    if (sourcesHtml) html += sourcesHtml;

    if (data.terms.length) {
      html +=
        '<div class="terms-section">' +
          '<h3 class="section-title">' + ICON_LAYERS + " مصطلحات مهمة</h3>" +
          '<div class="terms-grid">' + data.terms.map(termCardHTML).join("") + "</div>" +
        "</div>";

      html += quizHTML(buildQuiz(data.terms, data.subjectId));
    }
  }

  area.innerHTML = html;
  area.hidden = false;
}

function renderLoading() {
  const area = $("answerArea");
  if (!area) return;
  area.innerHTML =
    '<div class="skeleton">' +
      '<div class="skeleton-head"><span class="spinner"></span><span>أقرأ سؤالك وأجهّز الشرح…</span></div>' +
      '<div class="skeleton-lines">' +
        '<div class="skeleton-line w-80"></div>' +
        '<div class="skeleton-line w-60"></div>' +
        '<div class="skeleton-line w-67"></div>' +
      "</div>" +
    "</div>" +
    '<div class="skeleton-cards">' +
      '<div class="skeleton-card"></div>' +
      '<div class="skeleton-card"></div>' +
    "</div>";
  area.hidden = false;
}

function saveLastAnswer(data) {
  try {
    localStorage.setItem(lastAnswerKey(), JSON.stringify({
      subjectId: data.subjectId,
      grade: data.grade,
      question: data.question,
      hint: (data.searchText || data.question || "").slice(0, 600)
    }));
  } catch (e) {}
}

function restoreLastAnswer() {
  const area = $("answerArea");
  if (!area) return;
  area.hidden = true;
  area.innerHTML = "";
  let last = null;
  try {
    const raw = localStorage.getItem(lastAnswerKey());
    last = raw ? JSON.parse(raw) : null;
  } catch (e) {
    last = null;
  }
  if (!last || !last.question || !SUBJECTS[last.subjectId]) return;

  const previousGrade = state.grade;
  state.grade = String(last.grade || previousGrade);
  const data = buildAnswerData(last.subjectId, last.hint || last.question);
  data.question = last.question;
  data.grade = state.grade;
  data.searchText = last.hint || last.question;
  state.grade = previousGrade;
  renderAnswer(data);
}

/* ---------- نقاط ضعفي ---------- */
function recordWeak(t) {
  const list = getWeakList();
  const found = list.find((x) => x.termKey === t.key);
  if (found) {
    found.count = (Number(found.count) || 0) + 1;
    found.subjectId = state.subjectId;
  } else {
    list.push({
      subjectId: state.subjectId,
      grade: state.grade,
      termKey: t.key,
      label: t.ar + " (" + t.en + ")",
      count: 1
    });
  }
  saveWeakList(list);
  renderWeak();
}

function renderFilters() {
  const wrap = $("weakFilters");
  if (!wrap) return;
  wrap.innerHTML = "";

  const makeChip = (value, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-chip";
    btn.dataset.filter = value;
    btn.textContent = label;
    btn.setAttribute("aria-pressed", "false");
    wrap.appendChild(btn);
  };

  makeChip("all", "كل المواد");
  for (const id of SUBJECT_ORDER) makeChip(id, SUBJECTS[id].name);
}

function renderWeak() {
  const listEl = $("weakList");
  const emptyEl = $("weakEmpty");
  const clearBtn = $("clearWeak");
  if (!listEl || !emptyEl) return;

  document.querySelectorAll("#weakFilters .filter-chip").forEach((chip) => {
    const active = chip.dataset.filter === state.weakFilter;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", active ? "true" : "false");
  });

  const all = getWeakList()
    .map((entry) => {
      const term = findTerm(entry.termKey);
      const fallbackSubject = String(entry.termKey || "").split("::")[0];
      return {
        entry,
        term,
        subjectId: entry.subjectId || fallbackSubject
      };
    })
    .filter((x) => state.weakFilter === "all" || x.subjectId === state.weakFilter)
    .sort((a, b) => (Number(b.entry.count) || 0) - (Number(a.entry.count) || 0));

  if (!all.length) {
    listEl.hidden = true;
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    const title = $("weakEmptyTitle");
    if (title) {
      title.textContent = state.weakFilter === "all"
        ? "قائمتك فارغة حتى الآن"
        : "لا توجد مصطلحات في هذه المادة بعد";
    }
    if (clearBtn) clearBtn.hidden = true;
    return;
  }

  emptyEl.hidden = true;
  listEl.hidden = false;
  if (clearBtn) clearBtn.hidden = false;
  listEl.innerHTML = "";

  all.forEach(({ entry, term, subjectId }, index) => {
    const li = document.createElement("li");
    li.className = "weak-item";

    const name = term ? term.ar : String(entry.label || "مصطلح").replace(/\s*\(.*\)\s*$/, "");
    const english = term ? term.en : "";
    const definition = term ? term.simple : "لا يتوفر شرح لهذا المصطلح حاليًا.";
    const example = term ? exampleText(term) : "";
    const easier = term ? term.easier : "";
    const subject = subjectName(subjectId);

    li.innerHTML =
      '<button type="button" class="weak-toggle" aria-expanded="false">' +
        '<span class="weak-index">' + (index + 1) + "</span>" +
        '<span class="weak-main">' +
          '<span class="weak-name-row">' +
            '<span class="weak-name">' + esc(name) + "</span>" +
            (english ? '<span class="weak-en" dir="ltr">' + esc(english) + "</span>" : "") +
          "</span>" +
          '<span class="weak-meta">' +
            (subject ? '<span class="subject-badge ' + tintFor(subjectId) + '">' + esc(subject) + "</span>" : "") +
            '<span class="weak-count">' + formatAsked(entry.count) + "</span>" +
          "</span>" +
        "</span>" +
        ICON_CHEVRON +
      "</button>" +
      '<div class="weak-body" hidden>' +
        '<p class="weak-def">' + esc(definition) + "</p>" +
        (example
          ? '<p class="weak-example"><strong>مثال: </strong>' + esc(example) + "</p>"
          : "") +
        (easier
          ? '<div class="weak-actions">' +
              '<button type="button" class="btn-outline btn-sm explain-btn" aria-expanded="false">' +
                ICON_SPARKLES + "<span>اشرح أبسط</span>" +
              "</button>" +
              '<span class="explain-ok" hidden>✓ صار أوضح</span>' +
            "</div>" +
            '<div class="term-easier" hidden>' +
              '<p class="term-easier-label">شرح أبسط:</p>' +
              "<p>" + esc(easier) + "</p>" +
            "</div>"
          : "") +
      "</div>";

    listEl.appendChild(li);
  });
}

function toggleTermExplain(btn) {
  const host = btn.closest(".term-card") || btn.closest(".weak-body");
  if (!host) return;
  const easier = host.querySelector(".term-easier");
  const ok = host.querySelector(".explain-ok");
  if (!easier) return;
  const open = !easier.hasAttribute("hidden");
  if (open) {
    easier.setAttribute("hidden", "");
    if (ok) ok.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  } else {
    easier.removeAttribute("hidden");
    if (ok) ok.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }
}

/* ---------- اختبار سريع ---------- */
function handleQuizOption(btn) {
  const item = btn.closest(".quiz-item");
  const quiz = btn.closest("[data-quiz]");
  if (!item || !quiz || item.dataset.done === "true") return;

  const answer = Number(item.dataset.answer);
  const chosen = Number(btn.dataset.index);
  const isCorrect = chosen === answer;

  item.dataset.done = "true";
  item.dataset.chosen = String(chosen);

  item.querySelectorAll(".quiz-option").forEach((option) => {
    option.disabled = true;
    const index = Number(option.dataset.index);
    if (index === answer) option.classList.add("is-correct");
    else if (index === chosen) option.classList.add("is-wrong");
    else option.classList.add("is-muted");
  });

  const feedback = item.querySelector(".quiz-feedback");
  if (feedback) {
    feedback.classList.add(isCorrect ? "ok" : "bad");
    feedback.innerHTML = "<strong>" + (isCorrect ? "إجابة صحيحة! " : "الإجابة الصحيحة: ") + "</strong>" + esc(item.dataset.why || "");
    feedback.hidden = false;
  }

  const total = Number(quiz.dataset.total) || 0;
  const answered = (Number(quiz.dataset.answered) || 0) + 1;
  quiz.dataset.answered = String(answered);

  const progress = quiz.querySelector(".quiz-progress");
  if (progress) progress.textContent = answered + " من " + total;

  if (answered < total) return;

  let correct = 0;
  quiz.querySelectorAll(".quiz-item").forEach((entry) => {
    if (entry.dataset.chosen === entry.dataset.answer) correct += 1;
  });

  const score = quiz.querySelector(".quiz-score");
  if (score) {
    score.textContent = "نتيجتك: " + correct + " من " + total;
    score.hidden = false;
  }

  if (quiz.dataset.logged !== "true") {
    quiz.dataset.logged = "true";
    logQuiz(total, correct);
  }
}

/* ---------- تقدّمي ---------- */
function renderProgress() {
  const history = getHistory();
  const logs = getQuizLog();
  const totalCorrect = logs.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
  const totalAnswered = logs.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const overall = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

  const weekStart = startOfWeek(Date.now());
  const lastWeekStart = weekStart - 7 * 24 * 60 * 60 * 1000;
  const thisWeekQuestions = history.filter((item) => Number(item.ts) >= weekStart).length;
  const thisWeekLogs = logs.filter((item) => Number(item.ts) >= weekStart);
  const lastWeekLogs = logs.filter((item) => {
    const ts = Number(item.ts);
    return ts >= lastWeekStart && ts < weekStart;
  });

  const statQuestions = $("statQuestions");
  const statAccuracy = $("statAccuracy");
  const statWeek = $("statWeek");
  if (statQuestions) statQuestions.textContent = String(history.length);
  if (statAccuracy) statAccuracy.textContent = overall === null ? "—" : overall + "%";
  if (statWeek) statWeek.textContent = String(thisWeekQuestions);

  const trend = $("progressTrend");
  if (trend) {
    const thisWeekAccuracy = accuracyOf(thisWeekLogs);
    const lastWeekAccuracy = accuracyOf(lastWeekLogs);
    let tone = "";
    let text = "";
    if (thisWeekAccuracy === null || lastWeekAccuracy === null) {
      text = "أجب عن أسئلة التدريب هذا الأسبوع لنقارن تقدمك بالأسبوع الماضي.";
    } else {
      const diff = thisWeekAccuracy - lastWeekAccuracy;
      if (diff > 0) {
        tone = "up";
        text = "دقتك أعلى من الأسبوع الماضي بـ " + pointsText(diff) + ". أحسنت!";
      } else if (diff === 0) {
        text = "دقتك مثل الأسبوع الماضي، واصل التدريب.";
      } else {
        tone = "down";
        text = "دقتك أقل من الأسبوع الماضي بـ " + pointsText(diff) + ". راجع نقاط ضعفك.";
      }
    }
    trend.className = "progress-trend" + (tone ? " " + tone : "");
    trend.textContent = text;
  }

  const list = $("progressHistory");
  const empty = $("progressEmpty");
  if (!list || !empty) return;
  list.innerHTML = "";

  if (!history.length) {
    list.hidden = true;
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  list.hidden = false;

  history.slice().reverse().slice(0, 8).forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";
    const attachCount = Array.isArray(item.attachments) ? item.attachments.length : 0;
    li.innerHTML =
      '<div class="history-meta">' +
        '<span class="subject-badge ' + tintFor(item.subjectId) + '">' + esc(subjectName(item.subjectId)) + "</span>" +
        "<span>الصف " + esc(item.grade) + "</span>" +
        "<span>" + esc(timeAgo(item.ts)) + "</span>" +
        (attachCount ? '<span class="history-attach">' + ICON_CLIP + (attachCount === 1 ? "مرفق واحد" : attachCount + " مرفقات") + "</span>" : "") +
      "</div>" +
      '<p class="history-question">' + esc(item.question) + "</p>";
    list.appendChild(li);
  });
}

/* ---------- السجل الكامل وحفظ البيانات ---------- */
const BACKUP_APP = "SmartKidsWorld";
const BACKUP_VERSION = 1;
const STORE_PREFIXES = [
  "skw_weak_",
  "skw_history_",
  "skw_quizlog_",
  "skw_parent_email_",
  "skw_last_",
  "skw_sources_"
];
const STORAGE_QUOTA = 5 * 1024 * 1024;

function storeSuffix(key) {
  for (const prefix of STORE_PREFIXES) {
    if (key.indexOf(prefix) === 0) return { prefix: prefix, name: key.slice(prefix.length) };
  }
  return null;
}

function safeWriteJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function historyDate(ts) {
  const date = new Date(Number(ts) || Date.now());
  const day = date.toLocaleDateString("ar", { day: "numeric", month: "long", year: "numeric" });
  const time = date.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
  return day + " • " + time;
}

function renderHistoryFilters(all) {
  const wrap = $("historyFilters");
  if (!wrap) return;
  const present = SUBJECT_ORDER.filter((id) => all.some((item) => item && item.subjectId === id));
  if (!present.length) {
    wrap.innerHTML = "";
    wrap.hidden = true;
    state.historyFilter = "all";
    return;
  }
  wrap.hidden = false;
  if (state.historyFilter !== "all" && present.indexOf(state.historyFilter) === -1) {
    state.historyFilter = "all";
  }
  wrap.innerHTML = "";
  const makeChip = (value, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-chip";
    btn.dataset.historyFilter = value;
    btn.textContent = label;
    const active = state.historyFilter === value;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    wrap.appendChild(btn);
  };
  makeChip("all", "كل المواد");
  present.forEach((id) => makeChip(id, SUBJECTS[id].name));
}

function filteredHistory() {
  const all = getHistory();
  const query = normalize(state.historyQuery).trim();
  const entries = [];
  all.forEach((item, index) => {
    if (!item) return;
    if (state.historyFilter !== "all" && item.subjectId !== state.historyFilter) return;
    if (query) {
      const hay = normalize((item.question || "") + " " + (item.hint || "") + " " + subjectName(item.subjectId));
      if (!hay.includes(query)) return;
    }
    entries.push({ item: item, index: index });
  });
  entries.sort((a, b) => (Number(b.item.ts) || 0) - (Number(a.item.ts) || 0));
  return entries;
}

function renderHistory() {
  const listEl = $("historyFull");
  const emptyEl = $("historyEmpty");
  if (!listEl || !emptyEl) return;

  const all = getHistory();
  const entries = filteredHistory();

  renderHistoryFilters(all);

  const countEl = $("historyCount");
  if (countEl) {
    if (!all.length) countEl.textContent = "";
    else if (!entries.length) countEl.textContent = "لا يوجد سؤال مطابق — جرّب كلمة أخرى.";
    else if (entries.length === all.length) countEl.textContent = "محفوظ على هذا الجهاز: " + questionsText(all.length);
    else countEl.textContent = "المعروض: " + questionsText(entries.length) + " من أصل " + questionsText(all.length);
  }

  const titleEl = $("historyEmptyTitle");
  const textEl = $("historyEmptyText");
  const cta = $("historyEmptyCta");

  if (!entries.length) {
    listEl.hidden = true;
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    if (!all.length) {
      if (titleEl) titleEl.textContent = "سجلك فارغ حتى الآن";
      if (textEl) textEl.textContent = "ابدأ بسؤالك الأول، وسيُحفظ هنا لتتمكن من الرجوع إليه في أي وقت.";
      if (cta) cta.hidden = false;
    } else {
      if (titleEl) titleEl.textContent = "لا يوجد سؤال مطابق";
      if (textEl) textEl.textContent = "جرّب كلمة بحث أخرى أو اختر مادة مختلفة من الأزرار بالأعلى.";
      if (cta) cta.hidden = true;
    }
    renderStorage();
    return;
  }

  emptyEl.hidden = true;
  listEl.hidden = false;
  listEl.innerHTML = entries.map((row) => {
    const item = row.item;
    const attachCount = Array.isArray(item.attachments) ? item.attachments.length : 0;
    const hint = String(item.hint || "").trim();
    const showHint = hint && hint !== String(item.question || "").trim();
    return '<li class="history-row">' +
        '<div class="history-meta">' +
          '<span class="subject-badge ' + tintFor(item.subjectId) + '">' + esc(subjectName(item.subjectId)) + "</span>" +
          "<span>الصف " + esc(item.grade || "") + "</span>" +
          "<span>" + esc(historyDate(item.ts)) + "</span>" +
          (attachCount
            ? '<span class="history-attach">' + ICON_CLIP + (attachCount === 1 ? "مرفق واحد" : attachCount + " مرفقات") + "</span>"
            : "") +
        "</div>" +
        '<p class="history-question">' + esc(item.question || "") + "</p>" +
        (showHint ? '<p class="history-hint">' + esc(shortText(hint, 140)) + "</p>" : "") +
        '<div class="history-row-actions">' +
          '<button type="button" class="btn-outline btn-sm" data-open-history="' + row.index + '">أعد فتح الشرح</button>' +
          '<button type="button" class="btn-outline btn-sm btn-danger" data-delete-history="' + row.index + '">حذف</button>' +
        "</div>" +
      "</li>";
  }).join("");

  renderStorage();
}

function openHistoryEntry(index) {
  const item = getHistory()[index];
  if (!item) return;

  if (SUBJECTS[item.subjectId]) {
    state.subjectId = item.subjectId;
    try { localStorage.setItem("skw_subject", state.subjectId); } catch (e) {}
  }
  if (item.grade) {
    state.grade = String(item.grade);
    try { localStorage.setItem("skw_grade", state.grade); } catch (e) {}
  }
  applyGradeUI();
  applySubjectUI();
  renderExamples();

  const text = item.hint || item.question || "";
  const data = buildAnswerData(state.subjectId, text);
  data.question = item.question || text;
  data.grade = state.grade;
  data.searchText = text;
  data.attachments = (Array.isArray(item.attachments) ? item.attachments : []).map((a) => {
    if (a && a.kind === "image" && a.dataUrl) {
      return { kind: "image", name: a.name || "صورة", dataUrl: a.dataUrl };
    }
    return { kind: "text", name: (a && a.name) || "ملف", text: (a && (a.text || a.preview)) || "" };
  });

  renderAnswer(data);
  showView("ask");
  window.setTimeout(() => {
    const area = $("answerArea");
    if (area) area.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 60);
}

function setHistoryMessage(okText, errorText) {
  const notice = $("historyNotice");
  const error = $("historyError");
  if (notice) {
    notice.textContent = okText || "";
    notice.hidden = !okText;
  }
  if (error) {
    error.textContent = errorText || "";
    error.hidden = !errorText;
  }
}

function deleteHistoryEntry(index) {
  const list = getHistory();
  const item = list[index];
  if (!item) return;
  list.splice(index, 1);
  safeWriteJSON(historyKey(), list);
  renderHistory();
  renderProgress();
  setHistoryMessage("حذفنا «" + shortText(item.question || "", 60) + "» من السجل.", "");
}

function clearHistory() {
  if (!getHistory().length) {
    setHistoryMessage("السجل فارغ أصلًا — لا يوجد ما يُحذف.", "");
    return;
  }
  const sure = window.confirm("سيُحذف سجل الأسئلة بالكامل من هذا الجهاز، ولا يمكن التراجع. هل تريد المتابعة؟");
  if (!sure) return;
  try { localStorage.removeItem(historyKey()); } catch (e) {}
  try { localStorage.removeItem(lastAnswerKey()); } catch (e) {}
  state.historyQuery = "";
  state.historyFilter = "all";
  const search = $("historySearch");
  if (search) search.value = "";
  resetAnswer();
  renderHistory();
  renderProgress();
  setHistoryMessage("حذفنا سجل الأسئلة من هذا الجهاز. يمكنك البدء من جديد في أي وقت.", "");
}

function exportBackup() {
  const me = state.studentName || "زائر";
  const data = {};
  let count = 0;
  for (const prefix of STORE_PREFIXES) {
    const key = prefix + me;
    let raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { raw = null; }
    if (raw != null) {
      data[key] = raw;
      count += 1;
    }
  }

  if (!count) {
    setHistoryMessage("", "لا توجد بيانات محفوظة بعد — اسأل سؤالًا واحدًا على الأقل ثم جرّب النسخة الاحتياطية.");
    return;
  }

  const payload = {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    student: me,
    data: data
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date();
  const stamp = date.getFullYear() + "-" +
    String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");

  const link = document.createElement("a");
  link.href = url;
  link.download = "SmartKidsWorld-backup-" + stamp + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 3000);

  setHistoryMessage(
    "نزّلنا نسخة احتياطية فيها " + questionsText(getHistory().length) + " و" +
      pointsText(getWeakList().length) + " — احفظ الملف في مكان آمن.",
    ""
  );
}

function mergeHistoryLists(current, incoming) {
  const seen = new Set();
  const out = [];
  current.concat(incoming).forEach((item) => {
    if (!item || typeof item !== "object") return;
    const key = String(item.ts || "") + "|" + String(item.question || "");
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });
  out.sort((a, b) => (Number(a.ts) || 0) - (Number(b.ts) || 0));
  if (out.length > 200) out.splice(0, out.length - 200);
  return out;
}

function mergeWeakLists(current, incoming) {
  const map = new Map();
  current.concat(incoming).forEach((item) => {
    if (!item || !item.termKey) return;
    const found = map.get(item.termKey);
    if (!found) {
      map.set(item.termKey, Object.assign({}, item));
    } else {
      found.count = Math.max(Number(found.count) || 0, Number(item.count) || 0);
      found.subjectId = found.subjectId || item.subjectId;
      found.label = found.label || item.label;
    }
  });
  return Array.from(map.values()).sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
}

function mergeQuizLogs(current, incoming) {
  const seen = new Set();
  const out = [];
  current.concat(incoming).forEach((item) => {
    if (!item) return;
    const entry = {
      ts: Number(item.ts) || 0,
      total: Number(item.total) || 0,
      correct: Number(item.correct) || 0
    };
    const key = entry.ts + "|" + entry.total + "|" + entry.correct;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(entry);
  });
  out.sort((a, b) => a.ts - b.ts);
  if (out.length > 300) out.splice(0, out.length - 300);
  return out;
}

function mergeSources(current, incoming) {
  const out = current.slice();
  const seen = new Set();
  out.forEach((file) => { if (file && file.id) seen.add(file.id); });
  for (const file of incoming) {
    if (!file || !Array.isArray(file.notes)) continue;
    const key = file.id || (file.name + "|" + file.addedAt);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(file);
    if (out.length >= SOURCE_MAX_FILES) break;
  }
  return out;
}

async function importBackup(file) {
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    setHistoryMessage("", "حجم الملف أكبر من 8 ميجابايت — تأكد أنك اخترت ملف النسخة الاحتياطية الصحيح.");
    return;
  }

  let payload = null;
  try {
    payload = JSON.parse(await readFileAsText(file));
  } catch (e) {
    payload = null;
  }
  if (!payload || payload.app !== BACKUP_APP || !payload.data || typeof payload.data !== "object") {
    setHistoryMessage("", "هذا الملف ليس نسخة احتياطية من «عالم الصغار الذكي».");
    return;
  }

  const me = state.studentName || "زائر";
  const counts = { history: 0, weak: 0, quiz: 0, sources: 0 };
  let failed = false;

  for (const key of Object.keys(payload.data)) {
    const suffix = storeSuffix(key);
    if (!suffix) continue;

    let incoming;
    try {
      incoming = typeof payload.data[key] === "string" ? JSON.parse(payload.data[key]) : payload.data[key];
    } catch (e) {
      continue;
    }

    const target = suffix.prefix + me;

    if (suffix.prefix === "skw_history_") {
      const before = getHistory().length;
      const merged = mergeHistoryLists(getHistory(), Array.isArray(incoming) ? incoming : []);
      if (merged.length !== before || (before === 0 && merged.length)) {
        if (safeWriteJSON(target, merged)) counts.history += Math.max(0, merged.length - before);
        else failed = true;
      }
    } else if (suffix.prefix === "skw_weak_") {
      const before = getWeakList().length;
      const merged = mergeWeakLists(getWeakList(), Array.isArray(incoming) ? incoming : []);
      if (!safeWriteJSON(target, merged)) failed = true;
      else counts.weak += Math.max(0, merged.length - before);
    } else if (suffix.prefix === "skw_quizlog_") {
      const before = getQuizLog().length;
      const merged = mergeQuizLogs(getQuizLog(), Array.isArray(incoming) ? incoming : []);
      if (!safeWriteJSON(target, merged)) failed = true;
      else counts.quiz += Math.max(0, merged.length - before);
    } else if (suffix.prefix === "skw_sources_") {
      const before = getSources().length;
      const merged = mergeSources(getSources(), Array.isArray(incoming) ? incoming : []);
      if (!safeWriteJSON(target, merged)) failed = true;
      else counts.sources += Math.max(0, merged.length - before);
    } else if (suffix.prefix === "skw_parent_email_") {
      if (!String(parentEmail()).trim() && typeof incoming === "string" && incoming) {
        if (!safeWriteJSON(target, incoming)) failed = true;
      }
    } else if (suffix.prefix === "skw_last_") {
      const current = readJSON(target, null);
      if (!current && incoming && incoming.question) {
        if (!safeWriteJSON(target, incoming)) failed = true;
      }
    }
  }

  renderHistory();
  renderProgress();

  const added = counts.history + counts.weak + counts.quiz + counts.sources;
  if (failed) {
    setHistoryMessage("", "لم تكفِ مساحة التخزين لاستعادة كل البيانات. احذف بعض الصور المرفقة ثم أعد المحاولة.");
    return;
  }
  if (!added) {
    setHistoryMessage("النسخة مطابقة لما لديك — لم نضف بيانات جديدة. سجلك سليم.", "");
    return;
  }

  const parts = [];
  if (counts.history) parts.push(questionsText(counts.history));
  if (counts.weak) parts.push(pointsText(counts.weak) + " في نقاط الضعف");
  if (counts.quiz) parts.push(counts.quiz + " نتيجة اختبار");
  if (counts.sources) parts.push(counts.sources + " ملف معلم");
  setHistoryMessage("استعدنا " + parts.join(" و") + " إلى حساب «" + me + "» على هذا الجهاز.", "");
}

function storageBytes() {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || key.indexOf("skw_") !== 0) continue;
      total += (key.length + (localStorage.getItem(key) || "").length) * 2;
    }
  } catch (e) {}
  return total;
}

function readableSize(bytes) {
  if (bytes < 1024) return bytes + " بايت";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " كيلوبايت";
  return (bytes / (1024 * 1024)).toFixed(2) + " ميجابايت";
}

function renderStorage() {
  const fill = $("storageFill");
  const text = $("storageText");
  const list = $("storageList");
  if (!fill || !text || !list) return;

  const bytes = storageBytes();
  const percent = Math.min(100, (bytes / STORAGE_QUOTA) * 100);
  fill.style.width = (bytes ? Math.max(percent, 1.2) : 0) + "%";
  fill.className = percent >= 90 ? "danger" : percent >= 70 ? "warn" : "";

  const shown = percent >= 1 ? Math.round(percent) : percent.toFixed(1);
  text.textContent = bytes
    ? "المستخدم على هذا المتصفح: " + readableSize(bytes) + " من أصل 5 ميجابايت تقريبًا (" +
      (percent > 0 && percent < 0.1 ? "أقل من 0.1" : shown) + "%)."
    : "لا توجد بيانات محفوظة بعد.";

  const history = getHistory();
  const weak = getWeakList();
  const quiz = getQuizLog();
  const sources = getSources();
  const imageCount = history.reduce((sum, item) => {
    const list = Array.isArray(item.attachments) ? item.attachments : [];
    return sum + list.filter((a) => a && a.kind === "image").length;
  }, 0);

  const rows = [
    ["الأسئلة المحفوظة", questionsText(history.length)],
    ["الصور المرفقة", imageCount ? imageCount + " صورة" : "لا شيء"],
    ["مصطلحات نقاط الضعف", pointsText(weak.length)],
    ["نتائج الاختبارات", quiz.length ? quiz.length + " نتيجة" : "لا شيء"],
    ["ملفات المعلم", sources.length ? sources.length + " من " + SOURCE_MAX_FILES : "لا شيء"]
  ];

  list.innerHTML = rows.map((row) =>
    "<li><span>" + esc(row[0]) + "</span><strong>" + esc(row[1]) + "</strong></li>"
  ).join("");
}

/* ---------- تقرير ولي الأمر ---------- */
function parentEmail() {
  const saved = readJSON(parentEmailKey(), "");
  return typeof saved === "string" ? saved : "";
}

function buildReport() {
  const history = getHistory();
  const logs = getQuizLog();
  const weak = getWeakList().slice().sort((a, b) => (Number(b.count) || 0) - (Number(a.count) || 0));
  const overall = accuracyOf(logs);
  const counts = {};
  history.forEach((item) => {
    if (!item.subjectId) return;
    counts[item.subjectId] = (counts[item.subjectId] || 0) + 1;
  });
  const topSubject = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || "";
  const weakNames = weak.slice(0, 3).map((entry) => {
    const term = findTerm(entry.termKey);
    return (term ? term.ar : String(entry.label || "").replace(/\s*\(.*\)\s*$/, "")) +
      " (" + timesText(entry.count) + ")";
  });

  return {
    name: state.studentName || "الطالب",
    questions: history.length,
    overall: overall,
    weakCount: weak.length,
    topSubject: topSubject ? subjectName(topSubject) : "",
    topSubjectCount: topSubject ? counts[topSubject] : 0,
    weakNames: weakNames
  };
}

function reportHTML(report) {
  const dateText = new Date().toLocaleDateString("ar", { day: "numeric", month: "long", year: "numeric" });
  const lines = [];
  if (report.topSubject) {
    lines.push("أكثر مادة سأل عنها: " + report.topSubject + " (" + questionsText(report.topSubjectCount) + ").");
  }
  if (report.weakNames.length) {
    lines.push("أكثر المصطلحات تكرارًا: " + report.weakNames.join("، ") + ".");
  } else {
    lines.push("لم تُسجَّل نقاط ضعف بعد.");
  }
  if (report.overall === null) {
    lines.push("لم يجب عن أسئلة التدريب بعد.");
  } else if (report.overall >= 80) {
    lines.push("دقة التدريب " + report.overall + "% — مستوى ممتاز، واصل!");
  } else if (report.overall >= 60) {
    lines.push("دقة التدريب " + report.overall + "% — جيد، ويحتاج مراجعة بسيطة.");
  } else {
    lines.push("دقة التدريب " + report.overall + "% — يحتاج مراجعة لنقاط الضعف.");
  }

  return '<p class="parent-report-title">ملخص أداء ' + esc(report.name) + "</p>" +
    '<p class="parent-report-sub">تقرير بتاريخ ' + esc(dateText) + "</p>" +
    '<div class="report-grid">' +
      '<div class="report-stat"><strong>' + report.questions + "</strong><span>سؤالًا سأله</span></div>" +
      '<div class="report-stat"><strong>' + (report.overall === null ? "—" : report.overall + "%") + "</strong><span>دقة التدريب</span></div>" +
      '<div class="report-stat"><strong>' + report.weakCount + "</strong><span>نقطة تحتاج مراجعة</span></div>" +
    "</div>" +
    '<ul class="report-list">' + lines.map((line) => "<li>" + esc(line) + "</li>").join("") + "</ul>";
}

function renderParent() {
  const input = $("parentEmail");
  if (input) input.value = parentEmail();
  renderSources();
  const wrap = $("parentReport");
  if (!wrap) return;
  wrap.innerHTML = reportHTML(buildReport());
}

function buildReportText() {
  const report = buildReport();
  const dateText = new Date().toLocaleDateString("ar", { day: "numeric", month: "long", year: "numeric" });
  const lines = ["تقرير عالم الصغار الذكي — " + dateText, "الطالب: " + report.name, ""];
  lines.push("عدد الأسئلة: " + report.questions);
  lines.push("دقة التدريب: " + (report.overall === null ? "لم يتدرب بعد" : report.overall + "%"));
  lines.push("نقاط تحتاج مراجعة: " + report.weakCount);
  if (report.topSubject) {
    lines.push("أكثر مادة سأل عنها: " + report.topSubject + " (" + questionsText(report.topSubjectCount) + ")");
  }
  if (report.weakNames.length) lines.push("أكثر المصطلحات تكرارًا: " + report.weakNames.join("، "));
  return lines.join("\n");
}

function handleParentSave(event) {
  event.preventDefault();
  const input = $("parentEmail");
  const notice = $("parentNotice");
  const error = $("parentError");
  const email = input ? input.value.trim() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    if (error) {
      error.textContent = "اكتب بريدًا إلكترونيًا صحيحًا.";
      error.hidden = false;
    }
    if (notice) notice.hidden = true;
    return;
  }

  writeJSON(parentEmailKey(), email);
  if (error) error.hidden = true;
  if (notice) {
    notice.textContent = "حفظنا بريد ولي الأمر على هذا الجهاز، ويمكنك إرسال التقرير الآن.";
    notice.hidden = false;
  }
}

function handleSendReport() {
  const notice = $("parentNotice");
  const error = $("parentError");
  const email = parentEmail();

  if (!email) {
    if (error) {
      error.textContent = "احفظ بريد ولي الأمر أولًا ثم أرسل التقرير.";
      error.hidden = false;
    }
    if (notice) notice.hidden = true;
    return;
  }

  if (error) error.hidden = true;
  const subject = encodeURIComponent("تقرير عالم الصغار الذكي");
  const body = encodeURIComponent(buildReportText());
  window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
  if (notice) {
    notice.textContent = "فتحنا تطبيق البريد على جهازك لإرسال التقرير إلى " + email + ".";
    notice.hidden = false;
  }
}
function showView(view) {
  const loginView = $("loginView");
  const askView = $("askView");
  const weakView = $("weakView");
  const progressView = $("progressView");
  const historyView = $("historyView");
  const parentView = $("parentView");
  const header = $("appHeader");
  if (loginView) loginView.hidden = view !== "login";
  if (askView) askView.hidden = view !== "ask";
  if (weakView) weakView.hidden = view !== "weak";
  if (progressView) progressView.hidden = view !== "progress";
  if (historyView) historyView.hidden = view !== "history";
  if (parentView) parentView.hidden = view !== "parent";
  if (header) header.hidden = view === "login";

  state.view = view;

  document.querySelectorAll(".nav-item").forEach((btn) => {
    const active = btn.dataset.nav === view;
    btn.classList.toggle("active", active);
    if (active) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });

  if (view === "login") {
    window.scrollTo(0, 0);
  }

  if (view === "progress") renderProgress();
  if (view === "history") renderHistory();
  if (view === "parent") renderParent();
}

function setLoginMode(mode) {
  state.loginMode = mode === "signup" ? "signup" : "login";
  const isLogin = state.loginMode === "login";
  const title = $("loginTitle");
  const sub = $("loginSub");
  const submit = $("loginSubmit");
  const footText = $("loginFootText");
  const toggle = $("loginModeToggle");

  if (title) title.textContent = isLogin ? "أهلًا بعودتك" : "أنشئ حسابك";
  if (sub) sub.textContent = isLogin ? "سجّل الدخول لمتابعة دراستك" : "ابدأ رحلتك التعليمية من هنا";
  if (submit) submit.textContent = isLogin ? "تسجيل الدخول" : "إنشاء حساب";
  if (footText) footText.textContent = isLogin ? "ليس لديك حساب؟" : "لديك حساب؟";
  if (toggle) toggle.textContent = isLogin ? "أنشئ حسابًا" : "سجّل الدخول";
}

function applyGradeUI() {
  document.querySelectorAll(".grade-pill").forEach((pill) => {
    const active = pill.dataset.grade === state.grade;
    pill.classList.toggle("active", active);
    pill.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function applySubjectUI() {
  document.querySelectorAll(".subject-btn").forEach((btn) => {
    const active = btn.dataset.subjectId === state.subjectId;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderSubjects() {
  const grid = $("subjectGrid");
  if (!grid) return;
  grid.innerHTML = "";
  for (const id of SUBJECT_ORDER) {
    const subject = SUBJECTS[id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "subject-btn " + tintFor(id);
    btn.dataset.subjectId = id;
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = (SUBJECT_ICONS[id] || "") + "<span>" + esc(subject.name) + "</span>";
    btn.addEventListener("click", () => selectSubject(id));
    grid.appendChild(btn);
  }
}

function renderExamples() {
  const wrap = $("examples");
  if (!wrap) return;
  wrap.innerHTML = "";
  const list = (typeof EXAMPLES !== "undefined" && EXAMPLES[state.subjectId]) || [];
  for (const text of list) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "example-chip";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      const input = $("questionInput");
      if (!input) return;
      input.value = text;
      input.focus();
      const error = $("askError");
      if (error) error.hidden = true;
    });
    wrap.appendChild(btn);
  }
}

function selectGrade(grade) {
  state.grade = String(grade);
  try { localStorage.setItem("skw_grade", state.grade); } catch (e) {}
  applyGradeUI();
}

function selectSubject(id) {
  if (!SUBJECTS[id]) return;
  state.subjectId = id;
  try { localStorage.setItem("skw_subject", id); } catch (e) {}
  applySubjectUI();
  renderExamples();
}

function resetAnswer() {
  const area = $("answerArea");
  if (!area) return;
  area.hidden = true;
  area.innerHTML = "";
}

/* ---------- الأحداث ---------- */
function handleLogin(event) {
  event.preventDefault();
  const username = $("loginUsername").value.trim();
  const password = $("loginPassword").value;
  const error = $("loginError");
  const notice = $("loginNotice");

  if (!username || password.length < 4) {
    if (error) error.hidden = false;
    if (notice) notice.hidden = true;
    return;
  }

  if (error) error.hidden = true;
  if (notice) notice.hidden = true;

  state.studentName = username;
  try { localStorage.setItem("skw_student", username); } catch (e) {}
  $("loginPassword").value = "";

  loadPrefs();
  applyGradeUI();
  applySubjectUI();
  renderExamples();
  renderWeak();
  showView("ask");
  restoreLastAnswer();
}

function handleAsk(event) {
  event.preventDefault();
  if (state.busy) return;

  const input = $("questionInput");
  const error = $("askError");
  const question = input.value.trim();
  const textAttachment = state.attachments.find((a) => a.kind === "text");
  const imageAttachment = state.attachments.find((a) => a.kind === "image");

  if (question.length < 2 && !textAttachment) {
    if (error) {
      error.textContent = imageAttachment
        ? "أضفت صورة، لكنني لا أستطيع قراءتها — اكتب سؤالك بكلماتك، أو أرفق ملفًا نصيًا (txt)."
        : "اكتب سؤالك أولًا، ثم اضغط «اشرح لي».";
      error.hidden = false;
    }
    input.focus();
    return;
  }

  if (error) error.hidden = true;

  const searchText = [question, textAttachment ? textAttachment.text : ""].join(" ").trim();
  const displayQuestion = question || ("سجل من الملف: " + (textAttachment ? textAttachment.name : ""));

  state.busy = true;
  setAskLoading(true);

  const data = buildAnswerData(state.subjectId, searchText);
  data.question = displayQuestion;
  data.searchText = searchText;
  data.attachments = state.attachments.map((a) => Object.assign({}, a));

  pushHistory({
    ts: Date.now(),
    subjectId: state.subjectId,
    grade: state.grade,
    question: displayQuestion,
    hint: searchText.slice(0, 600),
    attachments: data.attachments.map((a) => a.kind === "image"
      ? { kind: "image", name: a.name, dataUrl: a.dataUrl }
      : { kind: "text", name: a.name, preview: a.text.slice(0, 160) })
  });

  renderLoading();
  input.value = "";
  clearAttachments();

  window.clearTimeout(state.answerTimer);
  state.answerTimer = window.setTimeout(() => {
    renderAnswer(data);
    if (!data.fallback) {
      for (const t of data.terms) recordWeak(t);
    }
    saveLastAnswer(data);
    state.busy = false;
    setAskLoading(false);

    const area = $("answerArea");
    if (area) area.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 450);
}

function setAskLoading(loading) {
  const btn = $("askSubmit");
  if (!btn) return;
  if (loading) {
    if (!btn.dataset.original) btn.dataset.original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner spinner-light"></span><span>أجهّز الشرح…</span>';
  } else {
    btn.disabled = false;
    if (btn.dataset.original) {
      btn.innerHTML = btn.dataset.original;
      delete btn.dataset.original;
    }
  }
}

function handleLogout() {
  state.studentName = "";
  state.weakFilter = "all";
  state.historyFilter = "all";
  state.historyQuery = "";
  clearAttachments();
  resetAnswer();
  renderWeak();
  const input = $("questionInput");
  if (input) input.value = "";
  const search = $("historySearch");
  if (search) search.value = "";
  const historyNotice = $("historyNotice");
  if (historyNotice) historyNotice.hidden = true;
  const historyError = $("historyError");
  if (historyError) historyError.hidden = true;
  const error = $("askError");
  if (error) error.hidden = true;
  const password = $("loginPassword");
  if (password) password.value = "";
  const loginError = $("loginError");
  if (loginError) loginError.hidden = true;
  const notice = $("loginNotice");
  if (notice) notice.hidden = true;
  setLoginMode("login");
  showView("login");
  const name = $("loginUsername");
  if (name) name.focus();
}

function init() {
  renderSubjects();
  renderFilters();
  loadPrefs();
  applyGradeUI();
  applySubjectUI();
  renderExamples();
  renderWeak();

  const savedStudent = readSavedStudent();
  const nameInput = $("loginUsername");
  if (nameInput && savedStudent) nameInput.value = savedStudent;
  setLoginMode("login");
  showView("login");

  const loginForm = $("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const modeToggle = $("loginModeToggle");
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      setLoginMode(state.loginMode === "login" ? "signup" : "login");
      const error = $("loginError");
      if (error) error.hidden = true;
      const notice = $("loginNotice");
      if (notice) notice.hidden = true;
    });
  }

  const googleBtn = $("googleBtn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      const notice = $("loginNotice");
      if (!notice) return;
      notice.textContent = "الدخول بحساب Google غير متاح في هذه النسخة المحلية — استخدم اسمك وكلمة المرور بالأسفل.";
      notice.hidden = false;
      const error = $("loginError");
      if (error) error.hidden = true;
    });
  }

  const forgotBtn = $("forgotBtn");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", () => {
      const notice = $("loginNotice");
      if (!notice) return;
      notice.textContent = "لا مشكلة! اكتب اسم المستخدم وكلمة مرور من 4 أحرف على الأقل للدخول — البيانات تُحفظ على جهازك فقط.";
      notice.hidden = false;
      const error = $("loginError");
      if (error) error.hidden = true;
    });
  }

  const gradePills = $("gradePills");
  if (gradePills) {
    gradePills.addEventListener("click", (event) => {
      const pill = event.target.closest(".grade-pill");
      if (pill) selectGrade(pill.dataset.grade);
    });
  }

  const askForm = $("askForm");
  if (askForm) askForm.addEventListener("submit", handleAsk);

  const answerArea = $("answerArea");
  if (answerArea) {
    answerArea.addEventListener("click", (event) => {
      const explain = event.target.closest(".explain-btn");
      if (explain) {
        toggleTermExplain(explain);
        return;
      }
      const quizOption = event.target.closest(".quiz-option");
      if (quizOption) {
        handleQuizOption(quizOption);
        return;
      }
      const suggestion = event.target.closest("[data-suggestion]");
      if (suggestion) {
        const input = $("questionInput");
        if (!input) return;
        input.value = suggestion.dataset.suggestion;
        input.focus();
      }
    });
  }

  const weakFilters = $("weakFilters");
  if (weakFilters) {
    weakFilters.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;
      state.weakFilter = chip.dataset.filter || "all";
      renderWeak();
    });
  }

  const weakList = $("weakList");
  if (weakList) {
    weakList.addEventListener("click", (event) => {
      const explain = event.target.closest(".explain-btn");
      if (explain) {
        toggleTermExplain(explain);
        return;
      }
      const toggle = event.target.closest(".weak-toggle");
      if (!toggle) return;
      const item = toggle.closest(".weak-item");
      const body = item ? item.querySelector(".weak-body") : null;
      if (!item || !body) return;
      const open = !body.hasAttribute("hidden");
      if (open) {
        body.setAttribute("hidden", "");
        item.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      } else {
        body.removeAttribute("hidden");
        item.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  }

  const clearWeak = $("clearWeak");
  if (clearWeak) {
    clearWeak.addEventListener("click", () => {
      try { localStorage.removeItem(weakStorageKey()); } catch (e) {}
      renderWeak();
    });
  }

  const emptyCta = $("weakEmptyCta");
  if (emptyCta) {
    emptyCta.addEventListener("click", () => {
      showView("ask");
      const input = $("questionInput");
      if (input) input.focus();
    });
  }

  const progressCta = $("progressCta");
  if (progressCta) {
    progressCta.addEventListener("click", () => {
      showView("ask");
      const input = $("questionInput");
      if (input) input.focus();
    });
  }

  const progressAllBtn = $("progressAllBtn");
  if (progressAllBtn) {
    progressAllBtn.addEventListener("click", () => showView("history"));
  }

  const historySearch = $("historySearch");
  if (historySearch) {
    historySearch.addEventListener("input", () => {
      state.historyQuery = historySearch.value;
      renderHistory();
    });
  }

  const historyFilters = $("historyFilters");
  if (historyFilters) {
    historyFilters.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-history-filter]");
      if (!chip) return;
      state.historyFilter = chip.dataset.historyFilter || "all";
      renderHistory();
    });
  }

  const historyFull = $("historyFull");
  if (historyFull) {
    historyFull.addEventListener("click", (event) => {
      const openBtn = event.target.closest("[data-open-history]");
      if (openBtn) {
        openHistoryEntry(Number(openBtn.dataset.openHistory));
        return;
      }
      const deleteBtn = event.target.closest("[data-delete-history]");
      if (deleteBtn) deleteHistoryEntry(Number(deleteBtn.dataset.deleteHistory));
    });
  }

  const historyExport = $("historyExport");
  if (historyExport) historyExport.addEventListener("click", exportBackup);

  const historyImportBtn = $("historyImportBtn");
  const historyImport = $("historyImport");
  if (historyImportBtn && historyImport) {
    historyImportBtn.addEventListener("click", () => historyImport.click());
    historyImport.addEventListener("change", () => {
      const file = historyImport.files && historyImport.files[0];
      historyImport.value = "";
      if (file) importBackup(file);
    });
  }

  const historyClear = $("historyClear");
  if (historyClear) historyClear.addEventListener("click", clearHistory);

  const historyEmptyCta = $("historyEmptyCta");
  if (historyEmptyCta) {
    historyEmptyCta.addEventListener("click", () => {
      showView("ask");
      const input = $("questionInput");
      if (input) input.focus();
    });
  }

  const attachBtn = $("attachBtn");
  const attachInput = $("attachInput");
  if (attachBtn && attachInput) {
    attachBtn.addEventListener("click", () => attachInput.click());
    attachInput.addEventListener("change", () => {
      const files = Array.from(attachInput.files || []);
      attachInput.value = "";
      if (files.length) addAttachments(files);
    });
  }

  const attachList = $("attachList");
  if (attachList) {
    attachList.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-attach]");
      if (!btn) return;
      const index = Number(btn.dataset.attach);
      if (!Number.isNaN(index)) {
        state.attachments.splice(index, 1);
        renderAttachments();
      }
    });
  }

  const sourceBtn = $("sourceBtn");
  const sourceInput = $("sourceInput");
  if (sourceBtn && sourceInput) {
    sourceBtn.addEventListener("click", () => sourceInput.click());
    sourceInput.addEventListener("change", () => {
      const files = Array.from(sourceInput.files || []);
      sourceInput.value = "";
      if (files.length) handleSourceFiles(files);
    });
  }

  const sourceList = $("sourceList");
  if (sourceList) {
    sourceList.addEventListener("click", (event) => {
      const btn = event.target.closest(".source-remove");
      if (!btn) return;
      const item = btn.closest(".source-item");
      const id = item ? item.dataset.sourceId : "";
      saveSources(getSources().filter((file) => file.id !== id));
      renderSources();
      const note = $("sourceNotice");
      if (note) {
        note.textContent = "حذفنا الملف من هذا الجهاز.";
        note.hidden = false;
      }
      const error = $("sourceError");
      if (error) error.hidden = true;
    });
  }

  const parentForm = $("parentForm");
  if (parentForm) parentForm.addEventListener("submit", handleParentSave);

  const sendReport = $("sendReportBtn");
  if (sendReport) sendReport.addEventListener("click", handleSendReport);

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.nav === "weak") {
        renderWeak();
        showView("weak");
      } else if (btn.dataset.nav === "progress") {
        renderProgress();
        showView("progress");
      } else if (btn.dataset.nav === "history") {
        renderHistory();
        showView("history");
      } else if (btn.dataset.nav === "parent") {
        renderParent();
        showView("parent");
      } else {
        showView("ask");
      }
    });
  });

  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const brandLink = $("brandLink");
  if (brandLink) {
    brandLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (state.view !== "login") showView("ask");
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
