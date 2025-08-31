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

  function createEditModal() {
    if ($('#amity-edit-modal').length) return;

    const modalHTML = `
    <style>
        #amity-edit-modal {
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
    
        #amity-edit-modal .title-bar {
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
    
        #amity-edit-modal .modal-body {
            padding: 12px;
        }
    
        #amity-edit-modal label {
            font: bold 9px Roboto;
            letter-spacing: 2px;
            color: #aaa;
            text-transform: uppercase;
            display: block;
            margin-top: 10px;
            margin-left: 2px;
        }
    
        #amity-edit-modal input[type="number"] {
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
    
        #amity-edit-modal .btn-group {
            display: flex;
            gap: 6px;
            margin-bottom: 10px;
        }
    
        #amity-edit-modal button {
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
    
        #amity-edit-modal #amity-close-btn {
            width: 100%;
            background: #232323;
            margin-left: 0px;
            margin-top: -5px;
        }
    </style>
    
    <div id="amity-edit-modal" style="display:none;">
        <div class="title-bar">
            <span>Edit Amity Points</span>
        </div>
        <div class="modal-body">
            <label>Set New Value:</label>
            <div class="btn-group">
                <input type="number" id="amity-set-value" />
                <button id="amity-set-btn">Set</button>
                <button id="amity-reset-btn">Reset</button>
            </div>
    
            <label>Add or Remove:</label>
            <div class="btn-group">
                <input type="number" id="amity-change-value" />
                <button id="amity-add-btn">Add</button>
                <button id="amity-remove-btn">Remove</button>
            </div>
    
            <button id="amity-close-btn">Close</button>
        </div>
    </div>
    `;
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

        const $display = $(`.amity-member-points[data-user-id='${memberId}']`);
        const currentPoints = parseInt($display.text()) || 0;

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
