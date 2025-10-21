(async () => {
  const FIREBASE_BASE_URL = "https://battlepoints-e44ae-default-rtdb.firebaseio.com/battle";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);

  const TAG_REWARDS = {
    "[PVP]": 2,
    "[BATTLE]": 2,
    "[BP]": 2,
  };

  // === FETCH HELPERS ===
  async function fetchData(path) {
    const res = await fetch(`${FIREBASE_BASE_URL}/${path}.json`);
    return await res.json();
  }

  // === BEACON-SAFE PUT / PATCH ===
  async function setData(path, data) {
    const url = `${FIREBASE_BASE_URL}/${path}.json`;
    const payload = JSON.stringify(data);

    // Use sendBeacon if in Firefox and page is unloading
    if (navigator.userAgent.includes("Firefox") && document.visibilityState === "hidden") {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      console.log("🦊 sendBeacon (PUT):", ok);
      return;
    }

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: payload
    });
  }

  async function updateData(path, data) {
    const url = `${FIREBASE_BASE_URL}/${path}.json`;
    const payload = JSON.stringify(data);

    if (navigator.userAgent.includes("Firefox") && document.visibilityState === "hidden") {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      console.log("🦊 sendBeacon (PATCH):", ok);
      return;
    }

    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload
    });
  }

  // === USER HANDLING ===
  async function getUserData() {
    let data = await fetchData(`users/${userId}`);
    if (!data) data = {};
    data.username ??= user.username;
    data.display_name ??= user.name;
    data.points ??= 0;
    data.rank_points ??= 0;
    data.earned ??= {};
    return data;
  }

  async function awardBattlePoints(points, reason = "battle_reward") {
    if (!points || points <= 0) return;
    const data = await getUserData();
    data.points += points;
    data.rank_points += points;

    // Use sendBeacon immediately in Firefox to avoid unload abort
    if (navigator.userAgent.includes("Firefox")) {
      const payload = JSON.stringify(data);
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon(`${FIREBASE_BASE_URL}/users/${userId}.json`, blob);
      console.log("🦊 Reward beacon:", ok);
      if (ok) return;
    }

    await setData(`users/${userId}`, data);
    updateAllDisplays();
  }

  // === RANK LOGIC ===
  function getRankFromPoints(points) {
    const ranks = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");
    const capped = Math.min(points, 50);
    const index = Math.floor(capped / 2);
    return ranks[index] || "Z";
  }

  // === GLOBAL RANK RESET ===
  async function globalRankReset() {
    const users = await fetchData("users");
    if (!users) return;
    const allIds = Object.keys(users);
    const batchSize = 25;
    for (let i = 0; i < allIds.length; i += batchSize) {
      const batch = allIds.slice(i, i + batchSize);
      const updates = {};
      batch.forEach(id => {
        updates[id] = { ...users[id], rank_points: 0 };
      });
      await updateData("users", updates);
      await new Promise(r => setTimeout(r, 250));
    }
    console.log("✅ Global rank reset complete");
    alert("All user ranks have been reset successfully!");
  }

  // === DISPLAY UPDATER ===
  let lastUpdate = 0;
  async function updateAllDisplays() {
    if (Date.now() - lastUpdate < 3000) return;
    lastUpdate = Date.now();

    const allUsers = await fetchData("users") || {};
    const selfData = allUsers[userId] || { points: 0, rank_points: 0 };
    const selfRank = getRankFromPoints(selfData.rank_points);

    $(".battle-user-points").text(selfData.points);
    $(".battle-user-rank").text(selfRank);

    $(".battle-member-points[data-user-id]").each(function () {
      const id = String($(this).data("user-id"));
      const data = allUsers[id];
      $(this).text(data?.points ?? 0);
    });

    $(".battle-member-rank[data-user-id]").each(function () {
      const id = String($(this).data("user-id"));
      const data = allUsers[id];
      $(this).text(getRankFromPoints(data?.rank_points ?? 0));
    });
  }

  // === TAG DETECTION ===
  function getTagValueFromSubject(subject) {
    if (!subject) return 0;
    for (const [tag, value] of Object.entries(TAG_REWARDS)) {
      if (subject.toUpperCase().includes(tag.toUpperCase())) return value;
    }
    return 0;
  }

  // === THREAD & POST LISTENERS ===
  function setupThreadAndPostListeners() {
    const threadBtns = $('input[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || "";
      return val.includes("create thread") || val.includes("post thread") || val.includes("new thread");
    });

    threadBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);

      $btn.on("click", async function () {
        const subject = $('input[name="subject"]').val() || "";
        const reward = getTagValueFromSubject(subject);
        if (reward > 0) await awardBattlePoints(reward, "thread_creation");
      });
    });

    const postBtns = $('input[type="submit"], button[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || $(el).text()?.toLowerCase() || "";
      return val.includes("post reply") || val.includes("create post") || val.includes("reply") || val.includes("quick reply");
    });

    postBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);

      $btn.on("click", async function () {
        let threadTitle =
          ($('#thread-title').text() || "").trim() ||
          ($('input[name="subject"]').val() || "").trim() ||
          ($('#navigation-tree a[href*="/thread/"]').last().text() || "").trim() ||
          (document.title.split(" | ")[0] || "").trim() || "";

        const reward = getTagValueFromSubject(threadTitle);
        if (reward > 0) await awardBattlePoints(reward, "post_reply");
      });
    });
  }

  // === STAFF MODAL ===
  function createEditModal() {
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

    #battle-edit-modal label {
        font: bold 9px Roboto;
        letter-spacing: 2px;
        color: #aaa;
        text-transform: uppercase;
        display: block;
        margin-top: 10px;
        margin-left: 2px;
    }

    #battle-edit-modal input[type="number"] {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 6px;
        background: #303030;
        border: 1px solid #232323;
        color: #aaa;
        border-radius: 3px;
    }

    #battle-edit-modal .btn-group {
        display: flex;
        gap: 6px;
        margin-bottom: 10px;
    }

    #battle-edit-modal button {
        border: 1px solid #232323;
        border-radius: 3px;
        background: #272727;
        text-transform: uppercase;
        font: bold 12px Roboto;
        color: #aaa;
        height: 29px;
        margin-top: 5px;
        line-height: 19px;
        letter-spacing: 1px;
        cursor: pointer;
    }

    #battle-edit-modal #battle-close-btn,
    #battle-edit-modal #battle-reset-all-btn {
        width: 100%;
        background: #232323;
        margin-top: 0;
        margin-left: 0;
    }
    </style>

    <div id="battle-edit-modal" style="display:none;">
      <div class="title-bar"><span>Edit Battle Points</span></div>
      <div class="modal-body">
        <button id="battle-reset-all-btn">Reset All Ranks</button>
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

  function setupStaffEditButtons() {
    const isStaff = !!proboards.data("user")?.is_staff;
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = String($btn.data("user-id"));
      if (!memberId || $btn.data("bound")) return;
      $btn.data("bound", true).show();

      $btn.on("click", async function () {
        createEditModal();
        const $modal = $('#battle-edit-modal');
        $modal.show();

        const allUsers = await fetchData("users");
        const memberData = allUsers[memberId] || { points: 0, rank_points: 0 };

        $('#battle-set-value').val(memberData.points);
        $('#battle-change-value').val('');

        $('#battle-set-btn').off().on('click', async () => {
          const newVal = parseInt($('#battle-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
            $modal.hide();
          }
        });

        $('#battle-reset-btn').off().on('click', async () => {
          if (!confirm("Reset this user's rank progress?")) return;
          memberData.rank_points = 0;
          await setData(`users/${memberId}`, memberData);
          updateAllDisplays();
          $modal.hide();
        });

        $('#battle-add-btn').off().on('click', async () => {
          const addVal = parseInt($('#battle-change-value').val());
          if (!isNaN(addVal)) {
            memberData.points += addVal;
            memberData.rank_points += addVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
            $modal.hide();
          }
        });

        $('#battle-remove-btn').off().on('click', async () => {
          const removeVal = parseInt($('#battle-change-value').val());
          if (!isNaN(removeVal)) {
            memberData.points = Math.max(0, memberData.points - removeVal);
            memberData.rank_points = Math.max(0, memberData.rank_points - removeVal);
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
            $modal.hide();
          }
        });

        $('#battle-close-btn').off().on('click', () => $modal.hide());
        $('#battle-reset-all-btn').off().on('click', async () => {
          const confirmReset = confirm("Are you sure you want to reset all user ranks? This will not affect total Battle Points.");
          if (!confirmReset) return;
          await globalRankReset();
          updateAllDisplays();
          $modal.hide();
        });
      });
    });
  }

  // === INIT ===
  function initializeBattlePoints() {
    setupThreadAndPostListeners();
    updateAllDisplays();
    setupStaffEditButtons();
  }

  $(document).ready(() => setTimeout(initializeBattlePoints, 400));
  $(document).on("pageChange", () => setTimeout(initializeBattlePoints, 400));
})();

