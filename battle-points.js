/* Battle Points — Full script
   - Put on GitHub and load in ProBoards like your other scripts.
   - Uses Realtime DB REST via Firebase SDK (compat).
   - Ranks = 1 letter per 2 session points (Z->A).
   - Session points based on settings.lastReset (epoch reset).
   - Per-tag values stored in settings/threadTags and editable by staff modal.
*/

(async () => {
  // ===== CONFIG =====
  const DEBUG = false; // set true to see console debug logs
  // Your Firebase config (this is your Battle project)
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

  // ===== load firebase compat libs if missing =====
  if (typeof firebase === "undefined") {
    if (DEBUG) console.log("[BP] loading firebase compat libs...");
    const s1 = document.createElement("script");
    s1.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    document.head.appendChild(s1);
    await new Promise(r => (s1.onload = r));
    const s2 = document.createElement("script");
    s2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(s2);
    await new Promise(r => (s2.onload = r));
    if (DEBUG) console.log("[BP] firebase libs loaded");
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    if (DEBUG) console.log("[BP] firebase.initializeApp() OK");
  } else if (DEBUG) console.log("[BP] firebase already initialized");

  const db = firebase.database();
  const ROOT = "battle"; // namespacing root

  // ===== DB helpers =====
  const ref = (p) => db.ref(`${ROOT}/${p}`);
  const fetchData = async (p) => {
    try {
      const snap = await ref(p).get();
      const val = snap.val();
      if (DEBUG) console.log(`[BP] fetchData ${p} ->`, val);
      return val;
    } catch (e) {
      console.error("[BP] fetchData error", p, e);
      return null;
    }
  };
  const setData = async (p, d) => {
    try {
      await ref(p).set(d);
      if (DEBUG) console.log(`[BP] setData ${p} <=`, d);
      return true;
    } catch (e) {
      console.error("[BP] setData error", p, e);
      return false;
    }
  };
  const patchData = async (p, d) => {
    try {
      await ref(p).update(d);
      if (DEBUG) console.log(`[BP] patchData ${p} <=`, d);
      return true;
    } catch (e) {
      console.error("[BP] patchData error", p, e);
      return false;
    }
  };

  // ===== ProBoards user info =====
  const userObj = (typeof proboards !== "undefined" && proboards.data)
    ? proboards.data("user")
    : (typeof pb !== "undefined" && pb.data)
      ? pb.data("user")
      : null;
  if (!userObj || !userObj.id) {
    if (DEBUG) console.log("[BP] no logged-in user, aborting.");
    return;
  }
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;
  if (DEBUG) console.log("[BP] currentUserId:", currentUserId, "isStaff:", isStaff);

  // ===== Defaults and seeding =====
  async function ensureSettings() {
    let settings = await fetchData("settings");
    if (!settings) {
      settings = {
        threadTags: { "[PVP]": 2, "[BATTLE]": 1 }, // default tag values
        lastReset: Date.now()
      };
      await setData("settings", settings);
      if (DEBUG) console.log("[BP] seeded default settings", settings);
    }
    return settings;
  }

  // ===== Get user record, maintain session_points/last_reset =====
  async function getUserRaw(uid) {
    const raw = await fetchData(`users/${uid}`);
    return raw || null;
  }

  async function getUserForAward(uid) {
    const settings = await ensureSettings();
    let u = await getUserRaw(uid) || {};
    u.username ??= "";
    u.display_name ??= "";
    u.points ??= 0; // lifetime points
    u.session_points ??= 0; // points earned since last_reset
    u.last_reset ??= 0;

    // if user's last_reset is older than global lastReset, their session_points should be treated as 0
    if (!u.last_reset || u.last_reset < settings.lastReset) {
      // bring them up-to-date only when we next write; do not mass-write everyone
      u.session_points = 0;
      u.last_reset = settings.lastReset; // set to epoch so future awards in same era accrue
      // we won't write here; we will write when awarding to avoid mass writes
    }
    return { user: u, settings };
  }

  // compute rank letter from session points (2 pts per letter)
  function rankFromSessionPoints(sessionPoints) {
    const steps = Math.floor((sessionPoints || 0) / 2); // 2 points per rank
    const alpha = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
    const idx = Math.min(steps, alpha.length - 1);
    return alpha[idx];
  }

  // ===== Awarding logic (avoids double-award via awarded_posts) =====
  async function hasPostBeenAwarded(postId) {
    if (!postId) return false;
    const val = await fetchData(`awarded_posts/${postId}`);
    return !!val;
  }

  async function markPostAwarded(postId) {
    if (!postId) return;
    await setData(`awarded_posts/${postId}`, true);
  }

  async function awardToUser(uid, amount, postId) {
    if (!uid || !amount || amount <= 0) return false;
    // load user and settings
    const { user: u, settings } = await getUserForAward(uid);
    // if user's last_reset < settings.lastReset, zero their session_points and set last_reset to settings.lastReset
    if (!u.last_reset || u.last_reset < settings.lastReset) {
      u.session_points = 0;
      u.last_reset = settings.lastReset;
    }
    u.points = (u.points || 0) + amount;
    u.session_points = (u.session_points || 0) + amount;
    u.rank = rankFromSessionPoints(u.session_points);
    u.username ??= u.username;
    u.display_name ??= u.display_name;
    // write back
    await setData(`users/${uid}`, u);
    if (postId) await markPostAwarded(postId);
    if (DEBUG) console.log(`[BP] awarded ${amount} to ${uid} → total:${u.points} session:${u.session_points} rank:${u.rank}`);
    await updateAllDisplays();
    return true;
  }

  // ===== Subject detection (use document.title for your theme) =====
  function getThreadSubject() {
    const raw = document.title || "";
    // removes " | BoardName" if present
    return raw.split("|")[0].trim().toUpperCase();
  }

  // ===== Tag lookup (reads from settings/threadTags) =====
  async function getTagValueForSubject(subject) {
    const settings = await ensureSettings();
    const tags = settings.threadTags || {};
    for (const rawTag of Object.keys(tags)) {
      if (!rawTag) continue;
      const tagUpper = rawTag.toUpperCase();
      if (subject.includes(tagUpper)) {
        const v = Number(tags[rawTag]) || 0;
        return { tag: rawTag, value: v };
      }
    }
    return null;
  }

  // ===== Display updates (mini-profile / member list) =====
  async function updateAllDisplays() {
    // current user
    const me = (await getUserRaw(currentUserId)) || { points: 0, session_points: 0, rank: rankFromSessionPoints(0) };
    $(".battle-user-points").text(`${me.points ?? 0}`);
    $(".battle-rank[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;
      const member = (await getUserRaw(memberId)) || { points: 0, session_points: 0 };
      $el.text(rankFromSessionPoints(member.session_points || 0));
    });
    $(".battle-member-points[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;
      const member = (await getUserRaw(memberId)) || { points: 0 };
      $el.text(`${member.points ?? 0}`);
    });
    $(".battle-member-rank[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;
      const member = (await getUserRaw(memberId)) || { session_points: 0 };
      $el.text(rankFromSessionPoints(member.session_points || 0));
    });
    if (DEBUG) console.log("[BP] displays updated");
  }

  // Expose for console testing
  window.BattlePoints = {
    updateAllDisplays,
    awardToUser,
    getThreadSubject,
    getSettings: ensureSettings
  };

  // ===== Award when post appears in thread view =====
  // extract post id if element has an id like "post-123"
  function extractPostIdFromNode(node) {
    try {
      const el = node instanceof jQuery ? node[0] : node;
      if (!el || !el.getAttribute) return null;
      const id = el.getAttribute("id") || el.id || "";
      const m = id.match(/post-(\d+)/i);
      return m ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  // find poster user id from common DOM patterns; fallback to currentUserId
  function extractPosterIdFromPostNode(node) {
    const $node = $(node);
    // Try common ProBoards user link data attributes
    // adapt as needed for your theme if different
    // 1) data-user-id on user link
    const userLink = $node.find("[data-user-id],[data-userid],[data-user]").first();
    if (userLink.length) {
      return String(userLink.data("user-id") || userLink.data("userid") || userLink.data("user") || userLink.attr("data-user-id") || userLink.attr("data-userid") || userLink.attr("data-user"));
    }
    // 2) anchor with href to /user/ or .user-link
    const a = $node.find("a.user-link, a[href*='/user/'], a[href*='/member/']").first();
    if (a.length) {
      const uid = a.attr("data-user-id") || a.attr("data-userid") || a.data("user-id") || a.data("userid");
      if (uid) return String(uid);
      // sometimes URL contains id or username; skip complex parsing - fallback below
    }
    // fallback to current user (safe but will misassign if post is by someone else)
    return currentUserId;
  }

  async function processAddedPostNode(node) {
    // only run when on a thread view where document.title contains subject
    const subject = getThreadSubject();
    if (!subject) {
      if (DEBUG) console.log("[BP] no subject in document.title; skipping");
      return;
    }

    // find tag and its value
    const tagMatch = await getTagValueForSubject(subject);
    if (!tagMatch || !tagMatch.value) {
      if (DEBUG) console.log("[BP] no configured tag matched subject:", subject);
      return;
    }
    const value = tagMatch.value;

    const postId = extractPostIdFromNode(node);
    if (!postId) {
      if (DEBUG) console.log("[BP] added node has no post id, skipping");
      return;
    }

    // avoid awarding same post twice
    const already = await hasPostBeenAwarded(postId);
    if (already) {
      if (DEBUG) console.log("[BP] post already awarded", postId);
      return;
    }

    const posterId = extractPosterIdFromPostNode(node) || currentUserId;
    if (!posterId) {
      if (DEBUG) console.log("[BP] no poster id found, skipping");
      return;
    }

    // award
    await awardToUser(posterId, value, postId);
    if (DEBUG) console.log(`[BP] awarded ${value} for post ${postId} to ${posterId} (tag ${tagMatch.tag})`);
  }

  // ===== MutationObserver that watches for new posts appended to thread view =====
  // We only award when posts are inserted into the thread page, not when on reply form page
  const mutationObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes || [])) {
        if (n.nodeType !== 1) continue;
        // If node itself is a post or contains a post child
        const $n = $(n);
        let postNode = null;
        if ($n.is(".post") || $n.hasClass("post")) postNode = $n;
        else {
          const found = $n.find(".post").first();
          if (found.length) postNode = found;
        }
        if (postNode && postNode.length) {
          // process after tiny delay to ensure DOM settled
          setTimeout(() => processAddedPostNode(postNode), 500);
        }
      }
    }
  });

  // ===== Staff settings modal (edit tag values and reset epochs) =====
  function createSettingsModalIfNeeded() {
    if ($("#bp-settings-modal").length) return;
    const html = `
    <style>
      #bp-settings-modal { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); width:420px; background:#222; color:#ddd; border:1px solid #111; z-index:100000; border-radius:6px; font-family:Roboto, sans-serif; display:none; }
      #bp-settings-modal .header { padding:10px; background:#2b2b2b; border-bottom:1px solid #111; font-weight:bold; text-transform:uppercase; color:#aaa; }
      #bp-settings-modal .body { padding:12px; max-height:380px; overflow:auto; }
      #bp-settings-modal input[type="text"], #bp-settings-modal input[type="number"] { width:100%; padding:6px; background:#303030; border:1px solid #222; color:#ddd; border-radius:3px; margin-bottom:8px; }
      #bp-settings-modal .row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
      #bp-settings-modal .row .tag { width:64%; }
      #bp-settings-modal .row .val { width:26%; }
      #bp-settings-modal .row button { width:10%; }
      #bp-settings-modal .footer { padding:8px; display:flex; justify-content:space-between; gap:8px; }
      #bp-float-btn { position:fixed; right:12px; bottom:12px; z-index:99999; background:#2b2b2b; border:1px solid #111; color:#ddd; padding:8px 10px; border-radius:6px; cursor:pointer; }
    </style>
    <div id="bp-settings-modal">
      <div class="header">Battle Settings</div>
      <div class="body">
        <div id="bp-tags-list"></div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <input id="bp-new-tag" placeholder="[TAG]" type="text" />
          <input id="bp-new-val" placeholder="points" type="number" />
          <button id="bp-add-tag">Add</button>
        </div>
        <div style="margin-top:12px;color:#f99">Global reset will reset session-based ranks only (not lifetime points)</div>
      </div>
      <div class="footer">
        <div id="bp-settings-status"></div>
        <div>
          <button id="bp-reset-epoch" style="background:#900;color:#fff;">Reset Ranks</button>
          <button id="bp-close-settings">Close</button>
        </div>
      </div>
    </div>`;
    $("body").append(html);
  }

  async function renderTagEditor() {
    const settings = await ensureSettings();
    const tags = settings.threadTags || {};
    const $list = $("#bp-tags-list").empty();
    Object.keys(tags).forEach(k => {
      const v = tags[k];
      const $row = $(`<div class="row"></div>`);
      $row.append(`<input class="tag" value="${k}" readonly style="background:#222;color:#ddd;border:1px solid #444;padding:6px;border-radius:3px;width:64%;">`);
      $row.append(`<input class="val" type="number" value="${v}" style="width:26%;">`);
      const $del = $(`<button class="del">Del</button>`);
      $row.append($del);
      $list.append($row);
      $row.find(".val").on("change", async function () {
        const nv = parseInt($(this).val()) || 0;
        const updates = {};
        updates[`settings/threadTags/${encodeKey(k)}`] = nv;
        await patchData("", updates);
        $("#bp-settings-status").text(`Saved ${k} => ${nv}`);
        setTimeout(()=> $("#bp-settings-status").text(""), 2200);
        renderTagEditor();
      });
      $del.on("click", async () => {
        if (!confirm(`Delete tag ${k}?`)) return;
        const updates = {};
        updates[`settings/threadTags/${encodeKey(k)}`] = null;
        await patchData("", updates);
        $("#bp-settings-status").text(`Deleted ${k}`);
        setTimeout(()=> $("#bp-settings-status").text(""), 2200);
        renderTagEditor();
      });
    });
  }

  function encodeKey(k) {
    return String(k).replace(/\./g,'%2E').replace(/\#/g,'%23').replace(/\$/g,'%24').replace(/\[/g,'%5B').replace(/\]/g,'%5D');
  }

  async function openSettingsModal() {
    createSettingsModalIfNeeded();
    renderTagEditor();
    $("#bp-settings-modal").show();
    $("#bp-add-tag").off("click").on("click", async () => {
      const raw = $("#bp-new-tag").val().trim();
      const val = Number($("#bp-new-val").val()) || 0;
      if (!raw || !raw.startsWith("[") || !raw.endsWith("]")) {
        return $("#bp-settings-status").text("Tag must be bracketed like [PVP]");
      }
      const updates = {};
      updates[`settings/threadTags/${encodeKey(raw)}`] = val;
      await patchData("", updates);
      $("#bp-settings-status").text(`Added ${raw}=>${val}`);
      setTimeout(()=> $("#bp-settings-status").text(""), 2200);
      $("#bp-new-tag").val(""); $("#bp-new-val").val("");
      renderTagEditor();
    });

    $("#bp-reset-epoch").off("click").on("click", async () => {
      if (!confirm("Set a new epoch reset? This will make session points considered zero until users post again.")) return;
      const now = Date.now();
      await patchData("", { "settings/lastReset": now });
      // optional: mark rank_reset_flag too for legacy clients
      await setData("rank_reset_flag", true);
      $("#bp-settings-status").text("Global reset applied.");
      setTimeout(()=> $("#bp-settings-status").text(""), 2200);
      await updateAllDisplays();
    });

    $("#bp-close-settings").off("click").on("click", () => $("#bp-settings-modal").hide());
  }

  function ensureSettingsTrigger() {
    if (!isStaff) return;
    const $btn = $("#battle-settings-btn");
    if ($btn.length) {
      $btn.off("click").on("click", (e)=>{ e.preventDefault(); openSettingsModal(); });
      return;
    }
    if ($("#bp-float-btn").length) return;
    const $float = $(`<button id="bp-float-btn" title="Battle Settings">⚙️ BP</button>`);
    $("body").append($float);
    $float.on("click", openSettingsModal);
  }

  // convenience patch helper for settings
  async function patchData(root, dataObj) {
    // use database.ref().update via the root path ('' means ROOT)
    const updates = {};
    for (const k of Object.keys(dataObj)) updates[k] = dataObj[k];
    await db.ref(`${ROOT}`).update(dataObj);
    if (DEBUG) console.log("[BP] patchData root update", dataObj);
  }

  // ===== Setup mutation observer, event listeners and initialization =====
  function startObservers() {
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    if (DEBUG) console.log("[BP] MutationObserver watching document.body");
  }

  // fallback ajax success hook to catch some themes
  function setupAjaxHook() {
    try {
      $(document).on("ajax_success", function (event, data, status, xhr) {
        const url = xhr?.responseURL || "";
        if (DEBUG) console.log("[BP] ajax_success:", url);
        // if we return to thread view, ensure displays update
        setTimeout(updateAllDisplays, 600);
      });
    } catch (e) {
      if (DEBUG) console.log("[BP] ajax_success not available", e);
    }
  }

  // ===== Initialize =====
  async function initialize() {
    if (DEBUG) console.log("[BP] initialize");
    await ensureSettings();
    await loadResetFlag(); // loads 'rank_reset_flag' (legacy)
    await updateAllDisplays();
    startObservers();
    setupAjaxHook();
    ensureSettingsTrigger();
    if (DEBUG) console.log("[BP] initialized");
  }

  // load rank_reset_flag (legacy)
  async function loadResetFlag() {
    const f = await fetchData("rank_reset_flag");
    battleResetFlag = !!f;
    if (DEBUG) console.log("[BP] loaded rank_reset_flag:", battleResetFlag);
  }

  // start
  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));

})();



