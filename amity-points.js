(async () => {
  const FIREBASE_BASE_URL = "https://amitypoints-default-rtdb.firebaseio.com/amity";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);

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

  async function getUserData() {
    let data = await fetchData(`users/${userId}`);
    const now = Date.now();

    if (!data) data = {};
    data.username ??= user.username;
    data.display_name ??= user.name;
    data.points ??= 0;
    data.earned ??= {};
    data.earned.likes ??= 0;
    data.earned.sprites ??= 0;
    data.earned.last_reset ??= now;

    const nowDate = new Date(now);
    const todayMidnightUTC = Date.UTC(
      nowDate.getUTCFullYear(),
      nowDate.getUTCMonth(),
      nowDate.getUTCDate()
    );

    if (data.earned.last_reset < todayMidnightUTC) {
      data.earned.likes = 0;
      data.earned.sprites = 0;
      data.earned.last_reset = now;
      await setData(`users/${userId}`, data);
    }

    return data;
  }

  async function awardPoint(type) {
    const data = await getUserData();
    const earned = data.earned;
    let updated = false;

    if (type === "like" && earned.likes < 4) {
      data.points += 1;
      earned.likes++;
      updated = true;
    } else if (type === "sprite" && earned.sprites < 6) {
      data.points += 1;
      earned.sprites++;
      updated = true;
    }

    if (updated) {
      data.earned = earned;
      await setData(`users/${userId}`, data);
      updateAllDisplays();
    }
  }

  async function updateAllDisplays() {
    const selfData = await fetchData(`users/${userId}`);
    const selfPoints = selfData?.points ?? 0;
    $(".amity-user-points").text(`${selfPoints}`);

    $(".amity-member-points[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;

      const memberData = await fetchData(`users/${memberId}`);
      const memberPoints = memberData?.points ?? 0;

      $el.text(`${memberPoints}`);
    });
  }

  function setupStaffEditButtons() {
    const isStaff = !!proboards.data("user")?.is_staff;
    if (!isStaff) return;

    $(".amity-edit-btn[data-user-id]").each(function () {
      const $btn = $(this);
      const memberId = $btn.data("user-id");
      if (!memberId || $btn.data("bound")) return;

      $btn.data("bound", true);
      $btn.show();

      $btn.on("click", async function () {
        const $display = $(`.amity-member-points[data-user-id='${memberId}']`);
        const currentPoints = parseInt($display.text()) || 0;

        const memberData = await fetchData(`users/${memberId}`);
        const displayName = memberData?.display_name ?? `User ${memberId}`;

        const newPoints = prompt(`Set new Amity Points for ${displayName}:`, currentPoints);
        if (newPoints !== null && !isNaN(parseInt(newPoints))) {
          memberData.points = parseInt(newPoints);
          await setData(`users/${memberId}`, memberData);
          alert("Amity Points updated.");
          updateAllDisplays();
        }
      });
    });
  }

  function bindClickHandlers() {
    $(".js-likes-button").each(function () {
      const $btn = $(this);
      if (!$btn.data("amity-bound")) {
        $btn.data("amity-bound", true);
        $btn.on("click", function () {
          if ($btn.hasClass("liked")) return;
          awardPoint("like");
        });
      }
    });

    $(".amity-sprite").each(function () {
      const $img = $(this);
      if (!$img.data("amity-bound")) {
        $img.data("amity-bound", true);
        $img.on("click", function () {
          awardPoint("sprite");
        });
      }
    });
  }

  function initializeAmity() {
    bindClickHandlers();
    updateAllDisplays();
    setupStaffEditButtons();
  }

  $(document).ready(() => {
    setTimeout(initializeAmity, 300);
  });

  $(document).on("pageChange", () => {
    setTimeout(initializeAmity, 300);
  });
})();




