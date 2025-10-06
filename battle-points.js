(async function () {
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

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const siteKey = "battle";
  const ref = p => database.ref(`${siteKey}/${p}`);
  const fetchData = async p => (await ref(p).get()).val();
  const setData = async (p, d) => ref(p).set(d);

  const userObj = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("user") :
                  (typeof pb !== "undefined" && pb.data) ? pb.data("user") : null;
  if (!userObj || !userObj.id) return;
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;

  const POINTS_PER_POST = 2;

  function calculateRank(points) {
    const step = Math.floor(points / 2);
    let n = 25 - step;
    if (n < 0) n = 0;
    return String.fromCharCode(65 + n);
  }

  function idFromElement($el) {
    let id = $el.attr("data-user-id") ?? $el.attr("data-battle-points") ?? $el.attr("data-battle-id") ?? $el.attr("data-battle-user");
    if (!id) {
      id = $el.data("user-id") ?? $el.data("userid") ?? $el.data("userId") ?? $el.data("battle-points") ?? $el.data("battlePoints");
    }
    return id ? String(id) : null;
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
  }

  async function handleNewPost() {
    const $title = $("h1.thread-title a");
    if (!$title.length) return;
    const titleText = $title.text().trim().toUpperCase();
    if (titleText.includes("[PVP]") || titleText.includes("[BATTLE]")) {
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
        <label>Global Rank Reset:</label>
        <div class="btn-group">
          <button id="battle-global-reset-btn" style="background:#a00;">Reset All Ranks to Z</button>
        </div>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $("body").append(modalHTML);

    $("#battle-global-reset-btn").on("click", async () => {
      if (!confirm("WARNING: This will reset ALL users' ranks to Z. This cannot be undone.")) return;
      const allUsers = (await fetchData("users")) || {};
      for (const uid in allUsers) {
        allUsers[uid].rank = "Z";
      }
      await setData("users", allUsers);
      updateAllDisplays();
    });
  }

  function setupBattleStaffEditButtons() {
    if (!isStaff) return;
    $(".battle-edit-btn").each(function () {
      const $btn = $(this);
      const bound = $btn.data("bound");
      const id = idFromElement($btn) || $btn.attr("data-user-id") || $btn.data("userId") || $btn.attr("data-userid");
      if (!id) return;
      if (bound) {
        $btn.show();
        return;
      }
      $btn.data("bound", true).show();
      $btn.off("click").on("click", async function () {
        createBattleEditModal();
        const $modal = $("#battle-edit-modal");
        $modal.show();
        let data = (await fetchData(`users/${id}`)) || { points: 0, posts: 0 };
        $("#battle-set-value").val(data.points);
        $("#battle-change-value").val("");
        $("#battle-set-btn").off().on("click", async () => {
          const v = parseInt($("#battle-set-value").val());
          if (!isNaN(v)) {
            data.points = v;
            await setData(`users/${id}`, data);
            updateAllDisplays();
          }
        });
        $("#battle-reset-btn").off().on("click", async () => {
          data = { points: 0, posts: 0 };
          await setData(`users/${id}`, data);
          updateAllDisplays();
        });
        $("#battle-add-btn").off().on("click", async () => {
          const add = parseInt($("#battle-change-value").val());
          if (!isNaN(add)) {
            data.points = (data.points || 0) + add;
            await setData(`users/${id}`, data);
            updateAllDisplays();
          }
        });
        $("#battle-remove-btn").off().on("click", async () => {
          const rem = parseInt($("#battle-change-value").val());
          if (!isNaN(rem)) {
            data.points = Math.max(0, (data.points || 0) - rem);
            await setData(`users/${id}`, data);
            updateAllDisplays();
          }
        });
        $("#battle-close-btn").off().on("click", () => $modal.hide());
      });
    });
  }

  function initialize() {
    updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  $(document).ready(() => setTimeout(initialize, 300));
  $(document).on("pageChange", () => setTimeout(initialize, 300));
})();

