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

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const siteKey = "battle";
  const ref = (p) => database.ref(`${siteKey}/${p}`);
  const fetchData = async (p) => (await ref(p).get()).val();
  const setData = async (p, d) => ref(p).set(d);
  const updateData = async (p, d) => ref(p).update(d);

  const userObj = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("user") :
                  (typeof pb !== "undefined" && pb.data) ? pb.data("user") : null;
  if (!userObj || !userObj.id) return;
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;

  const POINTS_PER_POST = 2;
  let POST_TAGS = ["[PVP]", "[BATTLE]"]; // editable via admin modal

  // --- rank calculation (Z → A) ---
  function calculateRank(points) {
    const step = Math.floor(points / 2);
    let rank = "";
    let n = 25 - step; // reverse so Z=0 points
    if (n < 0) n = 0;
    rank = String.fromCharCode(65 + n);
    return rank;
  }

  function idFromElement($el) {
    let id = $el.attr("data-user-id") ?? $el.attr("data-battle-points") ?? $el.attr("data-battle-id") ?? $el.attr("data-battle-user");
    if (!id) {
      id = $el.data("user-id") ?? $el.data("userid") ?? $el.data("userId") ?? $el.data("battle-points") ?? $el.data("battlePoints");
    }
    if (id == null) return null;
    return String(id);
  }

  async function updateAllDisplays() {
    const all = (await fetchData("users")) || {};
    $(".battle-member-points[data-user-id]").each(function () {
      const $el = $(this);
      const id = idFromElement($el);
      if (!id) return;
      $el.text(all[id]?.points ?? 0);
    });
    $(".battle-member-rank[data-user-id]").each(function () {
      const $el = $(this);
      const id = idFromElement($el);
      if (!id) return;
      $el.text(calculateRank(all[id]?.points ?? 0));
    });
  }

  async function awardBattlePoints(uid, points = POINTS_PER_POST) {
    const key = `users/${String(uid)}`;
    const cur = (await fetchData(key)) || { points: 0, posts: 0 };
    cur.points = (cur.points || 0) + points;
    cur.posts = (cur.posts || 0) + 1;
    await setData(key, cur);
    await updateAllDisplays();
  }

  function setupPostListener() {
    $(document).on("ajax_success", function (event, data, status, xhr) {
      const url = xhr?.responseURL || "";
      if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create")) {
        setTimeout(handleNewPost, 800);
      }
    });
    $(document).on("pageChange", () => setTimeout(() => { updateAllDisplays(); setupBattleStaffEditButtons(); }, 300));
  }

  async function handleNewPost() {
    const $title = $("h1.thread-title a");
    if (!$title.length) return;
    const titleText = $title.text().trim().toUpperCase();
    if (POST_TAGS.some(tag => titleText.includes(tag))) {
      await awardBattlePoints(currentUserId, POINTS_PER_POST);
    }
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
      #battle-edit-modal input[type="number"], #battle-edit-modal input[type="text"] { width:100%; margin-top:5px; margin-bottom:10px; padding:6px; background:#303030; border:1px solid #232323; color:#aaa; border-radius:3px; overflow:hidden; }
      #battle-edit-modal .btn-group { display:flex; gap:6px; margin-bottom:10px; }
      #battle-edit-modal button { border:1px solid #232323; border-radius:3px; background:#272727; text-transform:uppercase; font:bold 12px Roboto; color:#aaa; height:29px; margin-top:5px; line-height:19px; letter-spacing:1px; cursor:pointer; }
      #battle-edit-modal #battle-close-btn { width:100%; background:#232323; margin-left:0px; margin-top:-5px; }
    </style>
    <div id="battle-edit-modal" style="display:none;">
      <div class="title-bar"><span>Battle Point Menu</span></div>
      <div class="modal-body">
        <label>Add/Remove Tags:</label>
        <input type="text" id="battle-tags-input" placeholder="[PVP],[BATTLE]">
        <label>Points Per Tag:</label>
        <input type="number" id="battle-tag-points" placeholder="2">
        <div class="btn-group">
          <button id="battle-update-tags">Update Tags</button>
        </div>
        <label>Global Rank Reset:</label>
        <div class="btn-group">
          <button id="battle-global-reset">Reset All Ranks</button>
        </div>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $("body").append(modalHTML);

    $("#battle-close-btn").on("click", () => $("#battle-edit-modal").hide());
    $("#battle-update-tags").on("click", async () => {
      const tags = $("#battle-tags-input").val().split(",").map(t => t.trim());
      POST_TAGS = tags.filter(t => t.length > 0);
      console.log("Battle Tags Updated:", POST_TAGS);
      alert("Tags updated successfully.");
    });
    $("#battle-global-reset").on("click", async () => {
      if (!confirm("WARNING: This will reset every user's rank to Z! Are you sure?")) return;
      const allUsers = await fetchData("users");
      if (!allUsers) return;
      for (const uid in allUsers) {
        allUsers[uid].points = 0;
      }
      await setData("users", allUsers);
      updateAllDisplays();
      alert("All ranks reset to Z.");
    });
  }

  function setupBattleStaffEditButtons() {
    if (!isStaff) return;
    $(".battle-edit-btn").each(function () {
      const $btn = $(this);
      const id = idFromElement($btn);
      if (!id) return;
      $btn.show().off("click").on("click", () => {
        createBattleEditModal();
        $("#battle-edit-modal").show();
      });
    });
  }

  window.openBattlePointMenu = function () {
    createBattleEditModal();
    $("#battle-edit-modal").show();
  };

  const mo = new MutationObserver(() => {
    updateAllDisplays();
    setupBattleStaffEditButtons();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  function initialize() {
    updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();
