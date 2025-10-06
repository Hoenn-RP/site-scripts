(async () => {
  const FIREBASE_BASE_URL = "https://battlepoints-e44ae-default-rtdb.firebaseio.com/battle";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);
  const isStaff = !!user.is_staff;

  async function fetchData(path) {
    const res = await fetch(`${FIREBASE_BASE_URL}/${path}.json`);
    return await res.json();
  }

  async function setData(path, data) {
    await fetch(`${FIREBASE_BASE_URL}/${path}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  async function updateData(path, updates) {
    await fetch(`${FIREBASE_BASE_URL}/${path}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
  }

  // Initialize default settings if missing
  async function initSettings() {
    const settings = await fetchData("settings");
    if (!settings) {
      const defaultSettings = {
        threadTags: { "[PVP]": 1, "[BATTLE]": 1 },
        lastReset: 0
      };
      await setData("settings", defaultSettings);
      return defaultSettings;
    }
    return settings;
  }

  async function getUserData() {
    let data = await fetchData(`users/${userId}`);
    const now = Date.now();
    const settings = await fetchData("settings");

    if (!data) data = {};
    data.username ??= user.username;
    data.display_name ??= user.name;
    data.points ??= 0;
    data.session_points ??= 0;
    data.rank ??= "Z";
    data.last_reset ??= now;

    // Reset session points if last global reset is newer
    if (settings?.lastReset && settings.lastReset > data.last_reset) {
      data.session_points = 0;
      data.rank = "Z";
      data.last_reset = now;
      await setData(`users/${userId}`, data);
    }

    return data;
  }

  function calculateRank(sessionPoints) {
    const steps = Math.floor(sessionPoints / 2);
    const charCode = Math.max(65, 90 - steps);
    return String.fromCharCode(charCode);
  }

  async function awardBattlePoints(pointsToAdd) {
    const data = await getUserData();
    data.points += pointsToAdd;
    data.session_points += pointsToAdd;
    data.rank = calculateRank(data.session_points);
    await setData(`users/${userId}`, data);
    updateAllDisplays();
  }

  async function updateAllDisplays() {
    const selfData = await fetchData(`users/${userId}`);
    const selfPoints = selfData?.points ?? 0;
    const selfRank = selfData?.rank ?? "Z";

    $(".battle-user-points").text(`${selfPoints}`);
    $(".battle-rank").text(`${selfRank}`);

    $(".battle-user-points[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;
      const memberData = await fetchData(`users/${memberId}`);
      const memberPoints = memberData?.points ?? 0;
      $el.text(`${memberPoints}`);
    });

    $(".battle-rank[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;
      const memberData = await fetchData(`users/${memberId}`);
      const memberRank = memberData?.rank ?? "Z";
      $el.text(`${memberRank}`);
    });
  }

  async function handleNewPost() {
    const settings = await initSettings();
    const title = $("h1.thread-title a").text().trim().toUpperCase();
    const matchingTag = Object.keys(settings.threadTags).find(tag =>
      title.includes(tag.toUpperCase())
    );

    if (matchingTag) {
      const pointsToAdd = settings.threadTags[matchingTag] || 1;
      await awardBattlePoints(pointsToAdd);
    }
  }

  // -------------------------------
  // STAFF SETTINGS MODAL (for tags)
  // -------------------------------
  function createBattleSettingsModal() {
    if ($("#battle-settings-modal").length) return;

    const modalHTML = `
    <style>
      #battle-settings-modal {
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
        display: none;
      }
      #battle-settings-modal .title-bar {
        background-color: #272727;
        background-image: url(https://image.ibb.co/dMFuMc/flower.png);
        background-repeat: no-repeat;
        background-position: center right;
        padding: 8px 12px;
        border-bottom: 1px solid #232323;
        font: bold 9px 'Quattrocento Sans', sans-serif;
        color: #aaa;
        text-transform: uppercase;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #battle-settings-modal .modal-body {
        padding: 12px;
      }
      #battle-settings-modal label {
        font: bold 9px Roboto;
        letter-spacing: 2px;
        color: #aaa;
        text-transform: uppercase;
        display: block;
        margin-top: 10px;
      }
      #battle-settings-modal input {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 6px;
        background: #303030;
        border: 1px solid #232323;
        color: #aaa;
        border-radius: 3px;
      }
      #battle-settings-modal button {
        border: 1px solid #232323;
        border-radius: 3px;
        background: #272727;
        text-transform: uppercase;
        font: bold 12px Roboto;
        color: #aaa;
        height: 29px;
        margin-top: 5px;
        letter-spacing: 1px;
        cursor: pointer;
      }
      #battle-settings-modal .tag-list {
        max-height: 150px;
        overflow-y: auto;
      }
    </style>

    <div id="battle-settings-modal">
      <div class="title-bar"><span>Battle Settings</span></div>
      <div class="modal-body">
        <div class="tag-list"></div>
        <button id="battle-add-tag">Add New Tag</button>
        <button id="battle-save-tags">Save Changes</button>
        <button id="battle-reset-all">Global Rank Reset</button>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $("body").append(modalHTML);
  }

  async function openBattleSettingsModal() {
    createBattleSettingsModal();
    const settings = await initSettings();
    const $modal = $("#battle-settings-modal");
    const $list = $modal.find(".tag-list");
    $list.empty();

    for (const [tag, points] of Object.entries(settings.threadTags)) {
      $list.append(`
        <div class="tag-item">
          <input class="battle-tag" value="${tag}" />
          <input class="battle-points" type="number" value="${points}" min="1" />
        </div>
      `);
    }

    $modal.show();

    $("#battle-add-tag").off().on("click", () => {
      $list.append(`
        <div class="tag-item">
          <input class="battle-tag" value="[NEW]" />
          <input class="battle-points" type="number" value="1" min="1" />
        </div>
      `);
    });

    $("#battle-save-tags").off().on("click", async () => {
      const newTags = {};
      $list.find(".tag-item").each(function () {
        const tag = $(this).find(".battle-tag").val().trim();
        const points = parseInt($(this).find(".battle-points").val()) || 1;
        if (tag.startsWith("[") && tag.endsWith("]")) newTags[tag] = points;
      });
      await updateData("settings", { threadTags: newTags });
      alert("Tags saved successfully!");
      $modal.hide();
    });

    $("#battle-reset-all").off().on("click", async () => {
      const confirmReset = confirm("Are you sure? This will reset all ranks.");
      if (confirmReset) {
        await updateData("settings", { lastReset: Date.now() });
        alert("Global rank reset complete!");
        $modal.hide();
      }
    });

    $("#battle-close-btn").off().on("click", () => $modal.hide());
  }

  // -------------------------------
  // STAFF USER EDIT MODAL
  // -------------------------------
  function createBattleEditModal() {
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
        color: #aaa;
        text-transform: uppercase;
      }
      #battle-edit-modal .modal-body {
        padding: 12px;
      }
      #battle-edit-modal label {
        font: bold 9px Roboto;
        letter-spacing: 2px;
        color: #aaa;
        text-transform: uppercase;
        display: block;
        margin-top: 10px;
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
      #battle-edit-modal button {
        border: 1px solid #232323;
        border-radius: 3px;
        background: #272727;
        text-transform: uppercase;
        font: bold 12px Roboto;
        color: #aaa;
        height: 29px;
        margin-top: 5px;
        letter-spacing: 1px;
        cursor: pointer;
      }
    </style>

    <div id="battle-edit-modal" style="display:none;">
      <div class="title-bar">Edit Battle Points</div>
      <div class="modal-body">
        <label>Set New Value:</label>
        <input type="number" id="battle-set-value" />
        <button id="battle-set-btn">Set</button>
        <label>Add or Remove:</label>
        <input type="number" id="battle-change-value" />
        <button id="battle-add-btn">Add</button>
        <button id="battle-remove-btn">Remove</button>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $('body').append(modalHTML);
  }

  function setupBattleStaffEditButtons() {
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = $btn.data("user-id");
      if (!memberId || $btn.data("bound")) return;

      $btn.data("bound", true);
      $btn.show();

      $btn.on("click", async function () {
        createBattleEditModal();
        const $modal = $('#battle-edit-modal');
        $modal.show();

        const memberData = await fetchData(`users/${memberId}`);
        const currentPoints = memberData?.points ?? 0;
        $('#battle-set-value').val(currentPoints);
        $('#battle-change-value').val('');

        $('#battle-set-btn').off('click').on('click', async () => {
          const newVal = parseInt($('#battle-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#battle-add-btn').off('click').on('click', async () => {
          const addVal = parseInt($('#battle-change-value').val());
          if (!isNaN(addVal)) {
            memberData.points += addVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#battle-remove-btn').off('click').on('click', async () => {
          const removeVal = parseInt($('#battle-change-value').val());
          if (!isNaN(removeVal)) {
            memberData.points -= removeVal;
            if (memberData.points < 0) memberData.points = 0;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#battle-close-btn').off('click').on('click', () => $modal.hide());
      });
    });
  }

  // -------------------------------
  // INIT + POST DETECTION
  // -------------------------------
  function initializeBattle() {
    updateAllDisplays();
    setupBattleStaffEditButtons();

    if (isStaff) {
      $("#battle-settings-btn").off().on("click", openBattleSettingsModal);
    }
  }

  // Detect post success via AJAX
  $(document).on("ajax_success", function (event, data, status, xhr) {
    const url = xhr?.responseURL || "";
    if (url.includes("/post/") || url.includes("/thread/")) {
      setTimeout(handleNewPost, 1000);
    }
  });

  $(document).ready(() => setTimeout(initializeBattle, 300));
  $(document).on("pageChange", () => setTimeout(initializeBattle, 300));
})();


