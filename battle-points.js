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

  // load firebase compat libs if not present
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
  const db = firebase.database();
  const ROOT = "battle";

  // --- helpers ---
  const ref = (p) => db.ref(`${ROOT}/${p}`);
  const fetch = async (p) => (await ref(p).get()).val();
  const set = async (p, v) => ref(p).set(v);
  const update = async (p, v) => ref(p).update(v);

  // detect user object (support proboards or pb variable)
  const userObj = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("user") :
                  (typeof pb !== "undefined" && pb.data) ? pb.data("user") : null;
  if (!userObj || !userObj.id) return;
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;

  // settings defaults
  const DEFAULT_TAGS = { "[PVP]": 2, "[BATTLE]": 2 };

  // --- rank calculation ---
  // Z = 0 points, Y = 2, X = 4, ... A at 50+, cap at A
  function calculateRank(points) {
    if ((points || 0) >= 50) return "A";
    const step = Math.floor((points || 0) / 2); // 0 -> 0, 2->1, 4->2
    return String.fromCharCode(90 - step); // 90='Z'
  }

  // --- initialize settings if missing ---
  async function ensureSettings() {
    const settings = (await fetch("settings")) || {};
    settings.tags ??= DEFAULT_TAGS;
    settings.lastGlobalRankReset ??= 0;
    await set("settings", settings);
    return settings;
  }

  // --- update displays (robust selectors: matches Amity style) ---
  async function updateAllDisplays() {
    try {
      const users = (await fetch("users")) || {};
      // amity-style points element:
      $(".battle-member-points[data-user-id]").each(function () {
        const $el = $(this);
        const id = String($el.data("user-id"));
        const pts = users?.[id]?.points ?? 0;
        $el.text(`${pts}`);
      });
      // alternate attribute fallback
      $("[data-battle-points]").each(function () {
        const $el = $(this);
        const idAttr = $el.attr("data-battle-points");
        const id = idAttr ? String(idAttr) : String($el.data("user-id") || "");
        if (!id) return;
        const pts = users?.[id]?.points ?? 0;
        $el.text(`${pts}`);
      });

      // rank displays (separate place on profile)
      $(".battle-member-rank[data-user-id]").each(function () {
        const $el = $(this);
        const id = String($el.data("user-id"));
        const pts = users?.[id]?.points ?? 0;
        $el.text(calculateRank(pts));
      });
      $("[data-battle-rank]").each(function () {
        const $el = $(this);
        const idAttr = $el.attr("data-battle-rank");
        const id = idAttr ? String(idAttr) : String($el.data("user-id") || "");
        if (!id) return;
        const pts = users?.[id]?.points ?? 0;
        $el.text(calculateRank(pts));
      });

      // short current-user displays if present
      $(".battle-user-points").text(users?.[currentUserId]?.points ?? 0);
      $(".battle-rank").text(calculateRank(users?.[currentUserId]?.points ?? 0));
    } catch (err) {
      console.error("[BattlePoints] updateAllDisplays error:", err);
    }
  }

  // expose for debugging
  window.updateBattleDisplays = updateAllDisplays;

  // --- award points for a user (adds points and updates stored rank only if below cap) ---
  async function awardPointsToUser(uid, pointsToAdd) {
    const key = `users/${uid}`;
    const cur = (await fetch(key)) || {};
    cur.points = (cur.points || 0) + (pointsToAdd || 0);
    // update rank: if already A (>=50) keep A; otherwise recalc
    cur.rank = ((cur.points || 0) >= 50) ? "A" : calculateRank(cur.points || 0);
    await set(key, cur);
    await updateAllDisplays();
  }

  // --- detect posting and award points per tag ---
  function setupPostListener() {
    // ensure settings exist first
    ensureSettings();

    // ProBoards AJAX hook (fire on successful post)
    $(document).on("ajax_success", async function (event, data, status, xhr) {
      try {
        const url = xhr?.responseURL || "";
        if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create")) {
          // short delay for DOM updates
          setTimeout(handleNewPost, 700);
        }
      } catch (e) {
        console.error("[BattlePoints] ajax_success error", e);
      }
    });

    // update displays on page change
    $(document).on("pageChange", function () {
      setTimeout(() => {
        updateAllDisplays();
        setupBattleStaffEditButtons();
      }, 250);
    });
  }

  async function handleNewPost() {
    try {
      const settings = await ensureSettings();
      const tags = settings.tags || DEFAULT_TAGS;

      const $title = $("h1.thread-title a");
      if (!$title.length) return;
      const title = $title.text().trim().toUpperCase();
      if (!title) return;

      // find first matching tag key (case-insensitive)
      const match = Object.keys(tags).find(t => title.includes(t.toUpperCase()));
      if (!match) return;

      const points = parseInt(tags[match]) || 0;
      if (points <= 0) return;

      // award to poster (currentUserId)
      await awardPointsToUser(currentUserId, points);
      console.log(`[BattlePoints] awarded ${points} for posting in ${match}`);
    } catch (e) {
      console.error("[BattlePoints] handleNewPost error", e);
    }
  }

  // ----------------------------
  // === YOUR EDIT MODAL (VERBATIM) ===
  // DO NOT CHANGE — this is exactly the styling/HTML you provided
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
  // === end verbatim block ===

  // ----------------------------
  // === ADMIN "Battle Point Menu" MODAL (uses same styling you provided) ===
  function createAdminModalIfMissing() {
    if ($('#battle-admin-modal').length) return;

    // reuse exact same style rules but scoped to #battle-admin-modal
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
      #battle-admin-modal .tag-list { max-height:180px; overflow-y:auto; margin-bottom:8px; border:1px solid #232323; padding:6px; border-radius:3px; background:#262626;}
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

    $('body').append(adminStyle + adminHTML);
  }

  // open admin modal (build tag UI inside)
  async function openBattleAdminModal() {
    if (!isStaff) return;
    createAdminModalIfMissing();

    const $modal = $("#battle-admin-modal");
    const $list = $modal.find(".tag-list");
    $list.empty();

    const settings = (await fetch("settings")) || {};
    const tags = settings.tags || DEFAULT_TAGS;

    // render existing tags
    for (const [tag, val] of Object.entries(tags)) {
      const row = $(`<div class="tag-row" style="display:flex; gap:6px; margin-bottom:6px;">
        <input class="battle-tag-text" type="text" value="${tag}" style="flex:2;" />
        <input class="battle-tag-val" type="number" value="${val}" style="width:80px;" />
        <button class="battle-remove-row" style="width:36px;">X</button>
      </div>`);
      $list.append(row);
    }

    // handlers
    $modal.find("#battle-add-tag").off().on("click", () => {
      const row = $(`<div class="tag-row" style="display:flex; gap:6px; margin-bottom:6px;">
        <input class="battle-tag-text" type="text" value="[NEW]" style="flex:2;" />
        <input class="battle-tag-val" type="number" value="1" style="width:80px;" />
        <button class="battle-remove-row" style="width:36px;">X</button>
      </div>`);
      $list.append(row);
      row.find(".battle-remove-row").on("click", () => row.remove());
    });

    $modal.find(".battle-remove-row").off().on("click", function () {
      $(this).closest(".tag-row").remove();
    });

    $modal.find("#battle-save-tags").off().on("click", async () => {
      const newTags = {};
      $list.find(".tag-row").each(function () {
        const t = $(this).find(".battle-tag-text").val().trim().toUpperCase();
        const v = parseInt($(this).find(".battle-tag-val").val()) || 0;
        if (t && t.startsWith("[") && t.endsWith("]")) newTags[t] = v;
      });
      const settingsToSave = (await fetch("settings")) || {};
      settingsToSave.tags = newTags;
      await set("settings", settingsToSave);
      alert("Tags saved.");
      $modal.hide();
    });

    $modal.find("#battle-global-reset").off().on("click", async () => {
      const ok = confirm("Are you sure? This will reset everyone's RANK to Z. Points will NOT be changed.");
      if (!ok) return;

      // Efficient one-shot update: build updates object
      const snapshot = await db.ref(`${ROOT}/users`).get();
      const users = snapshot.val() || {};
      const updates = {};
      for (const uid of Object.keys(users)) {
        updates[`${ROOT}/users/${uid}/rank`] = "Z";
      }
      // also store lastGlobalRankReset timestamp
      updates[`${ROOT}/settings/lastGlobalRankReset`] = Date.now();
      await db.ref().update(updates);

      alert("All ranks reset to Z.");
      $modal.hide();
      await updateAllDisplays();
    });

    $modal.find("#battle-admin-close").off().on("click", () => $modal.hide());

    $modal.show();
  }

  // --- staff edit button wiring (Amity-style behavior) ---
  async function setupBattleStaffEditButtons() {
    createEditModalIfMissing(); // ensure edit modal exists
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
        // open edit modal and populate
        $('#battle-edit-modal').show();
        const memberData = (await fetch(`users/${memberId}`)) || { points: 0 };
        const currentVal = memberData.points || 0;

        $('#battle-set-value').val(currentVal);
        $('#battle-change-value').val('');

        // set handler
        $('#battle-set-btn').off().on('click', async () => {
          const newVal = parseInt($('#battle-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            memberData.rank = (memberData.points >= 50) ? "A" : calculateRank(memberData.points);
            await set(`users/${memberId}`, memberData);
            await updateAllDisplays();
            $('#battle-edit-modal').hide();
          }
        });

        $('#battle-reset-btn').off().on('click', async () => {
          memberData.points = 0;
          memberData.rank = "Z";
          await set(`users/${memberId}`, memberData);
          await updateAllDisplays();
          $('#battle-edit-modal').hide();
        });

        $('#battle-add-btn').off().on('click', async () => {
          const add = parseInt($('#battle-change-value').val());
          if (!isNaN(add)) {
            memberData.points = (memberData.points || 0) + add;
            memberData.rank = (memberData.points >= 50) ? "A" : calculateRank(memberData.points);
            await set(`users/${memberId}`, memberData);
            await updateAllDisplays();
            $('#battle-edit-modal').hide();
          }
        });

        $('#battle-remove-btn').off().on('click', async () => {
          const rem = parseInt($('#battle-change-value').val());
          if (!isNaN(rem)) {
            memberData.points = Math.max(0, (memberData.points || 0) - rem);
            memberData.rank = (memberData.points >= 50) ? "A" : calculateRank(memberData.points);
            await set(`users/${memberId}`, memberData);
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

  // --- MutationObserver to catch late-added elements (profiles loaded later) ---
  const mo = new MutationObserver((mutations) => {
    let added = false;
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes || [])) {
        if (n.nodeType !== 1) continue;
        try {
          if (n.matches && (n.matches(".battle-member-points") || n.matches(".battle-member-rank") || n.matches(".battle-edit-btn") ||
              n.querySelector && (n.querySelector(".battle-member-points") || n.querySelector(".battle-member-rank") || n.querySelector(".battle-edit-btn")) )) {
            added = true;
            break;
          }
        } catch (e) {}
      }
      if (added) break;
    }
    if (added) {
      setTimeout(() => {
        updateAllDisplays();
        setupBattleStaffEditButtons();
      }, 80);
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // --- initialize ---
  async function initialize() {
    await ensureSettings();
    await updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));

  // expose admin open so you can put a staff-only button anywhere:
  window.openBattlePointMenu = openBattleAdminModal;
})();
