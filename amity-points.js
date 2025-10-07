(async () => {
  const FIREBASE_BASE_URL = "https://amitypoints-default-rtdb.firebaseio.com/amity";
  const user = proboards.data("user");
  if (!user || !user.id) return;

  const userId = String(user.id);

  // === ADD TAG REWARD SUPPORT ===
  const TAG_REWARDS = {
    "[AMITY]": 1,
    "[CONTEST]": 10,
    // Add or remove more tag/value pairs freely
    // "[EVENT]": 5,
    // "[BONUS]": 1,
  };

  // === FETCH HELPERS ===
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

  // === EARNING POINTS ===
  async function awardPoint(type) {
    const data = await getUserData();
    const earned = data.earned;
    let updated = false;

    if (type === "like" && earned.likes < 1) {
      data.points += 4;
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

  // === AWARD VIA TAG (NO DAILY CAP) ===
  async function awardAmityTagPoints(points, reason = "tag_reward") {
    if (!points || points <= 0) return;
    const data = await getUserData();
    data.points += points;
    await setData(`users/${userId}`, data);
    updateAllDisplays();
  }

  function getTagValueFromSubject(subject) {
    if (!subject) return 0;
    for (const [tag, value] of Object.entries(TAG_REWARDS)) {
      if (subject.toUpperCase().includes(tag.toUpperCase())) return value;
    }
    return 0;
  }

  // === TAG LISTENERS ===
  function setupThreadAndPostListeners() {
    // Thread creation
    const threadBtns = $('input[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || "";
      return val.includes("create thread") || val.includes("post thread") || val.includes("new thread");
    });

    threadBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("amity-tag-bound")) return;
      $btn.data("amity-tag-bound", true);

      $btn.on("click", async function () {
        const subject = $('input[name="subject"]').val() || "";
        const reward = getTagValueFromSubject(subject);
        if (reward > 0) await awardAmityTagPoints(reward, "thread_creation");
      });
    });

    // Post replies
    const postBtns = $('input[type="submit"], button[type="submit"]').filter((_, el) => {
      const val = $(el).val()?.toLowerCase() || $(el).text()?.toLowerCase() || "";
      return val.includes("post reply") || val.includes("create post") || val.includes("reply") || val.includes("quick reply");
    });

    postBtns.each(function () {
      const $btn = $(this);
      if ($btn.data("amity-tag-bound")) return;
      $btn.data("amity-tag-bound", true);

      $btn.on("click", async function () {
        let threadTitle =
          ($('#thread-title').text() || "").trim() ||
          ($('input[name="subject"]').val() || "").trim() ||
          ($('#navigation-tree a[href*="/thread/"]').last().text() || "").trim() ||
          (document.title.split(" | ")[0] || "").trim() || "";

        const reward = getTagValueFromSubject(threadTitle);
        if (reward > 0) await awardAmityTagPoints(reward, "post_reply");
      });
    });
  }

  // === DISPLAY UPDATE ===
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

  // === STAFF MODAL ===
  function createEditModal() {
    if ($('#amity-edit-modal').length) return;
    const modalHTML = `...`; // unchanged for brevity — keep your original modal
    $('body').append(modalHTML);
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
        createEditModal();
        const $modal = $('#amity-edit-modal');
        $modal.show();

        const memberData = await fetchData(`users/${memberId}`);
        const displayName = memberData?.display_name ?? `User ${memberId}`;
        let currentValue = memberData.points ?? 0;

        $('#amity-set-value').val(currentValue);
        $('#amity-change-value').val('');

        $('#amity-set-btn').off('click').on('click', async () => {
          const newVal = parseInt($('#amity-set-value').val());
          if (!isNaN(newVal)) {
            memberData.points = newVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#amity-reset-btn').off('click').on('click', () => {
          $('#amity-set-value').val(currentValue);
          $('#amity-change-value').val('');
        });

        $('#amity-add-btn').off('click').on('click', async () => {
          const addVal = parseInt($('#amity-change-value').val());
          if (!isNaN(addVal)) {
            memberData.points += addVal;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#amity-remove-btn').off('click').on('click', async () => {
          const removeVal = parseInt($('#amity-change-value').val());
          if (!isNaN(removeVal)) {
            memberData.points -= removeVal;
            if (memberData.points < 0) memberData.points = 0;
            await setData(`users/${memberId}`, memberData);
            updateAllDisplays();
          }
        });

        $('#amity-close-btn').off('click').on('click', () => {
          $modal.hide();
        });
      });
    });
  }

  // === EVENT HANDLERS ===
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

  // === INITIALIZE ===
  function initializeAmity() {
    bindClickHandlers();
    setupThreadAndPostListeners(); // <-- NEW
    updateAllDisplays();
    setupStaffEditButtons();
  }

  $(document).ready(() => setTimeout(initializeAmity, 300));
  $(document).on("pageChange", () => setTimeout(initializeAmity, 300));
})();


