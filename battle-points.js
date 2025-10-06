// ============================
// 🔥 Battle Points + Rank System
// ============================

(function () {
  const db = firebase.database();
  let currentEditingUserId = null;

  // ============================
  // 🎨 Modal HTML + Styling
  // ============================
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

  $("body").append(modalHTML);

  // ============================
  // ⚔️ Rank Calculation
  // ============================
  function getBattleRank(pointsSinceReset) {
    const rankLetters = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");
    const capped = Math.min(pointsSinceReset, 50);
    const index = Math.floor(capped / 2);
    return rankLetters[index] || "Z";
  }

  // ============================
  // 📊 Fetch Points & Rank
  // ============================
  async function getBattlePoints(userId) {
    const snapshot = await db.ref(`battle_points/${userId}`).once("value");
    return snapshot.val() || 0;
  }

  async function getPointsSinceReset(userId) {
    const snapshot = await db
      .ref(`battle_points_since_reset/${userId}`)
      .once("value");
    return snapshot.val() || 0;
  }

  async function updateProfileDisplay(userId) {
    const points = await getBattlePoints(userId);
    const sinceReset = await getPointsSinceReset(userId);
    const rank = getBattleRank(sinceReset);

    $(`.battle-member-points[data-user-id='${userId}']`).text(points);
    $(`.battle-member-rank[data-user-id='${userId}']`).text(rank);
  }

  // ============================
  // 💾 Save / Modify Points
  // ============================
  async function awardBattlePoints(userId, amount) {
    const currentPoints = await getBattlePoints(userId);
    const currentResetPoints = await getPointsSinceReset(userId);

    await db.ref(`battle_points/${userId}`).set(currentPoints + amount);
    await db
      .ref(`battle_points_since_reset/${userId}`)
      .set(currentResetPoints + amount);

    await updateProfileDisplay(userId);
  }

  async function setBattlePoints(userId, value) {
    await db.ref(`battle_points/${userId}`).set(value);
    await updateProfileDisplay(userId);
  }

  async function resetBattlePoints(userId) {
    await db.ref(`battle_points_since_reset/${userId}`).set(0);
    await updateProfileDisplay(userId);
  }

  // ============================
  // 🧩 Modal Functionality
  // ============================
  $(".battle-edit-btn").on("click", function () {
    currentEditingUserId = $(this).data("user-id");
    $("#battle-edit-modal").show();
  });

  $("#battle-close-btn").on("click", function () {
    $("#battle-edit-modal").hide();
  });

  $("#battle-set-btn").on("click", async function () {
    const val = parseInt($("#battle-set-value").val());
    if (isNaN(val)) return alert("Enter a valid number.");
    await setBattlePoints(currentEditingUserId, val);
    alert("Points set successfully!");
  });

  $("#battle-add-btn").on("click", async function () {
    const val = parseInt($("#battle-change-value").val());
    if (isNaN(val)) return alert("Enter a valid number.");
    await awardBattlePoints(currentEditingUserId, val);
    alert("Points added successfully!");
  });

  $("#battle-remove-btn").on("click", async function () {
    const val = parseInt($("#battle-change-value").val());
    if (isNaN(val)) return alert("Enter a valid number.");
    await awardBattlePoints(currentEditingUserId, -val);
    alert("Points removed successfully!");
  });

  $("#battle-reset-btn").on("click", async function () {
    if (!confirm("Reset this user's battle rank progress?")) return;
    await resetBattlePoints(currentEditingUserId);
    alert("Battle rank reset!");
  });

  // ============================
  // 🧠 Auto-load profile info
  // ============================
  $(document).ready(async function () {
    $(".battle-member-points, .battle-member-rank").each(async function () {
      const userId = $(this).data("user-id");
      await updateProfileDisplay(userId);
    });
  });

  // ============================
  // 🪄 Awarding BP on post/reply
  // ============================
  const postBtns = $('button[name="create_post"], input[name="create_post"]');

  function getTagValueFromSubject(subject) {
    const tagRegex = /\[PVP\s+TEST\s+(\d+)\]/i;
    const match = subject.match(tagRegex);
    if (match) return parseInt(match[1]);
    return 0;
  }

  postBtns.each(function () {
    const $btn = $(this);
    if ($btn.data("bp-bound")) return;
    $btn.data("bp-bound", true);

    $btn.on("click", async function () {
      // Grab thread title reliably
      let threadTitle =
        $("#thread-title").text().trim() ||
        $('input[name="subject"]').val()?.trim() ||
        $('#navigation-tree a[href*="/thread/"]').last().text().trim() ||
        document.title.split(" | ")[0].trim() ||
        "";

      const reward = getTagValueFromSubject(threadTitle);
      console.log("Awarding BP for reply:", reward, "thread:", threadTitle);

      if (reward > 0) {
        const userId = pb.data("user").id;
        await awardBattlePoints(userId, reward);
      }
    });
  });

  console.log("Battle Points + Rank System initialized");
})();


