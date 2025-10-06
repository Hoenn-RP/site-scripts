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

  if (typeof firebase === "undefined") {
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    document.head.appendChild(script);
    await new Promise((r) => (script.onload = r));
    const dbscript = document.createElement("script");
    dbscript.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(dbscript);
    await new Promise((r) => (dbscript.onload = r));
  }

  // init firebase
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const siteKey = "battle"; // node root
  const ref = (path) => database.ref(`${siteKey}/${path}`);
  const fetchData = async (path) => (await ref(path).get()).val();
  const setData = async (path, data) => ref(path).set(data);
  const updateData = async (path, data) => ref(path).update(data);

  const user = proboards.data("user");
  if (!user || !user.id) return;
  const currentUserId = String(user.id);
  const isStaff = !!user.is_staff;

  // SETTINGS
  const POST_TAGS = ["[PVP]", "[BATTLE]"];
  const POINTS_PER_POST = 2;

  // UTIL
  function calculateRank(sessionPoints) {
    // every 2 session points reduces letter from 'Z' toward 'A'
    const steps = Math.floor(sessionPoints / 2);
    const charCode = Math.max(65, 90 - steps); // 65='A', 90='Z'
    return String.fromCharCode(charCode);
  }

  // Ensure settings exist
  async function initSettings() {
    let settings = await fetchData("settings");
    if (!settings) {
      settings = { threadTags: { "[PVP]": 1, "[BATTLE]": 1 }, lastReset: 0 };
      await setData("settings", settings);
    }
    return settings;
  }

  // Get or create single-user data
  async function getUserData(uid) {
    let data = await fetchData(`users/${uid}`);
    if (!data) data = {};
    data.username ??= `user${uid}`;
    data.display_name ??= `User ${uid}`;
    data.points ??= 0;
    data.session_points ??= 0;
    data.rank ??= "Z";
    data.last_reset ??= Date.now();
    return data;
  }

  // Award points (no cooldown)
  async function awardBattlePoints(uid, pointsToAdd = POINTS_PER_POST) {
    const data = await getUserData(uid);
    data.points += pointsToAdd;
    data.session_points += pointsToAdd;
    data.rank = calculateRank(data.session_points);
    await setData(`users/${uid}`, data);
    await updateAllDisplays();
  }

  // Update all visible battle displays (mirrors Amity approach)
  async function updateAllDisplays() {
    // Show current user's short displays
    const selfData = await fetchData(`users/${currentUserId}`);
    const selfPoints = selfData?.points ?? 0;
    const selfRank = selfData?.rank ?? "Z";

    $(".battle-user-points").text(`${selfPoints}`);
    $(".battle-rank").text(`${selfRank}`);

    // Member points elements like your Amity markup: .battle-member-points[data-user-id]
    $(".battle-member-points[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = String($el.data("user-id"));
      if (!memberId) return;
      const memberData = await fetchData(`users/${memberId}`);
      const memberPoints = memberData?.points ?? 0;
      $el.text(`${memberPoints}`);
    });

    // Member ranks: .battle-rank[data-user-id]
    $(".battle-rank[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = String($el.data("user-id"));
      if (!memberId) return;
      const memberData = await fetchData(`users/${memberId}`);
      const memberRank = memberData?.rank ?? "Z";
      $el.text(`${memberRank}`);
    });
  }

  // Thread post handling: award current user for posting in PVP/BATTLE threads (includes first post)
  async function handleNewPost() {
    const settings = await initSettings();
    // Get visible thread title (same selector used earlier)
    const title = $("h1.thread-title a").text().trim().toUpperCase();
    if (!title) return;

    // case-insensitive check
    const matchedTag = Object.keys(settings.threadTags || {}).find(tag =>
      title.includes(tag.toUpperCase())
    ) || POST_TAGS.find(tag => title.includes(tag.toUpperCase()));

    if (!matchedTag) return;

    // Award points to the posting user (current user)
    await awardBattlePoints(currentUserId, POINTS_PER_POST);
    console.log(`[Battle] Awarded ${POINTS_PER_POST} points for posting in ${matchedTag}`);
  }

  // CREATE EDIT MODAL (uses same visual style + structure as Amity)
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
            color: #aaa !important;
            text-transform: uppercase;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            overflow: hidden;
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
    
        #battle-edit-modal #battle-close-btn {
            width: 100%;
            background: #232323;
            margin-left: 0px;
            margin-top: -5px;
        }
    </style>
    
    <div id="battle-edit-modal" style="display:none;">
        <div class="title-bar">
            <span>Edit Battle Points</span>
        </div>
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
    </div>
    `;
    $('body').append(modalHTML);
  }

  // Staff edit buttons (mirrors Amity behavior)
  function setupBattleStaffEditButtons() {
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = String($btn.data("user-id"));
      if (!memberId || $btn.data("bound")) return;

      $btn.data("bound", true);
      $btn.show();

      $btn.on("click", async function () {
        createBattleEditModal();
        const $modal = $('#battle-edit-modal');
        $modal.show();

        const memberData = await getUserData(memberId);
        let currentValue = memberData.points ?? 0;

        $('#battle-set-value').val(currentValue);
        $('#battle-change-value').val('');

        $('#battle-set-btn').off('click').on('click', async () => {
          const newVal = parseInt($('#battle-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            // do not alter session_points when setting total directly unless desired;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#battle-reset-btn').off('click').on('click', async () => {
          // reset this user's points & session_points
          memberData.points = 0;
          memberData.session_points = 0;
          memberData.rank = "Z";
          memberData.last_reset = Date.now();
          await setData(`users/${memberId}`, memberData);
          updateAllDisplays();
        });

        $('#battle-add-btn').off('click').on('click', async () => {
          const addVal = parseInt($('#battle-change-value').val());
          if (!isNaN(addVal)) {
            memberData.points += addVal;
            memberData.session_points += addVal;
            memberData.rank = calculateRank(memberData.session_points);
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#battle-remove-btn').off('click').on('click', async () => {
          const removeVal = parseInt($('#battle-change-value').val());
          if (!isNaN(removeVal)) {
            memberData.points -= removeVal;
            memberData.session_points -= removeVal;
            if (memberData.points < 0) memberData.points = 0;
            if (memberData.session_points < 0) memberData.session_points = 0;
            memberData.rank = calculateRank(memberData.session_points);
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#battle-close-btn').off('click').on('click', () => {
          $modal.hide();
        });
      });
    });
  }

  // Settings modal for staff to reset global ranks & edit tags
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
      const confirmReset = confirm("Are you sure? This will reset everyone's session ranks.");
      if (confirmReset) {
        await updateData("settings", { lastReset: Date.now() });
        // Optionally, zero session_points across users:
        const allUsers = await fetchData("users") || {};
        for (const uid of Object.keys(allUsers)) {
          const u = allUsers[uid];
          u.session_points = 0;
          u.rank = "Z";
          u.last_reset = Date.now();
          await setData(`users/${uid}`, u);
        }
        alert("Global rank reset complete!");
        $modal.hide();
        updateAllDisplays();
      }
    });

    $("#battle-close-btn").off().on("click", () => $modal.hide());
  }

  // INITIALIZE
  function initializeBattle() {
    updateAllDisplays();
    setupBattleStaffEditButtons();

    if (isStaff) {
      // you should add a #battle-settings-btn somewhere in your staff UI which opens this
      $("#battle-settings-btn").off().on("click", openBattleSettingsModal);
    }
  }

  // Post detection via AJAX success (reliable for ProBoards)
  $(document).on("ajax_success", function (event, data, status, xhr) {
    const url = xhr?.responseURL || "";
    // filter to post/thread related responses; adjust if your ProBoards uses other endpoints
    if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create")) {
      // allow a little time for DOM to settle
      setTimeout(handleNewPost, 800);
    }
  });

  $(document).ready(() => setTimeout(initializeBattle, 300));
  $(document).on("pageChange", () => setTimeout(initializeBattle, 300));
})();








