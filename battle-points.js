(async () => {
  const FIREBASE_BASE_URL = "https://battlepoints-e44ae-default-rtdb.firebaseio.com/battle";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);

  const TAG_REWARDS = {
    "[PVP]": 2,
    "[BATTLE]": 2,
    "[BP]": 2,
  };

  // === SIMPLE FETCH HELPERS ===
  async function fetchData(path) {
    const res = await fetch(`${FIREBASE_BASE_URL}/${path}.json`);
    return await res.json();
  }

  async function setData(path, data) {
    await fetch(`${FIREBASE_BASE_URL}/${path}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  async function updateData(path, data) {
    await fetch(`${FIREBASE_BASE_URL}/${path}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  // === USER HANDLING ===
  async function getUserData() {
    let data = await fetchData(`users/${userId}`);
    if (!data) data = {};
    data.username ??= user.username;
    data.display_name ??= user.name;
    data.points ??= 0;
    data.rank_points ??= 0;
    data.earned ??= {};
    return data;
  }

  // ===== FIREFOX SAFE AWARD FUNCTION =====
  async function awardBattlePoints(points, reason = "battle_reward") {
    if (!points || points <= 0) return;

    // Use sendBeacon if available (Firefox-safe on navigation)
    const beaconUrl = `${FIREBASE_BASE_URL}/users/${userId}.json`;
    const data = { points, reason, ts: Date.now() };
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(beaconUrl, JSON.stringify(data));
      console.log("📡 Battle Points sent via sendBeacon:", sent);
    } else {
      // fallback for fetch
      try {
        const userData = await getUserData();
        userData.points += points;
        userData.rank_points += points;
        await setData(`users/${userId}`, userData);
        console.log("✅ Battle Points awarded via fetch");
      } catch (err) {
        console.error("❌ Battle Points fetch failed:", err);
      }
    }

    // update displays after sending
    updateAllDisplays();
  }

  // === RANK LOGIC ===
  function getRankFromPoints(points) {
    const ranks = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");
    const capped = Math.min(points, 50);
    const index = Math.floor(capped / 2);
    return ranks[index] || "Z";
  }

  // === GLOBAL RANK RESET (SAFE BATCHES) ===
  async function globalRankReset() {
    const users = await fetchData("users");
    if (!users) return;
    const allIds = Object.keys(users);
    const batchSize = 25; 
    for (let i = 0; i < allIds.length; i += batchSize) {
      const batch = allIds.slice(i, i + batchSize);
      const updates = {};
      batch.forEach(id => {
        updates[id] = { ...users[id], rank_points: 0 };
      });
      await updateData("users", updates);
      await new Promise(r => setTimeout(r, 250));
    }
    console.log("✅ Global rank reset complete");
    alert("All user ranks have been reset successfully!");
  }

  // === UPDATE DISPLAY ===
  let lastUpdate = 0;
  async function updateAllDisplays() {
    if (Date.now() - lastUpdate < 3000) return;
    lastUpdate = Date.now();

    const allUsers = await fetchData("users") || {};
    const selfData = allUsers[userId] || { points: 0, rank_points: 0 };
    const selfRank = getRankFromPoints(selfData.rank_points);

    $(".battle-user-points").text(selfData.points);
    $(".battle-user-rank").text(selfRank);

    $(".battle-member-points[data-user-id]").each(function () {
      const id = String($(this).data("user-id"));
      const data = allUsers[id];
      $(this).text(data?.points ?? 0);
    });

    $(".battle-member-rank[data-user-id]").each(function () {
      const id = String($(this).data("user-id"));
      const data = allUsers[id];
      $(this).text(getRankFromPoints(data?.rank_points ?? 0));
    });
  }

  // === TAG DETECTION ===
  function getTagValueFromSubject(subject) {
    if (!subject) return 0;
    for (const [tag, value] of Object.entries(TAG_REWARDS)) {
      if (subject.toUpperCase().includes(tag.toUpperCase())) return value;
    }
    return 0;
  }

  // === THREAD & POST LISTENERS (WITH FIREFOX SAFE BP) ===
  function setupThreadAndPostListeners() {
    const threadBtns = $('input[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || "";
      return val.includes("create thread") || val.includes("post thread") || val.includes("new thread");
    });

    threadBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);

      $btn.on("click", function () {
        const subject = $('input[name="subject"]').val() || "";
        const reward = getTagValueFromSubject(subject);
        if (reward > 0) awardBattlePoints(reward, "thread_creation");
      });
    });

    const postBtns = $('input[type="submit"], button[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || $(el).text()?.toLowerCase() || "";
      return val.includes("post reply") || val.includes("create post") || val.includes("reply") || val.includes("quick reply");
    });

    postBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);

      $btn.on("click", function () {
        let threadTitle =
          ($('#thread-title').text() || "").trim() ||
          ($('input[name="subject"]').val() || "").trim() ||
          ($('#navigation-tree a[href*="/thread/"]').last().text() || "").trim() ||
          (document.title.split(" | ")[0] || "").trim() || "";

        const reward = getTagValueFromSubject(threadTitle);
        if (reward > 0) awardBattlePoints(reward, "post_reply");
      });
    });
  }

  // === STAFF MODAL ===
  function createEditModal() {
    if ($('#battle-edit-modal').length) return;
    const modalHTML = `...`; // keep your existing modal HTML
    $('body').append(modalHTML);
  }

  function setupStaffEditButtons() {
    const isStaff = !!proboards.data("user")?.is_staff;
    if (!isStaff) return;

    $(".battle-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = String($btn.data("user-id"));
      if (!memberId || $btn.data("bound")) return;
      $btn.data("bound", true).show();

      $btn.on("click", async function () {
        createEditModal();
        const $modal = $('#battle-edit-modal');
        $modal.show();

        const allUsers = await fetchData("users");
        const memberData = allUsers[memberId] || { points: 0, rank_points: 0 };

        $('#battle-set-value').val(memberData.points);
        $('#battle-change-value').val('');

        $('#battle-set-btn').off().on('click', async () => {
          const newVal = parseInt($('#battle-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
            $modal.hide();
          }
        });

        $('#battle-reset-btn').off().on('click', async () => {
          if (!confirm("Reset this user's rank progress?")) return;
          memberData.rank_points = 0;
          await setData(`users/${memberId}`, memberData);
          updateAllDisplays();
          $modal.hide();
        });

        $('#battle-add-btn').off().on('click', async () => {
          const addVal = parseInt($('#battle-change-value').val());
          if (!isNaN(addVal)) {
            memberData.points += addVal;
            memberData.rank_points += addVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
            $modal.hide();
          }
        });

        $('#battle-remove-btn').off().on('click', async () => {
          const removeVal = parseInt($('#battle-change-value').val());
          if (!isNaN(removeVal)) {
            memberData.points = Math.max(0, memberData.points - removeVal);
            memberData.rank_points = Math.max(0, memberData.rank_points - removeVal);
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
            $modal.hide();
          }
        });

        $('#battle-close-btn').off().on('click', () => $modal.hide());
        $('#battle-reset-all-btn').off().on('click', async () => {
          const confirmReset = confirm("Are you sure you want to reset all user ranks? This will not affect total Battle Points.");
          if (!confirmReset) return;
          await globalRankReset();
          updateAllDisplays();
          $modal.hide();
        });
      });
    });
  }

  // === INIT ===
  function initializeBattlePoints() {
    setupThreadAndPostListeners();
    updateAllDisplays();
    setupStaffEditButtons();
  }

  $(document).ready(() => setTimeout(initializeBattlePoints, 400));
  $(document).on("pageChange", () => setTimeout(initializeBattlePoints, 400));
})();
