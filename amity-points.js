(async () => {
  const cooldownMs = 23 * 60 * 60 * 1000;
  const backendPath = "amity";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);
  const userRef = db.ref(`${backendPath}/users/${userId}`);

  console.log(`[AMITY DEBUG] Firebase path: ${userRef.toString()}`);

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
      console.log("[AMITY DEBUG] Reset daily caps");
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
      console.log(`[AMITY] +1 point for ${type} (total: ${data.points})`);
      updateAllDisplays();
    } else {
      console.log(`[AMITY] Daily ${type} cap reached`);
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

      console.log(`[AMITY DEBUG] Displaying user ${memberId}'s points: ${memberPoints}`);
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
        const newPoints = prompt(`Set new Amity Points for User ID ${memberId}:`, currentPoints);

        if (newPoints !== null && !isNaN(parseInt(newPoints))) {
          const memberRef = db.ref(`${backendPath}/users/${memberId}`);
          const snap = await memberRef.get();
          const data = snap.val() || {};

          data.points = parseInt(newPoints);
          await memberRef.set(data);
          alert("Amity Points updated.");
          updateAllDisplays();
        }
      });
    });
  }

  function bindClickHandlers() {
    console.log("[AMITY DEBUG] Binding click handlers directly...");

    $(".js-likes-button").each(function () {
      const $btn = $(this);
      if (!$btn.data("amity-bound")) {
        $btn.data("amity-bound", true);
        $btn.on("click", function () {
          if ($btn.hasClass("liked")) {
            console.log("[AMITY DEBUG] Like already exists, not awarding point.");
            return;
          }
          console.log("[AMITY DEBUG] Direct click on like button");
          awardPoint("like");
        });
      }
    });

    $(".amity-sprite").each(function () {
      const $img = $(this);
      if (!$img.data("amity-bound")) {
        $img.data("amity-bound", true);
        $img.on("click", function () {
          console.log("[AMITY DEBUG] Direct click on sprite");
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
    console.log("[AMITY DEBUG] Page change detected");
    setTimeout(initializeAmity, 300);
  });
})();



