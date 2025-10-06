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

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const siteKey = "battle";
  const ref = (path) => database.ref(`${siteKey}/${path}`);
  const fetchData = async (path) => (await ref(path).get()).val();
  const setData = async (path, data) => ref(path).set(data);
  const updateData = async (path, data) => ref(path).update(data);

  const user = proboards.data("user");
  if (!user || !user.id) return;
  const currentUserId = String(user.id);
  const isStaff = !!user.is_staff;

  // === SETTINGS ===
  let POST_TAGS = { "[PVP]": 2, "[BATTLE]": 2 };

  async function loadSettings() {
    const settings = await fetchData("settings");
    if (!settings) {
      await setData("settings", { threadTags: POST_TAGS, lastReset: 0 });
      return { threadTags: POST_TAGS, lastReset: 0 };
    }
    POST_TAGS = settings.threadTags || POST_TAGS;
    return settings;
  }

  async function getUserData(userId) {
    let data = await fetchData(`users/${userId}`);
    if (!data) data = { points: 0, rank: "Z", earnedSinceReset: 0 };
    return data;
  }

  function calculateRank(points) {
    const rankStep = 2;
    const steps = Math.floor(points / rankStep);
    const charCode = Math.max(65, 90 - steps);
    return String.fromCharCode(charCode);
  }

  async function awardBattlePoints(pointsToAdd) {
    const data = await getUserData(currentUserId);
    data.points = (data.points || 0) + pointsToAdd;
    data.earnedSinceReset = (data.earnedSinceReset || 0) + pointsToAdd;
    data.rank = calculateRank(data.earnedSinceReset);
    await setData(`users/${currentUserId}`, data);
    updateAllDisplays();
  }

  async function updateAllDisplays() {
    const all = await fetchData("users");
    if (!all) return;

    $(".battle-member-points").each(function () {
      const $el = $(this);
      const id = String($el.data("user-id"));
      $el.text(all?.[id]?.points ?? 0);
    });

    $(".battle-member-rank").each(function () {
      const $el = $(this);
      const id = String($el.data("user-id"));
      $el.text(all?.[id]?.rank ?? "Z");
    });
  }

  // === POST DETECTION ===
  async function handleNewPost() {
    const $title = $("h1.thread-title a");
    if (!$title.length) return;
    const titleText = $title.text().toUpperCase();
    const matchedTag = Object.keys(POST_TAGS).find(tag => titleText.includes(tag));
    if (!matchedTag) return;
    await awardBattlePoints(POST_TAGS[matchedTag] || 2);
  }

  function setupPostListener() {
    $(document).on("click", "input.button[name='post']", () => {
      setTimeout(handleNewPost, 1000);
    });
  }

  // === STAFF EDIT BUTTONS ===
  function createBattleEditModal() {
    if ($("#battle-edit-modal").length) return;

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
      <div class="title-bar"><span>Battle Point Menu</span></div>
      <div class="modal-body">
        <label>Global Rank Reset:</label>
        <button id="battle-reset-ranks-btn" style="width:100%;margin-bottom:10px;">Reset Ranks (Warning!)</button>
        <label>Thread Tags & Values:</label>
        <div id="battle-tags-list"></div>
        <button id="battle-add-tag">Add Tag</button>
        <button id="battle-save-tags">Save Tags</button>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $("body").append(modalHTML);
  }

  function setupBattleStaffEditButtons() {
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const id = $btn.data("user-id");
      if ($btn.data("bound")) return;
      $btn.data("bound", true).show();

      $btn.on("click", async function () {
        createBattleEditModal();
        const $modal = $("#battle-edit-modal");
        $modal.show();

        let data = await getUserData(id);
        $("#battle-set-value").val(data.points);

        $("#battle-set-btn").off().on("click", async () => {
          const v = parseInt($("#battle-set-value").val());
          if (!isNaN(v)) {
            data.points = v;
            await setData(`users/${id}`, data);
            updateAllDisplays();
          }
        });

        $("#battle-add-btn").off().on("click", async () => {
          const add = parseInt($("#battle-change-value").val());
          if (!isNaN(add)) {
            data.points += add;
            await setData(`users/${id}`, data);
            updateAllDisplays();
          }
        });

        $("#battle-remove-btn").off().on("click", async () => {
          const rem = parseInt($("#battle-change-value").val());
          if (!isNaN(rem)) {
            data.points -= rem;
            if (data.points < 0) data.points = 0;
            await setData(`users/${id}`, data);
            updateAllDisplays();
          }
        });

        $("#battle-reset-btn").off().on("click", () => {
          $("#battle-set-value").val(data.points);
          $("#battle-change-value").val("");
        });

        $("#battle-close-btn").off().on("click", () => $modal.hide());
      });
    });
  }

  function createBattleAdminMenu() {
    if ($("#battle-admin-modal").length) return;

    const modalHTML = `
    <style>
      #battle-admin-modal {
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
      #battle-admin-modal input[type="number"], #battle-admin-modal input[type="text"] { width:100%; margin-top:5px; margin-bottom:10px; padding:6px; background:#303030; border:1px solid #232323; color:#aaa; border-radius:3px; overflow:hidden; }
      #battle-admin-modal .btn-group { display:flex; gap:6px; margin-bottom:10px; }
      #battle-admin-modal button { border:1px solid #232323; border-radius:3px; background:#272727; text-transform:uppercase; font:bold 12px Roboto; color:#aaa; height:29px; margin-top:5px; line-height:19px; letter-spacing:1px; cursor:pointer; }
      #battle-admin-modal #battle-admin-close-btn { width:100%; background:#232323; margin-left:0px; margin-top:-5px; }
    </style>
    <div id="battle-admin-modal" style="display:none;">
      <div class="title-bar"><span>Battle Point Menu</span></div>
      <div class="modal-body">
        <label>Global Rank Reset</label>
        <button id="battle-global-reset-btn" style="width:100%;margin-bottom:10px;">Reset All Ranks (Warning!)</button>
        <label>Thread Tags & Values</label>
        <div id="battle-tags-list"></div>
        <button id="battle-add-tag">Add Tag</button>
        <button id="battle-save-tags">Save Tags</button>
        <button id="battle-admin-close-btn">Close</button>
      </div>
    </div>`;

    $("body").append(modalHTML);
  }

  function setupAdminMenu() {
    if (!isStaff) return;
    createBattleAdminMenu();
    $("#battle-global-reset-btn").off().on("click", async () => {
      if (!confirm("⚠️ This will reset all ranks back to Z. This cannot be undone. Continue?")) return;
      const users = await fetchData("users");
      if (!users) return;
      for (const uid in users) {
        users[uid].rank = "Z";
        users[uid].earnedSinceReset = 0;
      }
      await setData("users", users);
      updateAllDisplays();
    });
    $("#battle-add-tag").off().on("click", () => {
      const tagHTML = `<input type="text" class="battle-tag-name" placeholder="[TAG]"> <input type="number" class="battle-tag-value" placeholder="Points"><br>`;
      $("#battle-tags-list").append(tagHTML);
    });
    $("#battle-save-tags").off().on("click", async () => {
      const newTags = {};
      $("#battle-tags-list").find("input").each(function () {
        const $input = $(this);
        if ($input.hasClass("battle-tag-name")) {
          const name = $input.val().trim();
          const value = parseInt($input.next().val());
          if (name && !isNaN(value)) newTags[name] = value;
        }
      });
      await setData("settings", { threadTags: newTags, lastReset: Date.now() });
      POST_TAGS = newTags;
    });
    $("#battle-admin-close-btn").off().on("click", () => $("#battle-admin-modal").hide());
  }

  // === INIT ===
  await loadSettings();
  updateAllDisplays();
  setupPostListener();
  setupBattleStaffEditButtons();
  setupAdminMenu();
})();
