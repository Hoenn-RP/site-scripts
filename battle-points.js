(async function () {
  // === FIREBASE INITIALIZATION ===
  const firebaseConfig = {
    apiKey: "AIzaSyDc2kM7-vPYLkEynYvItRkRyOamBmtRx1h",
    authDomain: "hoenn-amity.firebaseapp.com",
    databaseURL: "https://hoenn-amity-default-rtdb.firebaseio.com/",
    projectId: "hoenn-amity",
    storageBucket: "hoenn-amity.appspot.com",
    messagingSenderId: "1088882615750",
    appId: "1:1088882615750:web:10ed12d30850f3e20da5d3",
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

  const siteKey = "battle"; // base node in Firebase

  // === HELPERS ===
  const ref = (path) => database.ref(`${siteKey}/${path}`);
  const fetchData = async (path) => (await ref(path).get()).val();
  const setData = async (path, data) => ref(path).set(data);
  const updateData = async (path, data) => ref(path).update(data);

  const isStaff = pb.data("user").is_staff;
  const currentUserId = pb.data("user").id;

  // === SETTINGS ===
  const POST_TAGS = ["[PVP]", "[BATTLE]"];
  const POINTS_PER_POST = 5;
  const COOLDOWN_HOURS = 23;

  // === LOCAL CACHE ===
  const cache = {};
  const now = Date.now();

  // === MAIN ===
  async function initBattle() {
    await updateAllDisplays();
    setupBattleStaffEditButtons();
    setupPostListener();
  }

  // === POST DETECTION ===
  function setupPostListener() {
    // detect successful post via AJAX
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
    let userData = (await fetchData(userRef)) || {
      points: 0,
      posts: 0,
      lastEarn: 0,
    };

    const elapsed = now - (userData.lastEarn || 0);
    const cooldown = COOLDOWN_HOURS * 60 * 60 * 1000;

    if (elapsed < cooldown) {
      console.log("[Battle Points] Cooldown not yet expired.");
      return;
    }

    userData.points += POINTS_PER_POST;
    userData.posts += 1;
    userData.lastEarn = now;
    await setData(userRef, userData);

    console.log(`[Battle Points] +${POINTS_PER_POST} awarded for ${matchedTag} thread!`);
    updateAllDisplays();
  }

  // === DISPLAY ===
  async function updateAllDisplays() {
    const all = await fetchData("users");
    if (!all) return;

    $("[data-battle-points]").each(function () {
      const $el = $(this);
      const id = $el.data("battle-points");
      const val = all?.[id]?.points ?? 0;
      $el.text(val);
    });
  }

  // === STAFF EDITING ===
  function createBattleEditModal() {
    if ($("#battle-edit-modal").length) return;
    const modalHTML = `
      <div id="battle-edit-modal" style="
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #222; color: #eee; border-radius: 10px; padding: 20px;
        box-shadow: 0 0 15px rgba(0,0,0,0.6); z-index: 9999; display:none;
      ">
        <div style="font-weight:700; font-size:18px; margin-bottom:10px;">Edit Battle Points</div>
        <label>Set New Value:</label><br>
        <input type="number" id="battle-set-value" style="width:100%; margin-bottom:6px;">
        <button id="battle-set-btn">Set</button>
        <button id="battle-reset-btn">Reset</button>
        <br><br>
        <label>Modify Points:</label><br>
        <input type="number" id="battle-change-value" style="width:100%; margin-bottom:6px;">
        <button id="battle-add-btn">Add</button>
        <button id="battle-remove-btn">Remove</button>
        <br><br>
        <button id="battle-close-btn" style="width:100%;">Close</button>
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

        $("#battle-set-btn")
          .off()
          .on("click", async () => {
            const v = parseInt($("#battle-set-value").val());
            if (!isNaN(v)) {
              data.points = v;
              await setData(`users/${id}`, data);
              updateAllDisplays();
            }
          });

        $("#battle-add-btn")
          .off()
          .on("click", async () => {
            const add = parseInt($("#battle-change-value").val());
            if (!isNaN(add)) {
              data.points += add;
              await setData(`users/${id}`, data);
              updateAllDisplays();
            }
          });

        $("#battle-remove-btn")
          .off()
          .on("click", async () => {
            const rem = parseInt($("#battle-change-value").val());
            if (!isNaN(rem)) {
              data.points -= rem;
              if (data.points < 0) data.points = 0;
              await setData(`users/${id}`, data);
              updateAllDisplays();
            }
          });

        $("#battle-reset-btn")
          .off()
          .on("click", async () => {
            data = { points: 0, posts: 0, lastEarn: 0 };
            await setData(`users/${id}`, data);
            updateAllDisplays();
          });

        $("#battle-close-btn")
          .off()
          .on("click", () => $modal.hide());
      });
    });
  }

  // === INIT ===
  initBattle();
})();




