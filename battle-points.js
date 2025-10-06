(async function () {
  // === FIREBASE CONFIG (your project) ===
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

  /* Load Firebase compat libs if needed */
  if (typeof firebase === "undefined") {
    const s1 = document.createElement("script");
    s1.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    document.head.appendChild(s1);
    await new Promise(r => (s1.onload = r));
    const s2 = document.createElement("script");
    s2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(s2);
    await new Promise(r => (s2.onload = r));
  }

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const ROOT = "battle";
  const ref = p => database.ref(`${ROOT}/${p}`);
  const fetchData = async p => (await ref(p).get()).val();
  const setData = async (p, v) => ref(p).set(v);
  const updateRoot = async (obj) => database.ref().update(obj);

  /* user detection (proboards or pb) */
  const pbUser = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("user") :
                 (typeof pb !== "undefined" && pb.data) ? pb.data("user") : null;
  if (!pbUser || !pbUser.id) return;
  const currentUserId = String(pbUser.id);
  const isStaff = !!pbUser.is_staff;

  /* defaults */
  const DEFAULT_TAGS = { "[PVP]": 2, "[BATTLE]": 2 };
  const MAX_RANK_SESSION_POINTS = 50; // A at >=50
  const RANK_CHARS = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");

  /* ensure settings exist */
  async function ensureSettings() {
    const settings = (await fetchData("settings")) || {};
    settings.tags ??= DEFAULT_TAGS;
    settings.lastGlobalRankReset ??= 0;
    // do not overwrite settings if they already exist on DB; only set defaults
    await setData("settings", settings);
    return settings;
  }

  /* calculate rank from session_points: Z for 0, Y for 2, X for 4, ..., A for >=50 */
  function rankFromSessionPoints(sessionPoints = 0) {
    if (sessionPoints >= MAX_RANK_SESSION_POINTS) return "A";
    const step = Math.floor(sessionPoints / 2); // 0 -> 0
    return RANK_CHARS[Math.min(step, RANK_CHARS.length - 1)] || "Z";
  }

  /* Robust ID extraction for elements (matches your HTML) */
  function idFromEl($el) {
    return String(
      $el.attr("data-user-id") ??
      $el.attr("data-battle-points") ??
      $el.attr("data-battle-rank") ??
      $el.attr("data-userid") ??
      $el.data("user-id") ??
      $el.data("userid") ??
      ""
    );
  }

  /* update all visible displays (points + rank) */
  async function updateAllDisplays() {
    try {
      const users = (await fetchData("users")) || {};

      // Amity-style points: .battle-member-points[data-user-id]
      $(".battle-member-points").each(function () {
        const $el = $(this);
        const id = idFromEl($el);
        if (!id) return;
        const user = users[id] || {};
        const pts = user.points ?? 0;
        $el.text(pts);
      });

      // fallback attribute style: [data-battle-points]
      $("[data-battle-points]").each(function () {
        const $el = $(this);
        const idAttr = $el.attr("data-battle-points");
        const id = idAttr ? String(idAttr) : idFromEl($el);
        if (!id) return;
        const user = users[id] || {};
        $el.text(user.points ?? 0);
      });

      // ranks (separate profile field): .battle-member-rank[data-user-id]
      $(".battle-member-rank").each(function () {
        const $el = $(this);
        const id = idFromEl($el);
        if (!id) return;
        const user = users[id] || {};
        // Prefer the DB-stored rank (so after a global reset ranks stay Z until users earn session_points),
        // but fallback to computed rank from session_points if rank not present.
        const rank = user.rank ?? rankFromSessionPoints(user.session_points ?? 0);
        $el.text(rank);
      });

      // fallback attribute style for rank:
      $("[data-battle-rank]").each(function () {
        const $el = $(this);
        const idAttr = $el.attr("data-battle-rank");
        const id = idAttr ? String(idAttr) : idFromEl($el);
        if (!id) return;
        const user = users[id] || {};
        const rank = user.rank ?? rankFromSessionPoints(user.session_points ?? 0);
        $el.text(rank);
      });

      // short current-user displays (if used)
      $(".battle-user-points").each(function () {
        const $el = $(this);
        const pts = (users[currentUserId] || {}).points ?? 0;
        $el.text(pts);
      });
      $(".battle-rank").each(function () {
        const $el = $(this);
        const rank = (users[currentUserId] || {}).rank ?? rankFromSessionPoints((users[currentUserId] || {}).session_points ?? 0);
        $el.text(rank);
      });
    } catch (err) {
      console.error("[BattlePoints] updateAllDisplays error", err);
    }
  }

  // Expose for debugging
  window.updateBattleDisplays = updateAllDisplays;

  /* Award points to user (increments total points and session_points, and updates rank) */
  async function awardPointsToUser(uid, pointsToAdd) {
    const key = `users/${uid}`;
    const cur = (await fetchData(`users/${uid}`)) || {};
    cur.points = (cur.points || 0) + (pointsToAdd || 0);
    cur.session_points = (cur.session_points || 0) + (pointsToAdd || 0);
    cur.rank = (cur.session_points >= MAX_RANK_SESSION_POINTS) ? "A" : rankFromSessionPoints(cur.session_points);
    await setData(key, cur);
    await updateAllDisplays();
  }

  /* Post detection: award points based on tags in thread title (including first post) */
  function setupPostListener() {
    // ensure settings present
    ensureSettings();

    $(document).on("ajax_success", function (event, data, status, xhr) {
      try {
        const url = xhr?.responseURL || "";
        if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create")) {
          setTimeout(handleNewPost, 800);
        }
      } catch (e) { console.error("[BattlePoints] ajax_success error", e); }
    });

    // update on ProBoards pageChange
    $(document).on("pageChange", function () {
      setTimeout(() => {
        updateAllDisplays();
        setupBattleStaffEditButtons();
      }, 250);
    });
  }

  async function handleNewPost() {
    try {
      const settings = (await fetchData("settings")) || {};
      const tags = settings.tags || DEFAULT_TAGS;

      const $title = $("h1.thread-title a");
      if (!$title.length) return;
      const titleText = $title.text().trim().toUpperCase();
      if (!titleText) return;

      // find a matching tag key (case-insensitive)
      const match = Object.keys(tags).find(t => titleText.includes(t.toUpperCase()));
      if (!match) return;
      const pts = parseInt(tags[match]) || 0;
      if (pts <= 0) return;

      await awardPointsToUser(currentUserId, pts);
      console.log(`[BattlePoints] awarded ${pts} points for posting in ${match}`);
    } catch (e) {
      console.error("[BattlePoints] handleNewPost error", e);
    }
  }

  // ----------------------------
  // YOUR EDIT MODAL (VERBATIM) - do not change styling/HTML
  // ----------------------------
  function createEditModalIfMissing() {
    if ($('#battle-edit-modal').length) return;
    const modalHTML = `
    <style>
      #battle-edit-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 320px;
          background: #2b2b2b;
          border: 1px solid #232323;
          border-radius: 4px;
          font-family: 'Roboto', sans-serif;
          color: #fff;
          z-index: 10000;
      }
      #battle-edit-modal .title-bar {
          background-color: #272727;
          background-image: url(https://image.ibb.co/dMFuMc/flower.png);
          background-repeat: no-repeat;
          background-position: center right;
          padding: 8px 12px;
          border-bottom: 1px solid #232323;
          font: bold 9px 'Quattrocento Sans', sans-serif;
          color: #aaa !important;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      #battle-edit-modal .modal-body { padding: 12px; }
      #battle-edit-modal label { font: bold 9px Roboto; letter-spacing: 2px; color: #aaa; text-transform: uppercase; display:block; margin-top:10px; margin-left:2px; }
      #battle-edit-modal input[type="number"] { width:100%; margin-top:5px; margin-bottom:10px; padding:6px; background:#303030; border:1px solid #232323; color:#aaa; border-radius:3px; overflow:hidden; }
      #battle-edit-modal .btn-group { display:flex; gap:6px; margin-bottom:10px; }
      #battle-edit-modal button { border:1px solid #232323; border-radius:3px; background:#272727; text-transform:uppercase; font:bold 12px Roboto; color:#aaa; height:29px; margin-top:5px; line-height:19px; letter-spacing:1px; cursor:pointer; }
      #battle-edit-modal #battle-close-btn { width:100%; background:#232323; margin-left:0px; margin-top:-5px; }
    </style>

    <div id="battle-edit-modal" style="display:none;">
      <div class="title-bar"><span>Edit Battle Points</span></div>
      <div class="modal-body">
        <label>Set New Value:</label>
        <div class="btn-group">
          <input type="number" id="battle-set-value" />
          <button id="battle-set-btn">Set</button>
          <button id="battle-reset-btn">Reset</button>
        </div>
        <label>Add or Remove:</label>
        <div class="btn-group">
          <input type="number" id="battle-change-value" />
          <button id="battle-add-btn">Add</button>
          <button id="battle-remove-btn">Remove</button>
        </div>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $('body').append(modalHTML);
  }

  // staff-only edit button wiring (Amity-style)
  function setupBattleStaffEditButtons() {
    createEditModalIfMissing();
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      if ($btn.data("bound")) {
        $btn.show();
        return;
      }
      const memberId = String($btn.data("user-id"));
      if (!memberId) return;

      $btn.data("bound", true);
      $btn.show();
      $btn.off("click").on("click", async function () {
        // show modal and populate
        $('#battle-edit-modal').show();
        let memberData = (await fetchData(`users/${memberId}`)) || { points: 0, session_points: 0, rank: "Z" };

        $('#battle-set-value').val(memberData.points || 0);
        $('#battle-change-value').val('');

        // SET -> set both total points and session_points to the provided value (keeps rank in sync)
        $('#battle-set-btn').off().on('click', async () => {
          const newVal = parseInt($('#battle-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            memberData.session_points = newVal; // keep session in sync after manual set
            memberData.rank = (memberData.session_points >= MAX_RANK_SESSION_POINTS) ? "A" : rankFromSessionPoints(memberData.session_points);
            await setData(`users/${memberId}`, memberData);
            await updateAllDisplays();
            $('#battle-edit-modal').hide();
          }
        });

        // RESET -> set both points/session_points to 0 and rank Z
        $('#battle-reset-btn').off().on('click', async () => {
          memberData.points = 0;
          memberData.session_points = 0;
          memberData.rank = "Z";
          await setData(`users/${memberId}`, memberData);
          await updateAllDisplays();
          $('#battle-edit-modal').hide();
        });

        // ADD -> add to both total and session_points
        $('#battle-add-btn').off().on('click', async () => {
          const add = parseInt($('#battle-change-value').val());
          if (!isNaN(add)) {
            memberData.points = (memberData.points || 0) + add;
            memberData.session_points = (memberData.session_points || 0) + add;
            memberData.rank = (memberData.session_points >= MAX_RANK_SESSION_POINTS) ? "A" : rankFromSessionPoints(memberData.session_points);
            await setData(`users/${memberId}`, memberData);
            await updateAllDisplays();
            $('#battle-edit-modal').hide();
          }
        });

        // REMOVE -> subtract from both safely
        $('#battle-remove-btn').off().on('click', async () => {
          const rem = parseInt($('#battle-change-value').val());
          if (!isNaN(rem)) {
            memberData.points = Math.max(0, (memberData.points || 0) - rem);
            memberData.session_points = Math.max(0, (memberData.session_points || 0) - rem);
            memberData.rank = (memberData.session_points >= MAX_RANK_SESSION_POINTS) ? "A" : rankFromSessionPoints(memberData.session_points);
            await setData(`users/${memberId}`, memberData);
            await updateAllDisplays();
            $('#battle-edit-modal').hide();
          }
        });

        $('#battle-close-btn').off().on('click', () => {
          $('#battle-edit-modal').hide();
        });
      });
    });
  }

  /* -------------------------
     ADMIN "Battle Point Menu" (uses same visual style)
     — Tag list UI + global rank reset with warning
     ------------------------- */
  function createAdminModalIfMissing() {
    if ($('#battle-admin-modal').length) return;

    const adminStyle = `
    <style>
      #battle-admin-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 360px;
          background: #2b2b2b;
          border: 1px solid #232323;
          border-radius: 4px;
          font-family: 'Roboto', sans-serif;
          color: #fff;
          z-index: 10000;
      }
      #battle-admin-modal .title-bar {
          background-color: #272727;
          background-image: url(https://image.ibb.co/dMFuMc/flower.png);
          background-repeat: no-repeat;
          background-position: center right;
          padding: 8px 12px;
          border-bottom: 1px solid #232323;
          font: bold 9px 'Quattrocento Sans', sans-serif;
          color: #aaa !important;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      #battle-admin-modal .modal-body { padding: 12px; }
      #battle-admin-modal label { font: bold 9px Roboto; letter-spacing: 2px; color: #aaa; text-transform: uppercase; display:block; margin-top:10px; margin-left:2px; }
      #battle-admin-modal input[type="text"], #battle-admin-modal input[type="number"], #battle-admin-modal textarea { width:100%; margin-top:5px; margin-bottom:10px; padding:6px; background:#303030; border:1px solid #232323; color:#aaa; border-radius:3px; overflow:hidden; }
      #battle-admin-modal .btn-group { display:flex; gap:6px; margin-bottom:10px; }
      #battle-admin-modal button { border:1px solid #232323; border-radius:3px; background:#272727; text-transform:uppercase; font:bold 12px Roboto; color:#aaa; height:29px; margin-top:5px; line-height:19px; letter-spacing:1px; cursor:pointer; }
      #battle-admin-modal .tag-list { max-height:180px; overflow-y:auto; margin-bottom:8px; border:1px solid #232323; padding:6px; border-radius:3px; background:#262626; }
    </style>
    `;

    const adminHTML = `
    <div id="battle-admin-modal" style="display:none;">
      <div class="title-bar"><span>Battle Point Menu</span></div>
      <div class="modal-body">
        <label>Global Rank Reset (ranks -> Z, points remain)</label>
        <div class="btn-group">
          <button id="battle-global-reset" style="flex:1">GLOBAL RESET</button>
        </div>

        <label>Tags (one per row):</label>
        <div class="tag-list"></div>
        <div class="btn-group">
          <button id="battle-add-tag">Add Tag</button>
          <button id="battle-save-tags">Save Tags</button>
        </div>

        <button id="battle-admin-close">Close</button>
      </div>
    </div>`;

    $("body").append(adminStyle + adminHTML);
  }

  /* open admin modal and populate tag UI */
  async function openBattlePointMenu() {
    if (!isStaff) return;
    createAdminModalIfMissing();
    const $modal = $("#battle-admin-modal");
    const $list = $modal.find(".tag-list");
    $list.empty();

    const settings = (await fetchData("settings")) || {};
    const tags = settings.tags || DEFAULT_TAGS;

    for (const [tag, val] of Object.entries(tags)) {
      const row = $(`<div class="tag-row" style="display:flex; gap:6px; margin-bottom:6px;">
        <input class="battle-tag-text" type="text" value="${tag}" style="flex:2;" />
        <input class="battle-tag-val" type="number" value="${val}" style="width:80px;" />
        <button class="battle-remove-row" style="width:36px;">X</button>
      </div>`);
      $list.append(row);
      row.find(".battle-remove-row").on("click", () => row.remove());
    }

    // add tag handler
    $modal.find("#battle-add-tag").off().on("click", () => {
      const row = $(`<div class="tag-row" style="display:flex; gap:6px; margin-bottom:6px;">
        <input class="battle-tag-text" type="text" value="[NEW]" style="flex:2;" />
        <input class="battle-tag-val" type="number" value="1" style="width:80px;" />
        <button class="battle-remove-row" style="width:36px;">X</button>
      </div>`);
      $list.append(row);
      row.find(".battle-remove-row").on("click", () => row.remove());
    });

    // save tag config
    $modal.find("#battle-save-tags").off().on("click", async () => {
      const newTags = {};
      $list.find(".tag-row").each(function () {
        const t = $(this).find(".battle-tag-text").val().trim().toUpperCase();
        const v = parseInt($(this).find(".battle-tag-val").val()) || 0;
        if (t && t.startsWith("[") && t.endsWith("]")) newTags[t] = v;
      });
      const settingsToSave = (await fetchData("settings")) || {};
      settingsToSave.tags = newTags;
      await setData("settings", settingsToSave);
      alert("Tags saved.");
      $modal.hide();
    });

    // global reset with preview/warning
    $modal.find("#battle-global-reset").off().on("click", async () => {
      // preview count
      const snapshot = await database.ref(`${ROOT}/users`).get();
      const users = snapshot.val() || {};
      const count = Object.keys(users).length;
      const confirmMsg = `⚠️ GLOBAL RESET WARNING\nThis will reset RANK to Z for ${count} user(s). TOTAL points will NOT be changed.\n\nDo you want to continue?`;
      const proceed = confirm(confirmMsg);
      if (!proceed) return;

      // Build single update object to keep operations efficient
      const updates = {};
      for (const uid of Object.keys(users)) {
        updates[`${ROOT}/users/${uid}/session_points`] = 0;
        updates[`${ROOT}/users/${uid}/rank`] = "Z";
      }
      updates[`${ROOT}/settings/lastGlobalRankReset`] = Date.now();

      await updateRoot(updates);
      alert(`Global rank reset complete for ${count} user(s).`);
      $modal.hide();
      await updateAllDisplays();
    });

    $modal.find("#battle-admin-close").off().on("click", () => $modal.hide());
    $modal.show();
  }

  // expose admin open so you can place a staff-only button on any page:
  window.openBattlePointMenu = openBattlePointMenu;

  // ----------------------------
  // Mutation observer to handle late-inserted profile elements
  // ----------------------------
  const mo = new MutationObserver((mutations) => {
    let found = false;
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes || [])) {
        if (n.nodeType !== 1) continue;
        try {
          if (n.matches && (n.matches(".battle-member-points") || n.matches(".battle-member-rank") || n.matches(".battle-edit-btn") ||
              n.querySelector && (n.querySelector(".battle-member-points") || n.querySelector(".battle-member-rank") || n.querySelector(".battle-edit-btn")) )) {
            found = true;
            break;
          }
        } catch (e) {}
      }
      if (found) break;
    }
    if (found) {
      setTimeout(() => {
        updateAllDisplays();
        setupBattleStaffEditButtons();
      }, 80);
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  /* initialize */
  async function initialize() {
    await ensureSettings();
    await updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();

