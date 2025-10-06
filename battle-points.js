// Debug/robust Battle Points script
(async function () {
  const DEBUG = true; // set false later when confirmed working

  // --- Firebase config (use your DB) ---
  const firebaseConfig = {
    apiKey: "AIzaSyA6P4vttMoSJvBAFvrv06jq2E1VGnGTYcA",
    authDomain: "battlepoints-e44ae.firebaseapp.com",
    databaseURL: "https://battlepoints-e44ae-default-rtdb.firebaseio.com/",
    projectId: "battlepoints-e44ae",
    storageBucket: "battlepoints-e44ae.appspot.com",
    messagingSenderId: "399195500755",
    appId: "1:399195500755:web:1ec2d2bbed078b23876426",
    measurementId: "G-4P60SDR786"
  };

  // Load firebase compat libs if missing
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
  } else {
    if (DEBUG) console.log("[BP] firebase already initialized");
  }

  const db = firebase.database();
  const SITE_PREFIX = "battle";

  // DB wrappers with logging
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
  async function updateData(p, d) {
    try {
      await ref(p).update(d);
      if (DEBUG) console.log(`[BP] updateData ${p} <=`, d);
      return true;
    } catch (e) {
      console.error("[BP] updateData error", p, e);
      return false;
    }
  }

  // --- user detection (ProBoards) ---
  const userObj = (typeof proboards !== "undefined" && proboards.data)
    ? proboards.data("user")
    : (typeof pb !== "undefined" && pb.data)
      ? pb.data("user")
      : null;

  if (!userObj || !userObj.id) {
    console.warn("[BP] no proboards user detected — script will not run for guests.");
    return;
  }
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;
  if (DEBUG) console.log("[BP] currentUserId:", currentUserId, "isStaff:", isStaff);

  // --- tag config (per-tag values) ---
  const POST_TAG_VALUES = {
    "[PVP]": 2,
    "[BATTLE]": 1,
    // add more here
  };
  if (DEBUG) console.log("[BP] POST_TAG_VALUES:", POST_TAG_VALUES);

  // --- rank reset flag (if used) ---
  let battleResetFlag = false;
  async function loadResetFlag() {
    const f = await fetchData("rank_reset_flag");
    battleResetFlag = !!f;
    if (DEBUG) console.log("[BP] loaded rank_reset_flag:", battleResetFlag);
  }

  // --- helper: calculate rank ---
  function calculateRank(points) {
    if (battleResetFlag) return "Z";
    const step = Math.floor(points / 2);
    let code = 90 - step;
    if (code < 65) code = 65;
    return String.fromCharCode(code);
  }

  // --- display helpers ---
  function idFromElement($el) {
    let id = $el.attr("data-user-id") ?? $el.data("user-id");
    return id ? String(id) : null;
  }
  async function updateAllDisplays() {
    const all = (await fetchData("users")) || {};
    $(".battle-member-points[data-user-id]").each(function () {
      const $el = $(this);
      const id = idFromElement($el);
      if (!id) return;
      $el.text(all[id]?.points ?? 0);
    });
    $(".battle-member-rank[data-user-id]").each(function () {
      const $el = $(this);
      const id = idFromElement($el);
      if (!id) return;
      $el.text(calculateRank(all[id]?.points ?? 0));
    });
    if (DEBUG) console.log("[BP] updateAllDisplays done");
  }

  // --- award function with confirmation readback ---
  async function awardBattlePoints(uid, pts = 1) {
    if (!uid) { console.error("[BP] awardBattlePoints called without uid"); return; }
    const key = `users/${String(uid)}`;
    const cur = (await fetchData(key)) || { points: 0, posts: 0 };
    cur.points = (cur.points || 0) + Number(pts || 0);
    cur.posts = (cur.posts || 0) + 1;
    const ok = await setData(key, cur);
    if (!ok) { console.error("[BP] failed to write award to firebase"); return; }
    const verify = await fetchData(key);
    if (DEBUG) console.log(`[BP] awarded ${pts} to ${uid} — verify:`, verify);
    await updateAllDisplays();
  }

  // --- subject detection (simplified for your forum) ---
  function getThreadSubject() {
    // Use document.title, strip trailing " | " board name if present
    let t = document.title || "";
    if (!t) return "";
    const parts = t.split("|");
    return parts[0].trim();
  }

  // --- event handling: robust & debug logging ---
  async function handleNewPostEvent() {
    // give the page a little time to settle
    await new Promise(r => setTimeout(r, 1000));
    const subject = getThreadSubject();
    if (DEBUG) console.log("[BP] handleNewPostEvent -> subject:", subject);
    if (!subject) { if (DEBUG) console.log("[BP] no subject found"); return; }

    // find first matching tag
    let matchedValue = null;
    let matchedTag = null;
    const upper = subject.toUpperCase();
    for (const [tag, val] of Object.entries(POST_TAG_VALUES)) {
      if (upper.includes(tag.toUpperCase())) {
        matchedValue = Number(val) || 1;
        matchedTag = tag;
        break;
      }
    }
    if (!matchedValue) { if (DEBUG) console.log("[BP] no tag matched in subject"); return; }

    // get post author id if ProBoards exposed it; otherwise default to current user
    let postAuthorId = null;
    try {
      const p = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("post") : null;
      if (p && (p.user_id || p.author_id)) { postAuthorId = String(p.user_id || p.author_id); }
    } catch (e) { }
    try {
      if (!postAuthorId && typeof pb !== "undefined" && pb.data) {
        const pp = pb.data("post");
        if (pp && (pp.user_id || pp.author_id)) postAuthorId = String(pp.user_id || pp.author_id);
      }
    } catch (e) { }
    if (!postAuthorId) postAuthorId = currentUserId;

    if (DEBUG) console.log(`[BP] matched tag ${matchedTag} (${matchedValue} pts). awarding to ${postAuthorId}`);
    await awardBattlePoints(postAuthorId, matchedValue);
  }

  // --- event hook setup ---
  function setupEventHooks() {
    if (typeof pb !== "undefined" && pb.events) {
      try {
        if (DEBUG) console.log("[BP] hooking pb.events listeners");
        try { pb.events.on("post.create", ev => { if (DEBUG) console.log("[BP] pb.events: post.create"); setTimeout(handleNewPostEvent, 1200); }); } catch(e){}
        try { pb.events.on("post.new", ev => { if (DEBUG) console.log("[BP] pb.events: post.new"); setTimeout(handleNewPostEvent, 1200); }); } catch(e){}
        try { pb.events.on("afterPost", ev => { if (DEBUG) console.log("[BP] pb.events: afterPost"); setTimeout(handleNewPostEvent, 1200); }); } catch(e){}
      } catch (e) { console.warn("[BP] pb.events hook error", e); }
    } else {
      if (DEBUG) console.log("[BP] pb.events not available");
    }

    // old / common hook used by many forums
    try {
      $(document).on("ajax_success", function (event, data, status, xhr) {
        const url = xhr?.responseURL || "";
        if (DEBUG) console.log("[BP] ajax_success fired; url:", url);
        if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create") || url.includes("/reply/")) {
          setTimeout(handleNewPostEvent, 1500);
        }
      });
    } catch (e) {
      if (DEBUG) console.log("[BP] ajax_success hook not available", e);
    }

    // jQuery's ajaxSuccess as an extra fallback
    try {
      $(document).ajaxSuccess(function (event, xhr, settings) {
        const url = settings?.url || "";
        if (DEBUG) console.log("[BP] jQuery ajaxSuccess; url:", url);
        if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create") || url.includes("/reply/")) {
          setTimeout(handleNewPostEvent, 1500);
        }
      });
    } catch (e) { if (DEBUG) console.log("[BP] ajaxSuccess hook error", e); }

    // MutationObserver fallback (detect DOM insertion of new post)
    try {
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const n of Array.from(m.addedNodes || [])) {
            if (n.nodeType !== 1) continue;
            const el = n;
            if (el.matches && (el.matches(".post") || el.querySelector && el.querySelector(".post"))) {
              if (DEBUG) console.log("[BP] MutationObserver detected post DOM insertion");
              setTimeout(handleNewPostEvent, 1200);
              return;
            }
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      if (DEBUG) console.log("[BP] MutationObserver watching document.body");
    } catch (e) { if (DEBUG) console.log("[BP] MutationObserver error", e); }
  }

  // --- staff quick edit buttons (very small) ---
  function setupStaffButtons() {
    if (!isStaff) return;
    $(".battle-edit-btn").each(function () {
      const $btn = $(this);
      if ($btn.data("bound")) { $btn.show(); return; }
      const id = idFromElement($btn) || $btn.attr("data-user-id");
      if (!id) return;
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

  // --- expose debug helpers on window for manual testing ---
  window.BattleDebug = {
    testSubject: () => {
      const s = getThreadSubject();
      console.log("[BP] testSubject ->", s);
      return s;
    },
    manualAward: async (uid, pts=1) => {
      console.log(`[BP] manualAward ${pts} to ${uid}`);
      await awardBattlePoints(uid, pts);
    },
    printProboardsThreadData: () => {
      try { console.log("proboards.data('thread'):", (typeof proboards !== 'undefined' && proboards.data) ? proboards.data('thread') : null); } catch(e){console.log(e);}
      try { console.log("pb.data('thread'):", (typeof pb !== 'undefined' && pb.data) ? pb.data('thread') : null); } catch(e){console.log(e);}
    }
  };

  // --- initialize script ---
  async function initialize() {
    if (DEBUG) console.log("[BP] initialize start");
    await loadResetFlag();
    await updateAllDisplays();
    setupEventHooks();
    setupStaffButtons();
    if (DEBUG) console.log("[BP] initialization complete — listening for new posts");
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();


