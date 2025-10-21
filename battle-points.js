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

  // -- Hybrid PUT (fetch or beacon) --
  async function setData(path, data) {
    const url = `${FIREBASE_BASE_URL}/${path}.json`;
    const payload = JSON.stringify(data);

    // Firefox unload-safe fallback
    if (navigator.userAgent.includes("Firefox") && document.visibilityState === "hidden") {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      console.log("🦊 sendBeacon used for PUT:", ok);
      return;
    }

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: payload
    });
  }

  // -- Hybrid PATCH (fetch or beacon) --
  async function updateData(path, data) {
    const url = `${FIREBASE_BASE_URL}/${path}.json`;
    const payload = JSON.stringify(data);

    if (navigator.userAgent.includes("Firefox") && document.visibilityState === "hidden") {
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      console.log("🦊 sendBeacon used for PATCH:", ok);
      return;
    }

    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: payload
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

  async function awardBattlePoints(points, reason = "battle_reward") {
    if (!points || points <= 0) return;
    const data = await getUserData();
    data.points += points;
    data.rank_points += points;
    await setData(`users/${userId}`, data);
    updateAllDisplays();
  }

  // === RANK LOGIC ===
  function getRankFromPoints(points) {
    const ranks = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("");
    const capped = Math.min(points, 50);
    const index = Math.floor(capped / 2);
    return ranks[index] || "Z";
  }

  // === GLOBAL RANK RESET ===
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

  // === DISPLAY ===
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

  // === EVENT HELPERS ===
  function forceBeaconOnClick($btn, rewardGetter) {
    $btn.on("click", async function () {
      const reward = rewardGetter();
      if (reward <= 0) return;

      const data = await getUserData();
      data.points += reward;
      data.rank_points += reward;

      // use sendBeacon if possible before unload
      const payload = JSON.stringify(data);
      const url = `${FIREBASE_BASE_URL}/users/${userId}.json`;
      const blob = new Blob([payload], { type: "application/json" });
      const used = navigator.sendBeacon(url, blob);
      console.log("🔁 Reward beacon:", used ? "sent" : "fallback");

      if (!used) await setData(`users/${userId}`, data);
    });
  }

  // === LISTENERS ===
  function setupThreadAndPostListeners() {
    const threadBtns = $('input[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || "";
      return val.includes("create thread") || val.includes("post thread") || val.includes("new thread");
    });

    threadBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);
      forceBeaconOnClick($btn, () => getTagValueFromSubject($('input[name="subject"]').val() || ""));
    });

    const postBtns = $('input[type="submit"], button[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || $(el).text()?.toLowerCase() || "";
      return val.includes("post reply") || val.includes("create post") || val.includes("reply") || val.includes("quick reply");
    });

    postBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("bp-bound")) return;
      $btn.data("bp-bound", true);
      forceBeaconOnClick($btn, () => {
        let threadTitle =
          ($('#thread-title').text() || "").trim() ||
          ($('input[name="subject"]').val() || "").trim() ||
          ($('#navigation-tree a[href*="/thread/"]').last().text() || "").trim() ||
          (document.title.split(" | ")[0] || "").trim() || "";
        return getTagValueFromSubject(threadTitle);
      });
    });
  }

  // === STAFF MODAL === (unchanged) ===
  function createEditModal() {
    if ($('#battle-edit-modal').length) return;
    const modalHTML = `...` // your same CSS/HTML as before
    $('body').append(modalHTML);
  }

  function setupStaffEditButtons() {
    const isStaff = !!proboards.data("user")?.is_staff;
    if (!isStaff) return;
    // same code as before ...
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
