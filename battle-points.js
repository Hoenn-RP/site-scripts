// --- Battle Points script with fixed tag detection ---
(async function () {
  const DEBUG = true; // set to false when stable

  // --- Firebase config ---
  const firebaseConfig = {
    apiKey: "AIzaSyA6P4vttMoSJvBAFvrv06jq2E1VGnGTYc",
    authDomain: "battlepoints-e44ae.firebaseapp.com",
    databaseURL: "https://battlepoints-e44ae-default-rtdb.firebaseio.com/",
    projectId: "battlepoints-e44ae",
    storageBucket: "battlepoints-e44ae.appspot.com",
    messagingSenderId: "399195500755",
    appId: "1:399195500755:web:1ec2d2bbed078b23876426",
    measurementId: "G-4P60SDR786"
  };

  // --- Load firebase compat libs if missing ---
  if (typeof firebase === "undefined") {
    if (DEBUG) console.log("[BP] loading firebase compat libs...");
    const s1 = document.createElement("script");
    s1.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    document.head.appendChild(s1);
    await new Promise(r => s1.onload = r);
    const s2 = document.createElement("script");
    s2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(s2);
    await new Promise(r => s2.onload = r);
    if (DEBUG) console.log("[BP] firebase libs loaded");
  }

  if (!firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
      if (DEBUG) console.log("[BP] firebase.initializeApp() OK");
    } catch (e) {
      console.error("[BP] firebase init error", e);
    }
  }

  const db = firebase.database();
  const SITE_PREFIX = "battle";

  // --- Firebase helpers ---
  const ref = (p) => db.ref(`${SITE_PREFIX}/${p}`);
  async function fetchData(p) {
    try {
      const val = (await ref(p).get()).val();
      if (DEBUG) console.log(`[BP] fetchData ${p} ->`, val);
      return val;
    } catch (e) {
      console.error("[BP] fetchData error", p, e);
      return null;
    }
  }
  async function setData(p, d) {
    try {
      await ref(p).set(d);
      if (DEBUG) console.log(`[BP] setData ${p} <=`, d);
      return true;
    } catch (e) {
      console.error("[BP] setData error", p, e);
      return false;
    }
  }

  // --- ProBoards user detection ---
  const userObj = (typeof proboards !== "undefined" && proboards.data)
    ? proboards.data("user")
    : (typeof pb !== "undefined" && pb.data)
      ? pb.data("user")
      : null;

  if (!userObj || !userObj.id) {
    console.warn("[BP] guest detected — no point tracking");
    return;
  }

  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;
  if (DEBUG) console.log("[BP] user:", currentUserId, "isStaff:", isStaff);

  // --- Tag configuration ---
  const POST_TAG_VALUES = {
    "[PVP]": 2,
    "[BATTLE]": 1,
    // Add more tags here as needed
  };
  if (DEBUG) console.log("[BP] POST_TAG_VALUES:", POST_TAG_VALUES);

  // --- Rank reset flag (optional) ---
  let battleResetFlag = false;
  async function loadResetFlag() {
    const f = await fetchData("rank_reset_flag");
    battleResetFlag = !!f;
    if (DEBUG) console.log("[BP] rank_reset_flag:", battleResetFlag);
  }

  // --- Rank calculator ---
  function calculateRank(points) {
    if (battleResetFlag) return "Z";
    const step = Math.floor(points / 2);
    let code = 90 - step;
    if (code < 65) code = 65;
    return String.fromCharCode(code);
  }

  // --- Display updater ---
  async function updateAllDisplays() {
    const all = (await fetchData("users")) || {};
    $(".battle-member-points[data-user-id]").each(function () {
      const id = $(this).attr("data-user-id");
      $(this).text(all[id]?.points ?? 0);
    });
    $(".battle-member-rank[data-user-id]").each(function () {
      const id = $(this).attr("data-user-id");
      $(this).text(calculateRank(all[id]?.points ?? 0));
    });
    if (DEBUG) console.log("[BP] displays updated");
  }

  // --- Award function ---
  async function awardBattlePoints(uid, pts = 1) {
    if (!uid) return console.error("[BP] awardBattlePoints: missing uid");
    const key = `users/${String(uid)}`;
    const cur = (await fetchData(key)) || { points: 0, posts: 0 };
    cur.points = (cur.points || 0) + Number(pts);
    cur.posts = (cur.posts || 0) + 1;
    await setData(key, cur);
    await updateAllDisplays();
    if (DEBUG) console.log(`[BP] +${pts} awarded to ${uid}`);
  }

  // --- Subject detection (using itemprop="name" for reliability) ---
  function getThreadSubject() {
    let subject = "";

    // 1. Try ProBoards data objects
    try {
      if (typeof proboards !== "undefined" && proboards.data) {
        const thread = proboards.data("thread");
        if (thread?.subject) subject = thread.subject;
      }
    } catch (e) {}
    try {
      if (!subject && typeof pb !== "undefined" && pb.data) {
        const thread = pb.data("thread");
        if (thread?.subject) subject = thread.subject;
      }
    } catch (e) {}

    // 2. Try <span itemprop="name">
    if (!subject) {
      const el = document.querySelector('[itemprop="name"]');
      if (el) subject = el.textContent.trim();
    }

    // 3. Fallback: .thread-title or <h1>
    if (!subject) {
      const el = document.querySelector(".thread-title, h1.thread-title, .content > h1");
      if (el) subject = el.textContent.trim();
    }

    // 4. Fallback: document.title
    if (!subject) subject = (document.title || "").split("|")[0].trim();

    return subject.replace(/\s+/g, " ").trim();
  }

  // --- Post event handler ---
  async function handleNewPostEvent() {
    await new Promise(r => setTimeout(r, 1000));
    const subject = getThreadSubject();
    if (DEBUG) console.log("[BP] subject:", subject);
    if (!subject) return;

    const upper = subject.toUpperCase();
    let matchedValue = null;
    let matchedTag = null;

    for (const [tag, val] of Object.entries(POST_TAG_VALUES)) {
      const clean = tag.replace(/[\[\]]/g, "").toUpperCase();
      if (upper.includes(tag.toUpperCase()) || upper.includes(clean)) {
        matchedValue = Number(val);
        matchedTag = tag;
        break;
      }
    }

    if (!matchedValue) {
      if (DEBUG) console.log("[BP] no tag match");
      return;
    }

    // Detect post author
    let postAuthorId = currentUserId;
    try {
      const p = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("post") : null;
      if (p && (p.user_id || p.author_id)) postAuthorId = String(p.user_id || p.author_id);
    } catch (e) {}
    try {
      if (typeof pb !== "undefined" && pb.data) {
        const pp = pb.data("post");
        if (pp && (pp.user_id || pp.author_id)) postAuthorId = String(pp.user_id || pp.author_id);
      }
    } catch (e) {}

    if (DEBUG) console.log(`[BP] matched ${matchedTag} (${matchedValue} pts) → ${postAuthorId}`);
    await awardBattlePoints(postAuthorId, matchedValue);
  }

  // --- Event hooks ---
  function setupEventHooks() {
    if (typeof pb !== "undefined" && pb.events) {
      pb.events.on("post.create", () => setTimeout(handleNewPostEvent, 1200));
      pb.events.on("post.new", () => setTimeout(handleNewPostEvent, 1200));
      pb.events.on("afterPost", () => setTimeout(handleNewPostEvent, 1200));
    }

    $(document).on("ajax_success", (e, d, s, xhr) => {
      const url = xhr?.responseURL || "";
      if (url.includes("/post/") || url.includes("/thread/") || url.includes("/reply/"))
        setTimeout(handleNewPostEvent, 1500);
    });

    $(document).ajaxSuccess((e, xhr, s) => {
      const url = s?.url || "";
      if (url.includes("/post/") || url.includes("/thread/") || url.includes("/reply/"))
        setTimeout(handleNewPostEvent, 1500);
    });

    const mo = new MutationObserver(muts => {
      for (const m of muts)
        for (const n of m.addedNodes || []) {
          if (n.nodeType === 1 && (n.matches(".post") || n.querySelector?.(".post"))) {
            if (DEBUG) console.log("[BP] MutationObserver post detected");
            setTimeout(handleNewPostEvent, 1200);
            return;
          }
        }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    if (DEBUG) console.log("[BP] hooks ready");
  }

  // --- Staff manual edit buttons ---
  function setupStaffButtons() {
    if (!isStaff) return;
    $(".battle-edit-btn").each(function () {
      const $btn = $(this);
      if ($btn.data("bound")) return;
      const id = $btn.attr("data-user-id");
      $btn.data("bound", true).show().off("click").on("click", async function () {
        const cur = (await fetchData(`users/${id}`)) || { points: 0 };
        const v = prompt("Set Battle Points for user " + id, String(cur.points || 0));
        if (v === null) return;
        const nv = parseInt(v);
        if (!isNaN(nv)) {
          cur.points = nv;
          await setData(`users/${id}`, cur);
          await updateAllDisplays();
        }
      });
    });
  }

  // --- Debug helpers ---
  window.BattleDebug = {
    testSubject: () => console.log("[BP] subject:", getThreadSubject()),
    manualAward: (uid, pts = 1) => awardBattlePoints(uid, pts),
    printThreadData: () => {
      try { console.log("proboards.data('thread'):", proboards.data("thread")); } catch {}
      try { console.log("pb.data('thread'):", pb.data("thread")); } catch {}
    }
  };

  // --- Initialize ---
  async function initialize() {
    if (DEBUG) console.log("[BP] initializing...");
    await loadResetFlag();
    await updateAllDisplays();
    setupEventHooks();
    setupStaffButtons();
    if (DEBUG) console.log("[BP] ready");
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();
