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
    await new Promise(r => (script.onload = r));
    const dbscript = document.createElement("script");
    dbscript.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js";
    document.head.appendChild(dbscript);
    await new Promise(r => (dbscript.onload = r));
  }

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const siteKey = "battle";
  const ref = path => database.ref(`${siteKey}/${path}`);
  const fetchData = async path => (await ref(path).get()).val();
  const setData = async (path, data) => ref(path).set(data);
  const updateData = async (path, data) => ref(path).update(data);

  const isStaff = pb.data("user").is_staff;
  const currentUserId = pb.data("user").id;

  // === SETTINGS ===
  const POINTS_PER_TAG = {
    "[PVP]": 2,
    "[BATTLE]": 2
  };
  const MAX_RANK_POINTS = 50;
  const RANKS = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");

  // === MAIN ===
  async function initBattle() {
    await updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
    setupAdminMenuButton();
  }

  // === POST DETECTION ===
  function setupPostListener() {
    $(document).on("ajax_success", function (event, data, status, xhr) {
      const url = xhr?.responseURL || "";
      if (url.includes("/post/") || url.includes("/thread/")) {
        setTimeout(handleNewPost, 1000);
      }
    });
  }

  async function handleNewPost() {
    const $title = $("h1.thread-title a");
    if (!$title.length) return;

    const titleText = $title.text().trim().toUpperCase();
    const tag = Object.keys(POINTS_PER_TAG).find(t => titleText.includes(t));
    if (!tag) return;

    const gain = POINTS_PER_TAG[tag];
    const userRef = `users/${currentUserId}`;
    let userData = (await fetchData(userRef)) || { points: 0, rank: "Z" };

    userData.points += gain;

    const rankIndex = Math.min(Math.floor(userData.points / 2), RANKS.length - 1);
    userData.rank = RANKS[Math.min(rankIndex, RANKS.length - 1)] || "A";

    await setData(userRef, userData);
    console.log(`[Battle Points] +${gain} awarded for ${tag} thread!`);
    updateAllDisplays();
  }

  // === DISPLAY ===
  async function updateAllDisplays() {
    const all = await fetchData("users");
    if (!all) return;

    $("[data-battle-points]").each(function () {
      const id = $(this).data("battle-points");
      const val = all?.[id]?.points ?? 0;
      $(this).text(val);
    });

    $("[data-battle-rank]").each(function () {
      const id = $(this).data("battle-rank");
      const val = all?.[id]?.rank ?? "Z";
      $(this).text(val);
    });
  }

  // === STAFF PROFILE EDIT MODAL ===
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

        let data = (await fetchData(`users/${id}`)) || { points: 0, rank: "Z" };
        $("#battle-set-value").val(data.points);
        $("#battle-change-value").val("");

        const saveAndUpdate = async () => {
          const rankIndex = Math.min(Math.floor(data.points / 2), RANKS.length - 1);
          data.rank = RANKS[rankIndex];
          await setData(`users/${id}`, data);
          updateAllDisplays();
        };

        $("#battle-set-btn").off().on("click", async () => {
          const v = parseInt($("#battle-set-value").val());
          if (!isNaN(v)) {
            data.points = v;
            await saveAndUpdate();
          }
        });

        $("#battle-add-btn").off().on("click", async () => {
          const add = parseInt($("#battle-change-value").val());
          if (!isNaN(add)) {
            data.points += add;
            await saveAndUpdate();
          }
        });

        $("#battle-remove-btn").off().on("click", async () => {
          const rem = parseInt($("#battle-change-value").val());
          if (!isNaN(rem)) {
            data.points = Math.max(0, data.points - rem);
            await saveAndUpdate();
          }
        });

        $("#battle-reset-btn").off().on("click", async () => {
          data = { points: 0, rank: "Z" };
          await saveAndUpdate();
        });

        $("#battle-close-btn").off().on("click", () => $modal.hide());
      });
    });
  }

  // === ADMIN PANEL ===
  function setupAdminMenuButton() {
    if (!isStaff) return;

    const adminButton = document.createElement("button");
    adminButton.textContent = "Battle Point Menu";
    adminButton.style = "position:fixed;bottom:20px;right:20px;z-index:1000;padding:6px 10px;font:12px Roboto;border:1px solid #232;background:#272;color:#aaa;border-radius:4px;cursor:pointer;";
    document.body.appendChild(adminButton);

    adminButton.addEventListener("click", () => {
      createAdminModal();
      $("#battle-admin-modal").show();
    });
  }

  function createAdminModal() {
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
        }
        #battle-admin-modal .modal-body { padding: 12px; }
        #battle-admin-modal label { font: bold 9px Roboto; letter-spacing: 2px; color: #aaa; text-transform: uppercase; display:block; margin-top:10px; margin-left:2px; }
        #battle-admin-modal input { width:100%; margin-top:5px; margin-bottom:10px; padding:6px; background:#303030; border:1px solid #232323; color:#aaa; border-radius:3px; }
        #battle-admin-modal button { border:1px solid #232323; border-radius:3px; background:#272727; text-transform:uppercase; font:bold 12px Roboto; color:#aaa; height:29px; margin-top:5px; line-height:19px; letter-spacing:1px; cursor:pointer; }
        #battle-admin-modal #battle-admin-close { width:100%; background:#232323; margin-top:10px; }
      </style>

      <div id="battle-admin-modal" style="display:none;">
        <div class="title-bar"><span>Battle Point Menu</span></div>
        <div class="modal-body">
          <label>Tag Configuration (JSON format)</label>
          <textarea id="tag-config" style="width:100%;height:80px;background:#303030;border:1px solid #232323;color:#aaa;border-radius:3px;"></textarea>
          <button id="save-tag-config">Save Tags</button>
          <button id="reset-ranks">Global Reset Ranks</button>
          <button id="battle-admin-close">Close</button>
        </div>
      </div>`;
    $("body").append(modalHTML);

    $("#save-tag-config").on("click", async () => {
      try {
        const val = JSON.parse($("#tag-config").val());
        await setData("tagConfig", val);
        alert("Tag configuration saved!");
      } catch {
        alert("Invalid JSON format!");
      }
    });

    $("#reset-ranks").on("click", async () => {
      if (!confirm("⚠️ WARNING: This will reset all ranks to Z but keep points. Continue?")) return;
      const all = (await fetchData("users")) || {};
      for (const id in all) {
        all[id].rank = "Z";
      }
      await setData("users", all);
      alert("All ranks have been reset to Z.");
      updateAllDisplays();
    });

    $("#battle-admin-close").on("click", () => $("#battle-admin-modal").hide());
  }

  initBattle();
})();


