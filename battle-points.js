// Full Battle Points script — robust create-post detection + breadcrumb subject detection
(async function () {
  const DEBUG = true; // set false when stable

  // --- Firebase config (keep yours) ---
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
  } else {
    if (DEBUG) console.log("[BP] firebase already initialized");
  }

  const db = firebase.database();
  const SITE_PREFIX = "battle";

  // --- DB helpers ---
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

  // --- subject detection (precise, using breadcrumb itemprop="name" and subject input) ---
  function getBreadcrumbThreadSubject() {
    // user-provided reliable breadcrumb selector:
    const el = document.querySelector('#nav-tree li:last-child span[itemprop="name"]');
    if (el && el.textContent) return el.textContent.trim();
    return null;
  }

  function getSubjectInputValueFromForm(formEl) {
    try {
      const subj = formEl.querySelector('input[name="subject"], input[id$="_subject_input"]');
      if (subj && subj.value && subj.value.trim()) return subj.value.trim();
    } catch (e) {}
    return null;
  }

  function getThreadSubjectFallback() {
    // fallback to pb/proboards data if available, then doc.title
    try {
      if (typeof proboards !== "undefined" && proboards.data) {
        const t = proboards.data("thread");
        if (t && t.subject) return String(t.subject).trim();
      }
    } catch (e) {}
    try {
      if (typeof pb !== "undefined" && pb.data) {
        const t = pb.data("thread");
        if (t && t.subject) return String(t.subject).trim();
      }
    } catch (e) {}
    // last fallback
    const doc = (document.title || "").split("|")[0].trim();
    return doc || "";
  }

  function getThreadSubjectPreferBreadcrumb() {
    // Prefer the itemprop breadcrumb text because reply/create pages maintain it.
    const bc = getBreadcrumbThreadSubject();
    if (bc) return bc;
    return getThreadSubjectFallback();
  }

  // --- find newest post element and author id helpers ---
  function findNewestPostElement() {
    const nodes = Array.from(document.querySelectorAll('[data-post-id]'));
    if (!nodes.length) return null;
    let newest = nodes[0];
    let bestId = parseInt(newest.getAttribute('data-post-id') || "0", 10) || 0;
    for (const n of nodes) {
      const id = parseInt(n.getAttribute('data-post-id') || "0", 10) || 0;
      if (id > bestId) { bestId = id; newest = n; }
    }
    return newest;
  }

  function findPostAuthorIdFromElement(postEl) {
    try {
      if (!postEl) return null;
      // check data-user-id / data-author-id
      const du = postEl.getAttribute('data-user-id') || postEl.getAttribute('data-author-id') || postEl.dataset?.userId || postEl.dataset?.authorId;
      if (du) return String(du);

      // look for a user link inside the post
      const a = postEl.querySelector("a.user-link, a.js-user-link, a[href*='/user/']");
      if (a) {
        const href = a.getAttribute('href') || "";
        const m = href.match(/\/user\/(\d+)/);
        if (m) return String(m[1]);
        const idAttr = a.getAttribute('data-user-id') || a.dataset?.userId;
        if (idAttr) return String(idAttr);
      }

      // look for class like user-123
      const clsMatch = postEl.querySelector("[class*='user-']");
      if (clsMatch) {
        const cls = (clsMatch.getAttribute("class") || "");
        const m = cls.match(/user-(\d+)/);
        if (m) return String(m[1]);
      }
    } catch (e) {
      if (DEBUG) console.warn("[BP] findPostAuthorIdFromElement error", e);
    }
    return null;
  }

  // --- pending award bookkeeping (pre-capture on submit, finalize when post confirmed) ---
  let pendingAward = null; // {subject, capturedAt, claimed: false}
  const awardedPostIds = new Set();
  let lastSeenPostId = null;

  function capturePendingAwardFromForm(formEl) {
    // Called when user attempts to submit a post (create/reply/new thread)
    let subject = null;
    // If form contains subject input (new thread), use that
    subject = getSubjectInputValueFromForm(formEl);
    if (!subject) {
      // Otherwise prefer breadcrumb subject
      subject = getBreadcrumbThreadSubject() || getThreadSubjectFallback();
    }
    if (!subject) subject = "";
    pendingAward = { subject: subject, capturedAt: Date.now(), claimed: false };
    if (DEBUG) console.log("[BP] pendingAward captured:", pendingAward);
  }

  async function finalizePendingAward(newPostEl = null) {
    if (!pendingAward || pendingAward.claimed) {
      if (DEBUG) console.log("[BP] no pending award to finalize or already claimed");
      return;
    }

    // find new post id if possible
    let newPostId = null;
    if (newPostEl) {
      newPostId = newPostEl.getAttribute('data-post-id') || null;
    } else {
      // try to get newest post element
      const newest = findNewestPostElement();
      if (newest) {
        newPostId = newest.getAttribute('data-post-id') || null;
        newPostEl = newest;
      }
    }

    // prevent double awarding for the same post id
    if (newPostId && awardedPostIds.has(newPostId)) {
      if (DEBUG) console.log("[BP] post", newPostId, "already awarded — skipping");
      pendingAward.claimed = true;
      return;
    }

    // decide subject to check tags against: prefer the captured subject, otherwise breadcrumb
    const subject = (pendingAward.subject || "").trim() || getBreadcrumbThreadSubject() || getThreadSubjectFallback();
    if (DEBUG) console.log("[BP] finalizePendingAward -> subject:", subject, "newPostId:", newPostId);

    if (!subject) {
      if (DEBUG) console.log("[BP] no subject to check; abort");
      pendingAward.claimed = true;
      return;
    }

    // match tags (case-insensitive, bracket-tolerant)
    const upper = subject.toUpperCase();
    let matchedValue = null;
    let matchedTag = null;
    for (const [tag, val] of Object.entries(POST_TAG_VALUES)) {
      const tagClean = tag.replace(/[\[\]]/g, "").toUpperCase();
      if (upper.includes(tag.toUpperCase()) || upper.includes(tagClean)) {
        matchedValue = Number(val || 1);
        matchedTag = tag;
        break;
      }
    }

    if (!matchedValue) {
      if (DEBUG) console.log("[BP] subject didn't match configured tags:", subject);
      pendingAward.claimed = true;
      return;
    }

    // find author id: prefer reading from the newPostEl if available
    let postAuthorId = null;
    if (newPostEl) postAuthorId = findPostAuthorIdFromElement(newPostEl);
    // fallback to proboards pb.data('post') if available
    if (!postAuthorId) {
      try {
        const p = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("post") : null;
        if (p && (p.user_id || p.author_id)) postAuthorId = String(p.user_id || p.author_id);
      } catch (e) {}
    }
    try {
      if (!postAuthorId && typeof pb !== "undefined" && pb.data) {
        const pp = pb.data("post");
        if (pp && (pp.user_id || pp.author_id)) postAuthorId = String(pp.user_id || pp.author_id);
      }
    } catch (e) {}
    // final fallback: current user
    if (!postAuthorId) postAuthorId = currentUserId;

    // record award as claimed and avoid double awarding
    pendingAward.claimed = true;
    if (newPostId) awardedPostIds.add(newPostId);

    if (DEBUG) console.log(`[BP] awarding ${matchedValue} pts for tag ${matchedTag} to ${postAuthorId} (post ${newPostId})`);
    await awardBattlePoints(postAuthorId, matchedValue);
  }

  // --- event hook setup (capture submit + confirm creation) ---
  function setupCreateCapture() {
    // 1) capture form submit on forms that appear to be post-create or thread-create forms
    $(document).on('submit', 'form', function (ev) {
      try {
        const form = this;
        // heuristics: form has an input[name="post"] or an input[type="submit"] with value that includes 'Create Post' or 'Create Thread'
        const hasPostInput = !!form.querySelector('input[name="post"], button[name="post"], input[id*="post_button"], button[id*="post_button"]');
        const hasSubjectInput = !!form.querySelector('input[name="subject"], input[id$="_subject_input"]');
        const action = (form.getAttribute('action') || "").toLowerCase();
        const isPostForm = hasPostInput || action.includes('/post/') || action.includes('/thread/') || hasSubjectInput;
        if (isPostForm) {
          capturePendingAwardFromForm(form);
          // Do not block submit -- just capture and let AJAX / navigation happen
          if (DEBUG) console.log("[BP] form submit captured for potential award");
        }
      } catch (e) { if (DEBUG) console.warn("[BP] submit-capture error", e); }
    });

    // 1b) also capture click on the submit input/button (some flows don't trigger delegated submit)
    $(document).on('click', 'input[type="submit"], button[type="submit"]', function (ev) {
      try {
        const btn = this;
        const form = btn.form;
        if (!form) return;
        const name = (btn.getAttribute('name') || "").toLowerCase();
        const val = (btn.getAttribute('value') || "").toLowerCase();
        if (name === 'post' || val.includes('create post') || val.includes('create thread') || btn.id?.toLowerCase().includes('post_button')) {
          capturePendingAwardFromForm(form);
          if (DEBUG) console.log("[BP] submit button click captured for potential award");
        }
      } catch (e) { if (DEBUG) console.warn("[BP] click-capture error", e); }
    });
  }

  function setupConfirmationListeners() {
    // A) ajaxSuccess — many boards use AJAX to submit replies/threads
    try {
      $(document).ajaxSuccess(function (event, xhr, settings) {
        try {
          const url = (settings && settings.url) ? settings.url : (xhr && xhr.responseURL) ? xhr.responseURL : "";
          if (!url) return;
          if (DEBUG) console.log("[BP] ajaxSuccess url:", url);
          // Heuristics for post creation responses
          if (url.includes("/post/") || url.includes("/post/create") || url.includes("/thread/") || url.includes("/reply/")) {
            // allow DOM to update first
            setTimeout(async () => {
              const newest = findNewestPostElement();
              await finalizePendingAward(newest);
            }, 700);
          }
        } catch (e) { if (DEBUG) console.warn("[BP] ajaxSuccess handler err", e); }
      });
    } catch (e) { if (DEBUG) console.log("[BP] ajaxSuccess hook not available", e); }

    // B) MutationObserver: detect new post DOM insertion
    try {
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const n of Array.from(m.addedNodes || [])) {
            if (n.nodeType !== 1) continue;
            // Directly a data-post-id node
            if (n.matches && n.matches('[data-post-id]')) {
              const id = n.getAttribute('data-post-id');
              if (DEBUG) console.log("[BP] MutationObserver new data-post-id detected:", id);
              // prevent double-handle if we've seen it
              if (id && id !== lastSeenPostId) {
                lastSeenPostId = id;
                setTimeout(() => finalizePendingAward(n), 600);
                return;
              }
            }
            // Or contains a post inside
            const inside = n.querySelector && n.querySelector('[data-post-id]');
            if (inside) {
              const id = inside.getAttribute('data-post-id');
              if (DEBUG) console.log("[BP] MutationObserver new node contains post id:", id);
              if (id && id !== lastSeenPostId) {
                lastSeenPostId = id;
                setTimeout(() => finalizePendingAward(inside), 600);
                return;
              }
            }
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      if (DEBUG) console.log("[BP] MutationObserver watching document.body for new posts");
    } catch (e) { if (DEBUG) console.log("[BP] MutationObserver error", e); }

    // C) Polling fallback — detect newest data-post-id changes (robust backup)
    try {
      // initialize lastSeenPostId
      const initEl = findNewestPostElement();
      if (initEl) lastSeenPostId = initEl.getAttribute('data-post-id') || null;
      setInterval(async () => {
        try {
          const newest = findNewestPostElement();
          if (!newest) return;
          const id = newest.getAttribute('data-post-id');
          if (!id) return;
          if (id !== lastSeenPostId) {
            if (DEBUG) console.log("[BP] Polling detected new post id:", id, "prev:", lastSeenPostId);
            lastSeenPostId = id;
            await finalizePendingAward(newest);
          }
        } catch (e) {}
      }, 1500);
      if (DEBUG) console.log("[BP] Polling fallback active");
    } catch (e) { if (DEBUG) console.log("[BP] polling fallback error", e); }
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
      const s = getBreadcrumbThreadSubject() || getThreadSubjectFallback();
      console.log("[BP] testSubject ->", s);
      return s;
    },
    manualAward: async (uid, pts = 1) => {
      console.log(`[BP] manualAward ${pts} to ${uid}`);
      await awardBattlePoints(uid, pts);
    },
    printProboardsThreadData: () => {
      try { console.log("proboards.data('thread'):", (typeof proboards !== 'undefined' && proboards.data) ? proboards.data('thread') : null); } catch(e){console.log(e);}
      try { console.log("pb.data('thread'):", (typeof pb !== 'undefined' && pb.data) ? pb.data('thread') : null); } catch(e){console.log(e);}
      try { const newest = findNewestPostElement(); console.log("Newest post element:", newest); } catch(e){console.log(e);}
      try { console.log("pendingAward:", pendingAward, "awardedPostIds:", Array.from(awardedPostIds)); } catch(e){console.log(e);}
    }
  };

  // --- initialize script ---
  async function initialize() {
    if (DEBUG) console.log("[BP] initialize start");
    await loadResetFlag();
    await updateAllDisplays();
    setupStaffButtons();
    setupCreateCapture();
    setupConfirmationListeners();
    if (DEBUG) console.log("[BP] initialization complete — listening for new posts");
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();


