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
  const updateData = async (p, d) => ref(p).update(d);

  const userObj = (typeof proboards !== "undefined" && proboards.data) ? proboards.data("user") :
                  (typeof pb !== "undefined" && pb.data) ? pb.data("user") : null;
  if (!userObj || !userObj.id) return;
  const currentUserId = String(userObj.id);
  const isStaff = !!userObj.is_staff;

  const POST_TAGS = ["[PVP]", "[BATTLE]"];
  const POINTS_PER_POST = 2;

  function calculateRank(points) {
    const step = Math.floor(points / 2);
    let rank = "";
    let n = step;
    do {
      rank = String.fromCharCode(90 - (n % 26)) + rank;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return rank || "Z";
  }

  function idFromElement($el) {
    let id = $el.attr("data-user-id") ?? $el.attr("data-battle-points") ?? $el.attr("data-battle-id") ?? $el.attr("data-battle-user");
    if (!id) {
      id = $el.data("user-id") ?? $el.data("userid") ?? $el.data("userId") ?? $el.data("battle-points") ?? $el.data("battlePoints");
    }
    return id == null ? null : String(id);
  }

  async function updateAllDisplays() {
    const all = (await fetchData("users")) || {};
    $(".battle-member-points[data-user-id]").each(function () {
      const $el = $(this);
      const id = idFromElement($el);
      if (!id) return;
      const pts = all[id]?.points ?? 0;
      $el.text(pts);
    });
    $(".battle-member-rank[data-user-id]").each(function () {
      const $el = $(this);
      const id = idFromElement($el);
      if (!id) return;
      const pts = all[id]?.points ?? 0;
      $el.text(calculateRank(pts));
    });
  }

  async function awardBattlePoints(uid, points = POINTS_PER_POST) {
    const key = `users/${String(uid)}`;
    const cur = (await fetchData(key)) || { points: 0, posts: 0 };
    cur.points = (cur.points || 0) + points;
    cur.posts = (cur.posts || 0) + 1;
    await setData(key, cur);
    updateAllDisplays();
  }

  function setupPostListener() {
    $(document).on("ajax_success", async (event, data, status, xhr) => {
      const url = xhr?.responseURL || "";
      if (url.includes("/post/") || url.includes("/thread/") || url.includes("/post/create")) {
        setTimeout(handleNewPost, 800);
      }
    });
    $(document).on("pageChange", () => setTimeout(() => {
      updateAllDisplays();
      setupBattleStaffEditButtons();
    }, 250));
  }

  async function handleNewPost() {
    let threadSubject = "";
    try {
      threadSubject = proboards.data("thread")?.subject?.toUpperCase() || "";
    } catch(e) {}
    if (!threadSubject) {
      const $title = $("h1.thread-title, .thread-title");
      if ($title.length) threadSubject = $title.text().trim().toUpperCase();
    }
    const matched = POST_TAGS.some(tag => threadSubject.includes(tag));
    if (!matched) return;

    let postAuthorId = currentUserId;
    try {
      postAuthorId = String(proboards.data("post")?.author_id || proboards.data("post")?.user_id || currentUserId);
    } catch(e) {}
    if (!postAuthorId) return;

    await awardBattlePoints(postAuthorId, POINTS_PER_POST);
    console.log(`[BattlePoints] Awarded ${POINTS_PER_POST} points for posting in: ${threadSubject}`);
  }

  function createBattleEditModal() {
    if ($("#battle-edit-modal").length) return;
    const modalHTML = `
    <style>
      #battle-edit-modal {position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 320px;background: #2b2b2b;border: 1px solid #232323;border-radius: 4px;font-family: 'Roboto', sans-serif;color: #fff;z-index: 10000;}
      #battle-edit-modal .title-bar {background-color: #272727;background-image: url(https://image.ibb.co/dMFuMc/flower.png);background-repeat: no-repeat;background-position: center right;padding: 8px 12px;border-bottom: 1px solid #232323;font: bold 9px 'Quattrocento Sans', sans-serif;color: #aaa !important;text-transform: uppercase;display: flex;justify-content: space-between;align-items: center;}
      #battle-edit-modal .modal-body {padding: 12px;}
      #battle-edit-modal label {font: bold 9px Roboto;letter-spacing: 2px;color: #aaa;text-transform: uppercase;display:block;margin-top:10px;margin-left:2px;}
      #battle-edit-modal input[type="number"] {width:100%;margin-top:5px;margin-bottom:10px;padding:6px;background:#303030;border:1px solid #232323;color:#aaa;border-radius:3px;overflow:hidden;}
      #battle-edit-modal .btn-group {display:flex;gap:6px;margin-bottom:10px;}
      #battle-edit-modal button {border:1px solid #232323;border-radius:3px;background:#272727;text-transform:uppercase;font:bold 12px Roboto;color:#aaa;height:29px;margin-top:5px;line-height:19px;letter-spacing:1px;cursor:pointer;}
      #battle-edit-modal #battle-close-btn {width:100%;background:#232323;margin-left:0px;margin-top:-5px;}
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
        <label style="color:red;">⚠ This will reset EVERYONE'S rank to Z without touching points</label>
        <button id="battle-global-reset-btn" style="background:red;color:white;">Global Reset Ranks</button>
        <button id="battle-close-btn">Close</button>
      </div>
    </div>`;
    $("body").append(modalHTML);
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

        $("#battle-global-reset-btn").off().on("click", async () => {
          if (!confirm("⚠ This will reset EVERYONE'S rank to Z. Are you sure?")) return;
          const allUsers = await fetchData("users") || {};
          for (const uid in allUsers) {
            await updateData(`users/${uid}`, { rank: "Z" });
          }
          updateAllDisplays();
          alert("Ranks have been reset to Z for all users.");
        });

        $("#battle-close-btn").off().on("click", () => $modal.hide());
      });
    });
  }

  const mo = new MutationObserver(mutations => {
    let added = false;
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes || [])) {
        if (n.nodeType !== 1) continue;
        try {
          if (n.matches && (n.matches(".battle-member-points") || n.matches(".battle-member-rank") || n.matches(".battle-edit-btn") ||
              n.querySelector(".battle-member-points") || n.querySelector(".battle-member-rank") || n.querySelector(".battle-edit-btn") )) {
            added = true;
            break;
          }
        } catch (e) {}
      }
      if (added) break;
    }
    if (added) {
      setTimeout(() => {
        updateAllDisplays();
        setupBattleStaffEditButtons();
      }, 60);
    }
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
