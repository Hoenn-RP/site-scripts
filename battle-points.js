(async () => {
  const FIREBASE_BASE_URL = "https://battlepoints-e44ae-default-rtdb.firebaseio.com/battle";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);

  // === CONFIGURATION ===
  const TAG_REWARDS = {
    "[PVP]": 2,
    "[BATTLE]": 2,
    "[BP]": 2,
    // Add more tags here if you want custom rewards
    // "[TOURNAMENT]": 3,
    // "[TRAINING]": 1,
  };

  // === FIREBASE HELPERS ===
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

  async function updateData(path, data) {
    await fetch(`${FIREBASE_BASE_URL}/${path}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  // === USER DATA ===
  async function getUserData() {
    let data = await fetchData(`users/${userId}`);
    if (!data) data = {};
    data.username ??= user.username;
    data.display_name ??= user.name;
    data.points ??= 0;
    data.earned ??= {};
    return data;
  }

  async function awardBattlePoints(points, reason = "battle_reward") {
    if (!points || points <= 0) return;
    const data = await getUserData();
    data.points += points;
    await setData(`users/${userId}`, data);
    updateAllDisplays();
  }

  // === DISPLAY UPDATES ===
  async function updateAllDisplays() {
    // Update the logged-in user's display (if shown anywhere)
    const selfData = await fetchData(`users/${userId}`);
    const selfPoints = selfData?.points ?? 0;
    $(".battle-user-points").text(`${selfPoints}`);

    // Update all member Battle Points displays
    $(".battle-member-points[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;
      const memberData = await fetchData(`users/${memberId}`);
      const memberPoints = memberData?.points ?? 0;
      $el.text(`${memberPoints}`);
    });
  }

  // === TAG CHECKING ===
  function getTagValueFromSubject(subject) {
    if (!subject) return 0;
    for (const [tag, value] of Object.entries(TAG_REWARDS)) {
      if (subject.toUpperCase().includes(tag.toUpperCase())) return value;
    }
    return 0;
  }

  // === EVENT DETECTION ===
  function setupThreadAndPostListeners() {
    // --- Detect new thread creation ---
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
        console.log("Awarding BP for thread:", reward, "subject:", subject);
        if (reward > 0) {
          await awardBattlePoints(reward, "thread_creation");
        }
      });
    });

    // --- Detect post replies (includes Quick Reply) ---
    const postBtns = $('input[type="submit"], button[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || $(el).text()?.toLowerCase() || "";
      return val.includes("post reply") || val.includes("create post") || val.includes("reply") || val.includes("quick reply");
    });

    postBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);

      $btn.on("click", async function () {
        // Grab thread title (from breadcrumbs or topic title)
        const threadTitle =
          $('#thread-title').text() ||
          $('#subject').val() ||
          $('#navigation-tree span[itemprop="name"]').last().text() ||
          "";

        const reward = getTagValueFromSubject(threadTitle);
        console.log("Awarding BP for reply:", reward, "thread:", threadTitle);
        if (reward > 0) {
          await awardBattlePoints(reward, "post_reply");
        }
      });
    });

    console.log("Battle Points: post detection initialized");
  }

  // === STAFF EDITING MODAL ===
  function createEditModal() {
    if ($('#bp-edit-modal').length) return;

    const modalHTML = `
    <style>
      #bp-edit-modal {
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
      #bp-edit-modal .title-bar {
        background-color: #272727;
        padding: 8px 12px;
        border-bottom: 1px solid #232323;
        font: bold 9px 'Quattrocento Sans', sans-serif;
        color: #aaa !important;
        text-transform: uppercase;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #bp-edit-modal .modal-body {
        padding: 12px;
      }
      #bp-edit-modal label {
        font: bold 9px Roboto;
        letter-spacing: 2px;
        color: #aaa;
        text-transform: uppercase;
        display: block;
        margin-top: 10px;
      }
      #bp-edit-modal input[type="number"] {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 6px;
        background: #303030;
        border: 1px solid #232323;
        color: #aaa;
        border-radius: 3px;
      }
      #bp-edit-modal button {
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
      #bp-edit-modal #bp-close-btn {
        width: 100%;
        background: #232323;
        margin-top: -5px;
      }
    </style>

    <div id="bp-edit-modal" style="display:none;">
      <div class="title-bar">
        <span>Edit Battle Points</span>
      </div>
      <div class="modal-body">
        <label>Set Points:</label>
        <input type="number" id="bp-set-value" />
        <button id="bp-set-btn">Set</button>
        <label>Adjust:</label>
        <input type="number" id="bp-change-value" />
        <button id="bp-add-btn">Add</button>
        <button id="bp-remove-btn">Remove</button>
        <button id="bp-close-btn">Close</button>
      </div>
    </div>`;
    $('body').append(modalHTML);
  }

  function setupStaffEditButtons() {
    const isStaff = !!proboards.data("user")?.is_staff;
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = $btn.data("user-id");
      if (!memberId || $btn.data("bound")) return;
      $btn.data("bound", true);
      $btn.show();

      $btn.on("click", async function () {
        createEditModal();
        const $modal = $('#bp-edit-modal');
        $modal.show();

        const memberData = await fetchData(`users/${memberId}`);
        memberData.points ??= 0;
        $('#bp-set-value').val(memberData.points);

        $('#bp-set-btn').off('click').on('click', async () => {
          const newVal = parseInt($('#bp-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#bp-add-btn').off('click').on('click', async () => {
          const addVal = parseInt($('#bp-change-value').val());
          if (!isNaN(addVal)) {
            memberData.points += addVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#bp-remove-btn').off('click').on('click', async () => {
          const removeVal = parseInt($('#bp-change-value').val());
          if (!isNaN(removeVal)) {
            memberData.points -= removeVal;
            if (memberData.points < 0) memberData.points = 0;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#bp-close-btn').off('click').on('click', () => $modal.hide());
      });
    });
  }

  // === INITIALIZATION ===
  function initializeBattlePoints() {
    setupThreadAndPostListeners();
    updateAllDisplays();
    setupStaffEditButtons();
  }

  $(document).ready(() => setTimeout(initializeBattlePoints, 400));
  $(document).on("pageChange", () => setTimeout(initializeBattlePoints, 400));
})();

