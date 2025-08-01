(async () => {
  const cooldownMs = 23 * 60 * 60 * 1000;
  const backendPath = "amity";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);
  const userRef = db.ref(`${backendPath}/users/${userId}`);

  async function getUserData() {
    const snap = await userRef.get();
    const now = Date.now();

    let data = snap.exists() ? snap.val() : {};
    data.username ??= user.username;
    data.display_name ??= user.name;
    data.points ??= 0;
    data.earned ??= {};
    data.earned.likes ??= 0;
    data.earned.sprites ??= 0;
    data.earned.last_reset ??= now;

    if (now - data.earned.last_reset >= cooldownMs) {
      data.earned.likes = 0;
      data.earned.sprites = 0;
      data.earned.last_reset = now;
      await userRef.set(data);
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
      await userRef.set(data);
      updateAllDisplays();
    }
  }

  async function updateAllDisplays() {
    const snapSelf = await userRef.get();
    const selfPoints = snapSelf.val()?.points ?? 0;
    $(".amity-user-points").text(`${selfPoints}`);

    $(".amity-member-points[data-user-id]").each(async function () {
      const $el = $(this);
      const memberId = $el.data("user-id");
      if (!memberId) return;

      const memberRef = db.ref(`${backendPath}/users/${memberId}`);
      const memberSnap = await memberRef.get();
      const memberPoints = memberSnap.val()?.points ?? 0;

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

        const memberRef = db.ref(`${backendPath}/users/${memberId}`);
        const snap = await memberRef.get();
        const data = snap.val() || {};
        const displayName = data.display_name ?? `User ${memberId}`;

        const newPoints = prompt(`Set new Amity Points for ${displayName}:`, currentPoints);

        if (newPoints !== null && !isNaN(parseInt(newPoints))) {
          data.points = parseInt(newPoints);
          await memberRef.set(data);
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
