// == Battle Points System ==
// Firebase setup: replace with your project info
const firebaseConfig = {
  databaseURL: "https://battlepoints-default-rtdb.firebaseio.com/",
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "battlepoints.firebaseapp.com",
  projectId: "battlepoints",
  storageBucket: "battlepoints.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- FIREBASE INIT ---
(function initBattlePoints() {
  console.log("[BP] loading firebase compat libs...");
  if (typeof firebase === "undefined") return console.error("[BP] Firebase not loaded!");
  if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
  console.log("[BP] firebase.initializeApp() OK");
})();

const db = firebase.database();

// --- SETTINGS ---
const POST_TAG_VALUES = {
  "[PVP]": 2,
  "[BATTLE]": 1,
};
const RESET_PATH = "rank_reset_flag";
const USERS_PATH = "users";
const AWARDED_POSTS_PATH = "awarded_posts";

// --- HELPERS ---
function getThreadSubject() {
  const raw = document.title || "";
  const subject = raw.split("|")[0].trim(); // strip site name
  return subject;
}

function getTagPoints(subject) {
  for (const tag in POST_TAG_VALUES) {
    if (subject.includes(tag)) return POST_TAG_VALUES[tag];
  }
  return 0;
}

function getCurrentUserId() {
  try {
    return pb.data("user").id || null;
  } catch {
    return null;
  }
}

async function getRankResetFlag() {
  const snap = await db.ref(RESET_PATH).once("value");
  return !!snap.val();
}

async function setRankResetFlag(value) {
  await db.ref(RESET_PATH).set(value);
}

async function getUserData(uid) {
  const snap = await db.ref(`${USERS_PATH}/${uid}`).once("value");
  return snap.val() || { battlePoints: 0, rank: 1 };
}

async function setUserData(uid, data) {
  await db.ref(`${USERS_PATH}/${uid}`).set(data);
}

async function hasPostBeenAwarded(postId) {
  const snap = await db.ref(`${AWARDED_POSTS_PATH}/${postId}`).once("value");
  return !!snap.val();
}

async function markPostAwarded(postId) {
  await db.ref(`${AWARDED_POSTS_PATH}/${postId}`).set(true);
}

function extractPostId(el) {
  const id = el.getAttribute("id");
  if (!id) return null;
  const match = id.match(/post-(\d+)/);
  return match ? match[1] : null;
}

function updateLocalDisplays() {
  const userId = getCurrentUserId();
  if (!userId) return;
  db.ref(`${USERS_PATH}/${userId}`).on("value", snap => {
    const data = snap.val();
    if (!data) return;
    const { battlePoints, rank } = data;
    $(".battle-points-display").text(battlePoints || 0);
    $(".battle-rank-display").text(rank || 1);
  });
}

// --- MAIN ---
async function initializeBattlePoints() {
  const userId = getCurrentUserId();
  const isStaff = pb.data("user").is_staff;
  console.log("[BP] currentUserId:", userId, "isStaff:", isStaff);
  console.log("[BP] POST_TAG_VALUES:", POST_TAG_VALUES);

  if (!userId) return console.warn("[BP] No user logged in; skipping.");

  // Ensure data paths exist
  await getRankResetFlag();
  await getUserData(userId);
  updateLocalDisplays();

  // Epoch-style reset handled elsewhere (not wiping points)
  console.log("[BP] initialization complete — listening for new posts");

  const observer = new MutationObserver(async mutations => {
    for (const m of mutations) {
      for (const added of m.addedNodes) {
        if (!(added instanceof HTMLElement)) continue;
        const post = added.closest(".post");
        if (!post) continue;

        const postId = extractPostId(post);
        if (!postId) continue;

        const subject = getThreadSubject();
        const points = getTagPoints(subject);
        if (points <= 0) continue;

        const already = await hasPostBeenAwarded(postId);
        if (already) continue;

        const postUser = $(post).find(".user-link").attr("data-id");
        if (!postUser) continue;

        const userSnap = await getUserData(postUser);
        userSnap.battlePoints = (userSnap.battlePoints || 0) + points;
        await setUserData(postUser, userSnap);
        await markPostAwarded(postId);

        console.log(`[BP] awarded ${points} points to user ${postUser} for post ${postId}`);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

initializeBattlePoints();

// --- Optional debug hook ---
window.BattleDebug = {
  testSubject: () => {
    const s = getThreadSubject();
    console.log("[BP] testSubject ->", s);
    return s;
  },
};
