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

  const ref = (path) => database.ref(`battle/${path}`);
  const fetchData = async (path) => (await ref(path).get()).val();
  const setData = async (path, data) => ref(path).set(data);
  const updateData = async (path, data) => ref(path).update(data);

  const user = proboards.data("user");
  if (!user || !user.id) return;
  const currentUserId = String(user.id);
  const isStaff = !!user.is_staff;

  const POST_TAGS = ["[PVP]", "[BATTLE]"];
  const POINTS_PER_POST_DEFAULT = 2;

  // === HELPERS ===
  function calculateRank(pointsSinceReset) {
    const steps = Math.floor(pointsSinceReset / 2);
    let charCode = 90 - steps;
    if (charCode < 65) charCode = 65; // stops at "A"
    return String.fromCharCode(charCode);
  }

  async function initSettings() {
    let settings = await fetchData("settings");
    if (!settings) {
      settings = { threadTags: { "[PVP]": POINTS_PER_POST_DEFAULT, "[BATTLE]": POINTS_PER_POST_DEFAULT }, lastReset: Date.now() };
      await setData("settings", settings);
    }
    return settings;
  }

  async function getUserData(userId) {
    let data = await fetchData(`users/${userId}`);
    if (!data) data = { points: 0, pointsSinceReset: 0 };
    data.username ??= user.username;
    data.display_name ??= user.name;
    return data;
  }

  async function awardPoints(points) {
    const data = await getUserData(currentUserId);
    data.points += points;
    data.pointsSinceReset += points;
    data.rank = calculateRank(data.pointsSinceReset);
    await setData(`users/${currentUserId}`, data);
    updateAllDisplays();
  }

  async function updateAllDisplays() {
    const allUsers = await fetchData("users") || {};
    $(".battle-member-points").each(function () {
      const userId = $(this).data("user-id");
      const val = allUsers?.[userId]?.points ?? 0;
      $(this).text(val);
    });
    $(".battle-member-rank").each(function () {
      const userId = $(this).data("user-id");
      const val = allUsers?.[userId]?.rank ?? "Z";
      $(this).text(val);
    });
  }

  async function handleNewPost() {
    const title = $("h1.thread-title a").text().toUpperCase() || "";
    const settings = await initSettings();
    const matchedTag = Object.keys(settings.threadTags).find(tag => title.includes(tag));
    if (!matchedTag) return;
    const pointsToAdd = settings.threadTags[matchedTag] || POINTS_PER_POST_DEFAULT;
    await awardPoints(pointsToAdd);
  }

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
        <label>Tags & Values:</label>
        <div id="battle-tag-list"></div>
        <button id="battle-add-tag">Add New Tag</button>
        <button id="battle-save-tags">Save Tags</button>
        <label style="color:red;">⚠ Global Reset will reset ranks to Z</label>
        <button id="battle-reset-ranks">Global Reset Ranks</button>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $("body").append(modalHTML);
  }

  function setupBattleStaffEditButtons() {
    if (!isStaff) return;
    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = $btn.data("user-id");
      if (!$btn.data("bound")) {
        $btn.data("bound", true).show();
        $btn.on("click", async function () {
          createBattleEditModal();
          const $modal = $("#battle-edit-modal");
          $modal.show();

          const settings = await initSettings();
          const tagList = $("#battle-tag-list");
          tagList.empty();
          for (const [tag, val] of Object.entries(settings.threadTags)) {
            tagList.append(`<div><input class="battle-tag" value="${tag}" /> <input type="number" class="battle-tag-value" value="${val}" /></div>`);
          }

          $("#battle-add-tag").off().on("click", () => {
            tagList.append(`<div><input class="battle-tag" value="[NEW]" /> <input type="number" class="battle-tag-value" value="1" /></div>`);
          });

          $("#battle-save-tags").off().on("click", async () => {
            const newTags = {};
            tagList.find("div").each(function () {
              const tag = $(this).find(".battle-tag").val().trim();
              const val = parseInt($(this).find(".battle-tag-value").val()) || POINTS_PER_POST_DEFAULT;
              if (tag) newTags[tag] = val;
            });
            await updateData("settings", { threadTags: newTags });
            alert("Tags saved!");
            $modal.hide();
          });

          $("#battle-reset-ranks").off().on("click", async () => {
            if (!confirm("⚠ Are you sure? This will reset all ranks to Z!")) return;
            const allUsers = await fetchData("users");
            for (const id in allUsers) {
              await updateData(`users/${id}`, { pointsSinceReset: 0, rank: "Z" });
            }
            await updateData("settings", { lastReset: Date.now() });
            updateAllDisplays();
            alert("Ranks reset!");
            $modal.hide();
          });

          $("#battle-close-btn").off().on("click", () => $modal.hide());
        });
      }
    });
  }

  function setupPostListener() {
    $(document).on("ajax_success", function (event, data, status, xhr) {
      const url = xhr?.responseURL || "";
      if (url.includes("/post/") || url.includes("/thread/")) {
        setTimeout(handleNewPost, 500);
      }
    });
  }

  async function initBattle() {
    await initSettings();
    await updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  $(document).ready(() => setTimeout(initBattle, 300));
  $(document).on("pageChange", () => setTimeout(initBattle, 300));
})();
