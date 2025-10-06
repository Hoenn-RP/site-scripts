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

  const isStaff = pb.data("user").is_staff;
  const currentUserId = pb.data("user").id;

  const POST_TAGS = ["[PVP]", "[BATTLE]"];
  const POINTS_PER_POST = 2;

  // === RANK CALCULATION ===
  function calculateRank(points) {
    const step = Math.floor(points / 2);
    let rank = "";
    let n = step;
    do {
      rank = String.fromCharCode(65 + (n % 26)) + rank;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return rank || "A";
  }

  async function initBattle() {
    await updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
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
    const matchedTag = POST_TAGS.find((tag) => titleText.includes(tag));
    if (!matchedTag) return;

    const userRef = `users/${currentUserId}`;
    let userData = (await fetchData(userRef)) || { points: 0, posts: 0 };
    userData.points += POINTS_PER_POST;
    userData.posts += 1;

    await setData(userRef, userData);
    console.log(`[Battle Points] +${POINTS_PER_POST} for ${matchedTag} thread!`);
    updateAllDisplays();
  }

  // === DISPLAY ===
  async function updateAllDisplays() {
    const all = await fetchData("users");
    if (!all) return;

    $(".battle-member-points[data-user-id]").each(function () {
      const $el = $(this);
      const id = $el.data("user-id");
      const val = all?.[id]?.points ?? 0;
      $el.text(val);
    });

    $(".battle-member-rank[data-user-id]").each(function () {
      const $el = $(this);
      const id = $el.data("user-id");
      const val = all?.[id]?.points ?? 0;
      const rank = calculateRank(val);
      $el.text(rank);
    });
  }

  // === STAFF EDITING (with Amity-style modal) ===
  function createBattleEditModal() {
    if ($("#battle-edit-modal").length) return;
    const modalHTML = `
      <div id="battle-edit-modal" style="
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: #1e1e1e;
        color: #eee;
        border-radius: 12px;
        padding: 20px 25px;
        box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        z-index: 9999;
        display: none;
        max-width: 320px;
      ">
        <div style="font-weight:700; font-size:18px; margin-bottom:12px; text-align:center; color:#90caf9;">Edit Battle Points</div>
        <label style="font-weight:600;">Set New Value:</label><br>
        <input type="number" id="battle-set-value" style="width:100%; margin-bottom:8px; padding:5px; border:1px solid #444; background:#2a2a2a; color:#fff; border-radius:6px;">
        <div style="text-align:center; margin-bottom:10px;">
          <button id="battle-set-btn" style="margin:3px; padding:5px 12px; background:#388e3c; color:#fff; border:none; border-radius:6px; cursor:pointer;">Set</button>
          <button id="battle-reset-btn" style="margin:3px; padding:5px 12px; background:#c62828; color:#fff; border:none; border-radius:6px; cursor:pointer;">Reset</button>
        </div>

        <label style="font-weight:600;">Modify Points:</label><br>
        <input type="number" id="battle-change-value" style="width:100%; margin-bottom:8px; padding:5px; border:1px solid #444; background:#2a2a2a; color:#fff; border-radius:6px;">
        <div style="text-align:center; margin-bottom:10px;">
          <button id="battle-add-btn" style="margin:3px; padding:5px 12px; background:#1976d2; color:#fff; border:none; border-radius:6px; cursor:pointer;">Add</button>
          <button id="battle-remove-btn" style="margin:3px; padding:5px 12px; background:#f57c00; color:#fff; border:none; border-radius:6px; cursor:pointer;">Remove</button>
        </div>

        <div style="text-align:center;">
          <button id="battle-close-btn" style="margin-top:5px; padding:6px 12px; width:100%; background:#555; color:#fff; border:none; border-radius:6px; cursor:pointer;">Close</button>
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

        let data = (await fetchData(`users/${id}`)) || { points: 0 };
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

        $("#battle-reset-btn").off().on("click", async () => {
          data = { points: 0, posts: 0 };
          await setData(`users/${id}`, data);
          updateAllDisplays();
        });

        $("#battle-close-btn").off().on("click", () => $modal.hide());
      });
    });
  }

  initBattle();
})();
