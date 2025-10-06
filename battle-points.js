(async function () {
  // === FIREBASE INITIALIZATION ===
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

  // --- Load Firebase scripts if not already loaded ---
  if (typeof firebase === "undefined") {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    document.head.appendChild(script);
    await new Promise(r => (script.onload = r));
    const dbscript = document.createElement("script");
    dbscript.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(dbscript);
    await new Promise(r => (dbscript.onload = r));
  }

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const siteKey = "battle";
  const ref = (p) => db.ref(`${siteKey}/${p}`);
  const fetchData = async (p) => (await ref(p).get()).val();
  const setData = async (p, d) => ref(p).set(d);
  const updateData = async (p, d) => ref(p).update(d);

  // --- User Info ---
  const userObj = (typeof proboards !== "undefined" && proboards.data)
    ? proboards.data("user")
    : (typeof pb !== "undefined" && pb.data)
      ? pb.data("user")
      : null;

  if (!userObj || !userObj.id) return;
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;

  // --- Tag configuration (individual values per tag) ---
  const POST_TAG_VALUES = {
    "[PVP]": 2,
    "[BATTLE]": 3,
    "[TRAINING]": 1
  };

  // --- Rank Reset Flag ---
  const resetFlagRef = "rank_reset_flag";
  let battleResetFlag = false;
  async function loadResetFlag() {
    const flag = await fetchData(resetFlagRef);
    battleResetFlag = !!flag;
  }

  // --- Rank calculation (Z→A every 2 points) ---
  function calculateRank(points) {
    if (battleResetFlag) return "Z";
    const step = Math.floor(points / 2);
    let rankCode = 90 - step;
    if (rankCode < 65) rankCode = 65;
    return String.fromCharCode(rankCode);
  }

  // --- Helper to pull user ID from data attributes ---
  function idFromElement($el) {
    let id = $el.attr("data-user-id") ?? $el.attr("data-battle-id");
    if (!id) id = $el.data("user-id");
    return id != null ? String(id) : null;
  }

  // --- Update all visible user displays ---
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
  }
  window.updateBattleDisplays = updateAllDisplays;

  // --- Award points ---
  async function awardBattlePoints(uid, points = 1) {
    const key = `users/${String(uid)}`;
    const cur = (await fetchData(key)) || { points: 0, posts: 0 };
    cur.points = (cur.points || 0) + points;
    cur.posts = (cur.posts || 0) + 1;
    await setData(key, cur);
    await updateAllDisplays();
  }

  // --- Try to get thread SUBJECT, not title ---
  function getThreadSubject() {
    try {
      const threadData = proboards.data("thread");
      if (threadData?.subject) return threadData.subject.toUpperCase().trim();
    } catch (e) {}

    // Try hidden form field if available (on reply/post pages)
    const $input = $("input[name='subject']");
    if ($input.length) return $input.val().toUpperCase().trim();

    // Fallback: try title text (thread view)
    const $title = $("h1.thread-title a, h1.thread-title");
    if ($title.length) return $title.text().toUpperCase().trim();

    return "";
  }

  // --- Handle new posts (detect tag in subject) ---
  async function handleNewPost() {
    const subject = getThreadSubject();
    console.log("📄 Thread subject detected:", subject);
    if (!subject) return;

    let matchedValue = null;
    for (const [tag, value] of Object.entries(POST_TAG_VALUES)) {
      if (subject.includes(tag)) {
        matchedValue = value;
        break;
      }
    }
    if (!matchedValue) return;

    const postAuthorId =
      (typeof proboards !== "undefined" && proboards.data("post"))
        ? String(proboards.data("post").author_id || proboards.data("post").user_id)
        : currentUserId;

    if (postAuthorId) {
      console.log(`🏆 Awarding ${matchedValue} battle points to user ${postAuthorId}`);
      await awardBattlePoints(postAuthorId, matchedValue);
    }
  }

  // --- Detect post creation ---
  function setupPostListener() {
    $(document).on("ajax_success", function (event, data, status, xhr) {
      const url = xhr?.responseURL || "";
      if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create")) {
        setTimeout(handleNewPost, 2000); // allow thread data to update
      }
    });
  }

  // --- Staff edit buttons (same as your current version) ---
  function setupBattleStaffEditButtons() {
    if (!isStaff) return;
    $(".battle-edit-btn").each(function () {
      const $btn = $(this);
      const id = idFromElement($btn);
      if (!id) return;
      if ($btn.data("bound")) return;
      $btn.data("bound", true).show();
      $btn.off("click").on("click", async function () {
        const cur = (await fetchData(`users/${id}`)) || { points: 0, posts: 0 };
        const val = prompt(`Edit Battle Points for user ${id}:`, cur.points);
        if (val === null) return;
        const newVal = parseInt(val);
        if (!isNaN(newVal)) {
          cur.points = newVal;
          await setData(`users/${id}`, cur);
          updateAllDisplays();
        }
      });
    });
  }

  // --- Watch for added battle elements to auto-refresh ---
  const mo = new MutationObserver(() => {
    setTimeout(() => {
      updateAllDisplays();
      setupBattleStaffEditButtons();
    }, 60);
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // --- Initialize everything ---
  async function initialize() {
    await loadResetFlag();
    updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();



