// ════════════════════════════════════════════════════════════
//  SUPABASE CONFIG — ganti dengan credentials kamu
// ════════════════════════════════════════════════════════════
const SUPABASE_URL      = 'https://jhbzstmcewffldjgsgtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoYnpzdG1jZXdmZmxkamdzZ3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTM3NzAsImV4cCI6MjA4ODc2OTc3MH0.lTrwLGVrAKhsMp23u-yGX230KZHfCkU8ZjB0-duMq5o';

let sbClient = null;
let currentUser = null;

// ════════════════════════════════════════════════════════════
//  QURAN DATA
// ════════════════════════════════════════════════════════════
const SURAHS = {
  1: { name:"Al-Fatihah", num:1, bismillah:false, ayahs:[
    {n:1,words:["بِسْمِ","اللَّهِ","الرَّحْمَٰنِ","الرَّحِيمِ"]},
    {n:2,words:["الْحَمْدُ","لِلَّهِ","رَبِّ","الْعَالَمِينَ"]},
    {n:3,words:["الرَّحْمَٰنِ","الرَّحِيمِ"]},
    {n:4,words:["مَالِكِ","يَوْمِ","الدِّينِ"]},
    {n:5,words:["إِيَّاكَ","نَعْبُدُ","وَإِيَّاكَ","نَسْتَعِينُ"]},
    {n:6,words:["اهْدِنَا","الصِّرَاطَ","الْمُسْتَقِيمَ"]},
    {n:7,words:["صِرَاطَ","الَّذِينَ","أَنْعَمْتَ","عَلَيْهِمْ","غَيْرِ","الْمَغْضُوبِ","عَلَيْهِمْ","وَلَا","الضَّالِّينَ"]}
  ]},
  112: { name:"Al-Ikhlas", num:112, bismillah:true, ayahs:[
    {n:1,words:["قُلْ","هُوَ","اللَّهُ","أَحَدٌ"]},
    {n:2,words:["اللَّهُ","الصَّمَدُ"]},
    {n:3,words:["لَمْ","يَلِدْ","وَلَمْ","يُولَدْ"]},
    {n:4,words:["وَلَمْ","يَكُن","لَّهُ","كُفُوًا","أَحَدٌ"]}
  ]},
  113: { name:"Al-Falaq", num:113, bismillah:true, ayahs:[
    {n:1,words:["قُلْ","أَعُوذُ","بِرَبِّ","الْفَلَقِ"]},
    {n:2,words:["مِن","شَرِّ","مَا","خَلَقَ"]},
    {n:3,words:["وَمِن","شَرِّ","غَاسِقٍ","إِذَا","وَقَبَ"]},
    {n:4,words:["وَمِن","شَرِّ","النَّفَّاثَاتِ","فِي","الْعُقَدِ"]},
    {n:5,words:["وَمِن","شَرِّ","حَاسِدٍ","إِذَا","حَسَدَ"]}
  ]},
  114: { name:"An-Nas", num:114, bismillah:true, ayahs:[
    {n:1,words:["قُلْ","أَعُوذُ","بِرَبِّ","النَّاسِ"]},
    {n:2,words:["مَلِكِ","النَّاسِ"]},
    {n:3,words:["إِلَٰهِ","النَّاسِ"]},
    {n:4,words:["مِن","شَرِّ","الْوَسْوَاسِ","الْخَنَّاسِ"]},
    {n:5,words:["الَّذِي","يُوَسْوِسُ","فِي","صُدُورِ","النَّاسِ"]},
    {n:6,words:["مِنَ","الْجِنَّةِ","وَالنَّاسِ"]}
  ]}
};

// All 114 surahs — static data for juz 28-30 + common ones, rest loaded via API
const JUZ_SURAHS = {
  1:{name:'Al-Fatihah',ayahCount:7,bismillah:false},
  2:{name:'Al-Baqarah',ayahCount:286,bismillah:true},
  3:{name:"Ali 'Imran",ayahCount:200,bismillah:true},
  4:{name:"An-Nisa'",ayahCount:176,bismillah:true},
  5:{name:"Al-Ma'idah",ayahCount:120,bismillah:true},
  6:{name:"Al-An'am",ayahCount:165,bismillah:true},
  7:{name:"Al-A'raf",ayahCount:206,bismillah:true},
  8:{name:"Al-Anfal",ayahCount:75,bismillah:true},
  9:{name:"At-Tawbah",ayahCount:129,bismillah:false},
  10:{name:"Yunus",ayahCount:109,bismillah:true},
  11:{name:"Hud",ayahCount:123,bismillah:true},
  12:{name:"Yusuf",ayahCount:111,bismillah:true},
  13:{name:"Ar-Ra'd",ayahCount:43,bismillah:true},
  14:{name:"Ibrahim",ayahCount:52,bismillah:true},
  15:{name:"Al-Hijr",ayahCount:99,bismillah:true},
  16:{name:"An-Nahl",ayahCount:128,bismillah:true},
  17:{name:"Al-Isra'",ayahCount:111,bismillah:true},
  18:{name:"Al-Kahf",ayahCount:110,bismillah:true},
  19:{name:"Maryam",ayahCount:98,bismillah:true},
  20:{name:"Ta-Ha",ayahCount:135,bismillah:true},
  21:{name:"Al-Anbiya'",ayahCount:112,bismillah:true},
  22:{name:"Al-Hajj",ayahCount:78,bismillah:true},
  23:{name:"Al-Mu'minun",ayahCount:118,bismillah:true},
  24:{name:"An-Nur",ayahCount:64,bismillah:true},
  25:{name:"Al-Furqan",ayahCount:77,bismillah:true},
  26:{name:"Ash-Shu'ara'",ayahCount:227,bismillah:true},
  27:{name:"An-Naml",ayahCount:93,bismillah:true},
  28:{name:"Al-Qasas",ayahCount:88,bismillah:true},
  29:{name:"Al-'Ankabut",ayahCount:69,bismillah:true},
  30:{name:"Ar-Rum",ayahCount:60,bismillah:true},
  31:{name:"Luqman",ayahCount:34,bismillah:true},
  32:{name:"As-Sajdah",ayahCount:30,bismillah:true},
  33:{name:"Al-Ahzab",ayahCount:73,bismillah:true},
  34:{name:"Saba'",ayahCount:54,bismillah:true},
  35:{name:"Fatir",ayahCount:45,bismillah:true},
  36:{name:"Ya-Sin",ayahCount:83,bismillah:true},
  37:{name:"As-Saffat",ayahCount:182,bismillah:true},
  38:{name:"Sad",ayahCount:88,bismillah:true},
  39:{name:"Az-Zumar",ayahCount:75,bismillah:true},
  40:{name:"Ghafir",ayahCount:85,bismillah:true},
  41:{name:"Fussilat",ayahCount:54,bismillah:true},
  42:{name:"Ash-Shura",ayahCount:53,bismillah:true},
  43:{name:"Az-Zukhruf",ayahCount:89,bismillah:true},
  44:{name:"Ad-Dukhan",ayahCount:59,bismillah:true},
  45:{name:"Al-Jathiyah",ayahCount:37,bismillah:true},
  46:{name:"Al-Ahqaf",ayahCount:35,bismillah:true},
  47:{name:"Muhammad",ayahCount:38,bismillah:true},
  48:{name:"Al-Fath",ayahCount:29,bismillah:true},
  49:{name:"Al-Hujurat",ayahCount:18,bismillah:true},
  50:{name:"Qaf",ayahCount:45,bismillah:true},
  51:{name:"Adh-Dhariyat",ayahCount:60,bismillah:true},
  52:{name:"At-Tur",ayahCount:49,bismillah:true},
  53:{name:"An-Najm",ayahCount:62,bismillah:true},
  54:{name:"Al-Qamar",ayahCount:55,bismillah:true},
  55:{name:"Ar-Rahman",ayahCount:78,bismillah:true},
  56:{name:"Al-Waqi'ah",ayahCount:96,bismillah:true},
  57:{name:"Al-Hadid",ayahCount:29,bismillah:true},
  58:{name:"Al-Mujadila",ayahCount:22,bismillah:true},
  59:{name:"Al-Hashr",ayahCount:24,bismillah:true},
  60:{name:"Al-Mumtahanah",ayahCount:13,bismillah:true},
  61:{name:"As-Saff",ayahCount:14,bismillah:true},
  62:{name:"Al-Jumu'ah",ayahCount:11,bismillah:true},
  63:{name:"Al-Munafiqun",ayahCount:11,bismillah:true},
  64:{name:"At-Taghabun",ayahCount:18,bismillah:true},
  65:{name:"At-Talaq",ayahCount:12,bismillah:true},
  66:{name:"At-Tahrim",ayahCount:12,bismillah:true},
  67:{name:'Al-Mulk',ayahCount:30,bismillah:true},
  68:{name:'Al-Qalam',ayahCount:52,bismillah:true},
  69:{name:"Al-Haqqah",ayahCount:52,bismillah:true},
  70:{name:"Al-Ma'arij",ayahCount:44,bismillah:true},
  71:{name:"Nuh",ayahCount:28,bismillah:true},
  72:{name:"Al-Jinn",ayahCount:28,bismillah:true},
  73:{name:"Al-Muzzammil",ayahCount:20,bismillah:true},
  74:{name:"Al-Muddaththir",ayahCount:56,bismillah:true},
  75:{name:"Al-Qiyamah",ayahCount:40,bismillah:false},
  76:{name:"Al-Insan",ayahCount:31,bismillah:true},
  77:{name:"Al-Mursalat",ayahCount:50,bismillah:true},
  78:{name:"An-Naba'",ayahCount:40,bismillah:true},
  79:{name:"An-Nazi'at",ayahCount:46,bismillah:true},
  80:{name:"'Abasa",ayahCount:42,bismillah:true},
  81:{name:"At-Takwir",ayahCount:29,bismillah:true},
  82:{name:"Al-Infitar",ayahCount:19,bismillah:true},
  83:{name:"Al-Mutaffifin",ayahCount:36,bismillah:true},
  84:{name:"Al-Inshiqaq",ayahCount:25,bismillah:true},
  85:{name:"Al-Buruj",ayahCount:22,bismillah:true},
  86:{name:"At-Tariq",ayahCount:17,bismillah:true},
  87:{name:"Al-A'la",ayahCount:19,bismillah:true},
  88:{name:"Al-Ghashiyah",ayahCount:26,bismillah:true},
  89:{name:"Al-Fajr",ayahCount:30,bismillah:true},
  90:{name:"Al-Balad",ayahCount:20,bismillah:true},
  91:{name:"Ash-Shams",ayahCount:15,bismillah:true},
  92:{name:"Al-Layl",ayahCount:21,bismillah:true},
  93:{name:"Ad-Duha",ayahCount:11,bismillah:true},
  94:{name:"Ash-Sharh",ayahCount:8,bismillah:true},
  95:{name:"At-Tin",ayahCount:8,bismillah:true},
  96:{name:"Al-'Alaq",ayahCount:19,bismillah:true},
  97:{name:"Al-Qadr",ayahCount:5,bismillah:true},
  98:{name:"Al-Bayyinah",ayahCount:8,bismillah:true},
  99:{name:"Az-Zalzalah",ayahCount:8,bismillah:true},
  100:{name:"Al-'Adiyat",ayahCount:11,bismillah:true},
  101:{name:"Al-Qari'ah",ayahCount:11,bismillah:true},
  102:{name:"At-Takathur",ayahCount:8,bismillah:true},
  103:{name:"Al-'Asr",ayahCount:3,bismillah:true},
  104:{name:"Al-Humazah",ayahCount:9,bismillah:true},
  105:{name:"Al-Fil",ayahCount:5,bismillah:true},
  106:{name:"Quraish",ayahCount:4,bismillah:true},
  107:{name:"Al-Ma'un",ayahCount:7,bismillah:true},
  108:{name:"Al-Kawthar",ayahCount:3,bismillah:true},
  109:{name:"Al-Kafirun",ayahCount:6,bismillah:true},
  110:{name:"An-Nasr",ayahCount:3,bismillah:true},
  111:{name:"Al-Masad",ayahCount:5,bismillah:false},
  112:{name:"Al-Ikhlas",ayahCount:4,bismillah:true},
  113:{name:"Al-Falaq",ayahCount:5,bismillah:true},
  114:{name:"An-Nas",ayahCount:6,bismillah:true}
};

const dynamicSurahCache = {};
const DAILY_QUOTES = [
  {ar:"وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا", tr:"Dan bacalah Al-Qur'an itu dengan perlahan-lahan.", src:"QS. Al-Muzzammil: 4"},
  {ar:"إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ", tr:"Sesungguhnya Al-Qur'an ini memberikan petunjuk kepada (jalan) yang paling lurus.", src:"QS. Al-Isra: 9"},
  {ar:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", tr:"Sebaik-baik kalian adalah yang belajar Al-Qur'an dan mengajarkannya.", src:"HR. Bukhari"},
  {ar:"وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ", tr:"Dan sesungguhnya telah Kami mudahkan Al-Qur'an untuk pelajaran.", src:"QS. Al-Qamar: 17"}
];

// ════════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════════
let currentPage = 'beranda';

// Page name mapping for analytics
const PAGE_NAMES = {
  beranda: 'Beranda',
  hafalan: 'Murojaah',
  hafalanku: 'Hafalanku',
  audio: 'Dengarkan Ayat',
  sambung: 'Sambung Ayat'
};

function navTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    n.removeAttribute('aria-current');
  });
  document.getElementById('page-' + page).classList.add('active');
  const navBtn = document.getElementById('nav-' + page);
  if (navBtn) {
    navBtn.classList.add('active');
    navBtn.setAttribute('aria-current', 'page');
  }
  document.getElementById('app').scrollTop = 0;
  currentPage = page;
  // Announce page change to screen readers
  try { _announcePageChange(page); } catch(e) {}
  // Update URL — use pushState so back/forward works
  if (location.hash !== '#' + page) {
    history.pushState({ page }, '', '#' + page);
  }
  if (page === 'beranda') refreshBeranda();
  if (page === 'setoran') refreshRiwayat();
  if (page === 'hafalanku') { renderHafalankuList(); renderHafalankuBeranda(); }
  // Track pageview for Vercel Analytics
  try {
    if (window.va) window.va('event', { name: 'pageview', data: { page: PAGE_NAMES[page] || page } });
    if (window.vaq) window.vaq.push(['event', { name: 'pageview', data: { page: PAGE_NAMES[page] || page } }]);
  } catch(e) {}
  // Track pageview for Google Analytics (GA4)
  try {
    if (window.gtag) gtag('event', 'page_view', {
      page_title: PAGE_NAMES[page] || page,
      page_location: location.href,
      page_path: '/' + page
    });
  } catch(e) {}
}

// Route from URL hash on load & back/forward
function routeFromHash() {
  const hash = (location.hash || '').replace('#', '');
  const validPages = ['beranda', 'hafalan', 'hafalanku', 'audio', 'sambung'];
  if (hash && validPages.includes(hash)) {
    navTo(hash);
  }
}
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) navTo(e.state.page);
  else routeFromHash();
});

// ════════════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════════════
function showToast(msg, duration = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ════════════════════════════════════════════════════════════
//  SUPABASE AUTH
// ════════════════════════════════════════════════════════════
function initSupabase() {
  const configured = !SUPABASE_ANON_KEY.includes('YOUR_FULL') && !SUPABASE_URL.includes('YOUR_PROJECT');
  if (!configured) {
    hideLoading();
    refreshBeranda();
    return;
  }
  sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let _initialAuthDone = false;
  // Track auth state per tab to detect real transitions vs duplicate events
  const _prevAuthUid = sessionStorage.getItem('murajaah_auth_uid') || null;

  sbClient.auth.onAuthStateChange((event, session) => {
    const newUid = session?.user?.id || null;

    if (event === 'INITIAL_SESSION') {
      _initialAuthDone = true;
      sessionStorage.setItem('murajaah_auth_uid', newUid || '');
      if (session) {
        currentUser = session.user;
        onLoggedIn(currentUser);
      }
      return;
    }

    if (!_initialAuthDone) {
      _initialAuthDone = true;
      sessionStorage.setItem('murajaah_auth_uid', newUid || '');
      if (session) {
        currentUser = session.user;
        onLoggedIn(currentUser);
      }
      return;
    }

    // Only reload if auth state actually changed (different user or login/logout transition)
    if (event === 'SIGNED_IN' && session) {
      // Skip if same user already loaded in this tab (e.g. broadcast from another tab)
      if (_prevAuthUid === newUid) {
        currentUser = session.user;
        return;
      }
      // Real new login — clear guest data and reload
      sessionStorage.setItem('murajaah_auth_uid', newUid || '');
      localStorage.removeItem('murajaah_hafalanku');
      localStorage.removeItem('murajaah_activity_dates');
      localStorage.removeItem('murajaah_setoran');
      window.location.reload();
      return;
    } else if (event === 'TOKEN_REFRESHED' && session) {
      currentUser = session.user;
      onLoggedIn(currentUser);
    } else if (event === 'SIGNED_OUT') {
      // Always clear local data on SIGNED_OUT, even if this tab thinks it was already logged out.
      sessionStorage.setItem('murajaah_auth_uid', '');
      localStorage.removeItem('murajaah_hafalanku');
      localStorage.removeItem('murajaah_activity_dates');
      localStorage.removeItem('murajaah_setoran');
      localStorage.removeItem('murajaah_logged_in_marker');
      if (_prevAuthUid) {
        window.location.reload();
      }
      return;
    }
  });

  sbClient.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      currentUser = session.user;
      onLoggedIn(currentUser);
    } else {
      // No active session on initial load — check if localStorage has stale data
      // from a previously logged-in user. We use a marker key 'murajaah_logged_in_marker'
      // that's set when user logs in and only cleared on explicit logout.
      // If marker exists but no session → user closed tab without logout / session expired.
      // → purge stale data to prevent leakage to next user of this browser.
      try {
        if (localStorage.getItem('murajaah_logged_in_marker')) {
          localStorage.removeItem('murajaah_hafalanku');
          localStorage.removeItem('murajaah_activity_dates');
          localStorage.removeItem('murajaah_setoran');
          localStorage.removeItem('murajaah_logged_in_marker');
        }
      } catch(e) {}
    }
    hideLoading();
  }).catch(() => hideLoading());
}

async function doGoogleLogin() {
  if (!sbClient) return;
  const btn = document.getElementById('auth-google-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="auth-spinner"></div> Menghubungkan...';
  const { error } = await sbClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://smartmurojaahquran.vercel.app' }
  });
  if (error) {
    document.getElementById('auth-err').textContent = error.message;
    document.getElementById('auth-err').classList.add('show');
    btn.disabled = false;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Masuk dengan Google';
  }
}

async function doLogout() {
  toggleUserDropdown(false);
  // Clear local data BEFORE signOut so SIGNED_OUT event handler can't race
  try {
    localStorage.removeItem('murajaah_hafalanku');
    localStorage.removeItem('murajaah_activity_dates');
    localStorage.removeItem('murajaah_setoran');
    localStorage.removeItem('murajaah_logged_in_marker');
    sessionStorage.setItem('murajaah_auth_uid', '');
  } catch(e) {}
  if (sbClient) {
    try { await sbClient.auth.signOut(); } catch(e) {}
  }
  currentUser = null;
  // Hard reload to flush all in-memory state — prevents previous user's data
  // from leaking into the logged-out view (Hafalanku list, Beranda stats, etc)
  window.location.reload();
}

async function onLoggedIn(user) {
  closeAuthModal();
  // Set marker so we can detect stale data on next browser open if user closes tab without logout
  try { localStorage.setItem('murajaah_logged_in_marker', user.id || '1'); } catch(e) {}
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '?';
  const initials = name.substring(0, 2).toUpperCase();
  document.getElementById('topbar-avatar').textContent = initials;
  document.getElementById('topbar-username').textContent = name.length > 12 ? name.substring(0,11)+'…' : name;
  document.getElementById('topbar-user').style.display = 'flex';
  document.getElementById('topbar-login-btn').style.display = 'none';
  document.getElementById('greeting-name').textContent = `Assalamualaikum, ${name.split(' ')[0]} 👋`;

  // Load hafalan data from cloud
  const loaded = await loadHafalankuFromCloud();
  if (loaded) {
    renderHafalankuList();
    renderHafalankuBeranda();
  } else {
    // No cloud data — sync current local data to cloud for first time
    const localData = getHafalankuData();
    if (localData.length > 0) {
      syncHafalankuToCloud(localData);
    }
  }

  // Load activity dates from cloud
  const actLoaded = await loadActivityFromCloud();
  if (!actLoaded) {
    // No cloud activity — sync local activity to cloud
    const localAct = getActivityDates();
    if (localAct.length > 0) {
      syncActivityToCloud(localAct);
    }
  }

  // Update login banner visibility
  const banner = document.getElementById('hk-login-banner');
  if (banner) banner.style.display = 'none';

  refreshBeranda();
}

function onLoggedOut() {
  document.getElementById('topbar-user').style.display = 'none';
  document.getElementById('topbar-login-btn').style.display = 'flex';
  document.getElementById('greeting-name').textContent = 'Assalamualaikum 👋';
  updateStreakUI(0, 0);
}

function showProfileInfo() {
  toggleUserDropdown(false);
  if (!currentUser) return;
  const name = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '—';
  showToast(`${name} · ${currentUser.email}`);
}

// Track the element that opened a modal so we can restore focus on close
let _lastFocusBeforeModal = null;

function openAuthModal() {
  const bd = document.getElementById('auth-backdrop');
  _lastFocusBeforeModal = document.activeElement;
  bd.style.display = 'flex';
  bd.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    bd.classList.add('visible');
    // Move focus into the modal (primary action = Google login button)
    const loginBtn = document.getElementById('auth-google-btn');
    if (loginBtn) loginBtn.focus();
  }, 10);
}
function closeAuthModal() {
  const bd = document.getElementById('auth-backdrop');
  bd.classList.remove('visible');
  bd.setAttribute('aria-hidden', 'true');
  setTimeout(() => bd.style.display = 'none', 300);
  // Restore focus to the element that opened the modal
  if (_lastFocusBeforeModal && typeof _lastFocusBeforeModal.focus === 'function') {
    try { _lastFocusBeforeModal.focus(); } catch(e) {}
    _lastFocusBeforeModal = null;
  }
}
function handleAuthBackdropClick(e) {
  if (e.target === document.getElementById('auth-backdrop')) closeAuthModal();
}

// Close modals on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const authBd = document.getElementById('auth-backdrop');
  if (authBd && authBd.classList.contains('visible')) { closeAuthModal(); return; }
  const setoranModal = document.getElementById('setoran-modal');
  if (setoranModal && setoranModal.classList.contains('open')) {
    setoranModal.classList.remove('open');
    setoranModal.setAttribute('aria-hidden', 'true');
    if (_lastFocusBeforeModal && typeof _lastFocusBeforeModal.focus === 'function') {
      try { _lastFocusBeforeModal.focus(); } catch(err) {}
      _lastFocusBeforeModal = null;
    }
  }
});

// Focus trap — keep Tab inside the active modal
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  // Determine the active modal container (if any)
  const authBd = document.getElementById('auth-backdrop');
  const setoranModal = document.getElementById('setoran-modal');
  let container = null;
  if (authBd && authBd.classList.contains('visible')) container = authBd;
  else if (setoranModal && setoranModal.classList.contains('open')) container = setoranModal;
  if (!container) return;
  // Get focusable elements inside the modal
  const focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey) {
    // Shift+Tab on first → loop to last
    if (document.activeElement === first || !container.contains(document.activeElement)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    // Tab on last → loop to first
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Page navigation announcer — announce page changes to screen readers
function _announcePageChange(page) {
  const names = {
    beranda: 'Halaman Beranda',
    hafalan: 'Halaman Mode Murojaah',
    hafalanku: 'Halaman Hafalanku',
    audio: 'Halaman Dengarkan Ayat',
    sambung: 'Halaman Sambung Ayat',
    setoran: 'Halaman Setor Hafalan',
  };
  let announcer = document.getElementById('a11y-page-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-page-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  // Clear then set to force screen reader to re-announce
  announcer.textContent = '';
  setTimeout(() => { announcer.textContent = names[page] || page; }, 50);
}
function toggleUserDropdown(force) {
  const dd = document.getElementById('user-dropdown');
  const btn = document.getElementById('topbar-user');
  if (force === false) dd.classList.remove('open');
  else dd.classList.toggle('open');
  // Sync ARIA state
  if (btn) btn.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
}
document.addEventListener('click', e => {
  if (!e.target.closest('#topbar-user')) {
    const dd = document.getElementById('user-dropdown');
    const btn = document.getElementById('topbar-user');
    if (dd) dd.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
});

function hideLoading() {
  const el = document.getElementById('loading-overlay');
  el.classList.add('hidden');
  setTimeout(() => el.style.display = 'none', 400);
}

// ════════════════════════════════════════════════════════════
//  BERANDA
// ════════════════════════════════════════════════════════════
function initBeranda() {
  renderCalendar();
  renderDailyQuote();
}

function renderDailyQuote() {
  const day = new Date().getDay();
  const q = DAILY_QUOTES[day % DAILY_QUOTES.length];
  document.getElementById('daily-quote-ar').textContent = q.ar;
  document.getElementById('daily-quote-tr').textContent = `"${q.tr}"`;
  document.querySelector('.quote-src').textContent = q.src;
}

// ════════════════════════════════════════════════════════════
//  ACTIVITY TRACKING (localStorage + cloud sync)
// ════════════════════════════════════════════════════════════
function getActivityDates() {
  return JSON.parse(localStorage.getItem('murajaah_activity_dates') || '[]');
}
function trackDailyActivity(type) {
  const today = new Date().toISOString().split('T')[0];
  let dates = getActivityDates();
  if (!dates.includes(today)) {
    dates.push(today);
    dates.sort();
    localStorage.setItem('murajaah_activity_dates', JSON.stringify(dates));
    syncActivityToCloud(dates);
    if (currentPage === 'beranda') refreshBeranda();
  }
}

let _activitySyncTimeout = null;
async function syncActivityToCloud(dates) {
  if (!sbClient || !currentUser) return;
  clearTimeout(_activitySyncTimeout);
  _activitySyncTimeout = setTimeout(async () => {
    try {
      await sbClient.from('hafalanku').upsert({
        user_id: currentUser.id,
        activity_dates: JSON.stringify(dates),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (e) {
      console.warn('Activity sync failed:', e);
    }
  }, 1000);
}

async function loadActivityFromCloud() {
  if (!sbClient || !currentUser) return false;
  try {
    const { data, error } = await sbClient.from('hafalanku')
      .select('activity_dates')
      .eq('user_id', currentUser.id)
      .single();
    if (error || !data) return false;
    if (data.activity_dates) {
      const cloudDates = JSON.parse(data.activity_dates);
      if (Array.isArray(cloudDates) && cloudDates.length > 0) {
        localStorage.setItem('murajaah_activity_dates', JSON.stringify(cloudDates));
        return true;
      }
    }
    return false;
  } catch (e) {
    console.warn('Activity cloud load failed:', e);
    return false;
  }
}
function calcActivityStreak() {
  const dates = getActivityDates().sort().reverse();
  const total = dates.length;
  if (!total) return { streak: 0, total: 0 };
  let streak = 0, d = new Date(); d.setHours(0,0,0,0);
  for (const dateStr of dates) {
    const ds = new Date(dateStr); ds.setHours(0,0,0,0);
    const diff = Math.round((d - ds) / 86400000);
    if (diff === 0 || diff === 1) { streak++; d = ds; } else break;
  }
  return { streak, total };
}

async function refreshBeranda() {
  const actDates = getActivityDates();
  const { streak, total } = calcActivityStreak();
  updateStreakUI(streak, total);
  checkPsychTrigger(actDates);
  renderCalendar(actDates);
  renderMilestones(streak, total);
  renderHafalankuBeranda();
}

function calcStreak(list) {
  const total = list.length;
  if (!total) return { streak: 0, total: 0 };
  const dates = [...new Set(list.map(s => s.date))].sort().reverse();
  let streak = 0;
  let d = new Date(); d.setHours(0,0,0,0);
  for (const dateStr of dates) {
    const ds = new Date(dateStr); ds.setHours(0,0,0,0);
    const diff = Math.round((d - ds) / 86400000);
    if (diff === 0 || diff === 1) { streak++; d = ds; }
    else break;
  }
  return { streak, total };
}

function updateStreakUI(streak, total) {
  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('streak-val').textContent = streak;
  document.getElementById('total-setoran-val').textContent = total;
}

function checkPsychTrigger(list) {
  const banner = document.getElementById('psych-banner');
  const today = new Date().toISOString().split('T')[0];
  const hasToday = list.includes ? list.includes(today) : list.some(s => s.date === today);
  if (hasToday) { banner.classList.add('hidden'); return; }
  
  const hour = new Date().getHours();
  let title, sub, icon;
  if (hour < 12) {
    icon = '🌅';
    title = 'Mulai hari dengan murajaah!';
    sub = 'Pagi adalah waktu terbaik. Tap untuk mulai sekarang.';
  } else if (hour < 17) {
    icon = '⏰';
    title = 'Belum aktif hari ini';
    sub = 'Jangan putus streakmu! Luangkan 5 menit untuk murajaah.';
  } else {
    icon = '🌙';
    title = 'Hari hampir berakhir!';
    sub = 'Yuk segera murojaah. Luangkan waktu 5 menit saja untuk jaga keistiqomahanmu. Semangat!';
  }
  document.getElementById('psych-icon').textContent = icon;
  document.getElementById('psych-title').textContent = title;
  document.getElementById('psych-sub').textContent = sub;
  banner.classList.remove('hidden');
}

let _milestoneIdx = 0;
let _milestoneTimer = null;
let _milestoneCards = [];

function renderMilestones(streak, total) {
  const el = document.getElementById('milestone-stack');
  if (!el) return;

  const STREAK_MS = [
    { days: 3,   icon: '🌱', label: '3 Hari Istiqomah',   arabic: 'البداية',
      motivActive: n => `${n} hari lagi — yuk bangun kebiasaan baik!`,
      motivDone: 'Hebat! Kamu sudah mulai istiqomah 🌱' },
    { days: 7,   icon: '🔥', label: '7 Hari Istiqomah',   arabic: 'أسبوع',
      motivActive: n => `${n} hari lagi — satu pekan penuh menanti!`,
      motivDone: 'Allahumma barik! Satu pekan istiqomah 🔥' },
    { days: 14,  icon: '⚡', label: '14 Hari Istiqomah',  arabic: 'عادة',
      motivActive: n => `${n} hari lagi — kebiasaan sedang terbentuk!`,
      motivDone: 'Dua pekan — kebiasaan sudah tertanam ⚡' },
    { days: 30,  icon: '🏆', label: '30 Hari Istiqomah',  arabic: 'شهر',
      motivActive: n => `${n} hari lagi — satu bulan hampir tercapai!`,
      motivDone: 'Masyaa Allah! Satu bulan penuh 🏆' },
    { days: 60,  icon: '💎', label: '60 Hari Istiqomah',  arabic: 'ثبات',
      motivActive: n => `${n} hari lagi — kamu luar biasa!`,
      motivDone: 'Dua bulan! Kamu hafidz sejati 💎' },
    { days: 100, icon: '👑', label: '100 Hari Istiqomah', arabic: 'إتقان',
      motivActive: n => `${n} hari lagi — 100 hari menanti!`,
      motivDone: 'Subhanallah! 100 hari istiqomah 👑' },
  ];
  const TOTAL_MS = [
    { count: 10,  icon: '📖', label: '10 Setoran',
      motivActive: n => `${n} setoran lagi — terus semangat!`,
      motivDone: '10 setoran tercapai! Konsisten terus ya 📖' },
    { count: 50,  icon: '📚', label: '50 Setoran',
      motivActive: n => `${n} setoran lagi — hafalan makin kuat!`,
      motivDone: '50 setoran! Hafalan makin kokoh 📚' },
    { count: 100, icon: '🎓', label: '100 Setoran',
      motivActive: n => `${n} setoran lagi — menuju 100!`,
      motivDone: 'Subhanallah! 100 kali murajaah 🎓' },
  ];

  // Build pool: hanya 1 done terakhir + 1 active + 1 total active
  const cards = [];

  // Last achieved streak milestone
  const lastDone = [...STREAK_MS].reverse().find(m => streak >= m.days);
  if (lastDone) {
    cards.push({ icon: lastDone.icon, label: lastDone.label, arabic: lastDone.arabic,
      state: 'done', badge: '✓ Tercapai', pct: 100, sub: lastDone.motivDone });
  }

  // Next streak target
  const nextStreak = STREAK_MS.find(m => streak < m.days);
  if (nextStreak) {
    const pct = Math.round((streak / nextStreak.days) * 100);
    cards.push({ icon: nextStreak.icon, label: nextStreak.label, arabic: nextStreak.arabic,
      state: 'active', badge: `${streak}/${nextStreak.days} hari`,
      pct, sub: nextStreak.motivActive(nextStreak.days - streak) });
  } else {
    // All streak milestones done — show champion card
    cards.push({ icon: '👑', label: 'Semua target streak tercapai!', arabic: 'إتقان',
      state: 'done', badge: '✓ Semua', pct: 100,
      sub: 'Masyaa Allah — kamu sudah melampaui 100 hari istiqomah!' });
  }

  // Total setoran cards removed — streak only

  _milestoneCards = cards;

  // Stop old timer
  if (_milestoneTimer) { clearInterval(_milestoneTimer); _milestoneTimer = null; }

  // Clamp index
  _milestoneIdx = _milestoneIdx % cards.length;

  _renderOneMilestone(el);

  // Auto-rotate every 4s if more than 1 card
  if (cards.length > 1) {
    _milestoneTimer = setInterval(() => {
      _milestoneIdx = (_milestoneIdx + 1) % _milestoneCards.length;
      const el2 = document.getElementById('milestone-stack');
      if (el2) _renderOneMilestone(el2);
    }, 4000);
  }
}

function _renderOneMilestone(el) {
  const cards = _milestoneCards;
  if (!cards.length) { el.innerHTML = ''; return; }
  const m = cards[_milestoneIdx];
  const dots = cards.length > 1
    ? `<div style="display:flex;gap:5px;justify-content:center;margin-top:10px">
        ${cards.map((_,i) => `<div style="width:${i===_milestoneIdx?16:6}px;height:6px;border-radius:3px;background:${i===_milestoneIdx?'var(--accent)':'var(--border)'};transition:all 0.3s"></div>`).join('')}
       </div>`
    : '';
  el.innerHTML = `
    <div class="milestone-card ${m.state}" data-ar="${m.arabic}" onclick="_milestoneNext()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();_milestoneNext()}" role="button" tabindex="0" aria-label="Milestone: ${escapeHtml(m.label)}, ${m.pct} persen selesai" style="cursor:pointer">
      <div class="milestone-icon" aria-hidden="true">${m.icon}</div>
      <div class="milestone-body">
        <div class="milestone-title">${m.label}</div>
        <div class="milestone-sub">${m.sub}</div>
        <div class="milestone-progress-wrap" role="progressbar" aria-valuenow="${m.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ${escapeHtml(m.label)}">
          <div class="milestone-progress-fill" style="width:${m.pct}%"></div>
        </div>
      </div>
      <div class="milestone-badge" aria-hidden="true">${m.badge}</div>
    </div>
    ${dots}`;
}

function _milestoneNext() {
  if (!_milestoneCards.length) return;
  _milestoneIdx = (_milestoneIdx + 1) % _milestoneCards.length;
  const el = document.getElementById('milestone-stack');
  if (el) _renderOneMilestone(el);
  // Reset auto-rotate timer
  if (_milestoneTimer) { clearInterval(_milestoneTimer); _milestoneTimer = null; }
  if (_milestoneCards.length > 1) {
    _milestoneTimer = setInterval(() => {
      _milestoneIdx = (_milestoneIdx + 1) % _milestoneCards.length;
      const el2 = document.getElementById('milestone-stack');
      if (el2) _renderOneMilestone(el2);
    }, 4000);
  }
}

function renderCalendar(setoranDates = []) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  document.getElementById('cal-month').textContent = `${months[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow'; el.textContent = d;
    grid.appendChild(el);
  });
  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty'; grid.appendChild(el);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (d === today) el.classList.add('today');
    if (setoranDates.includes(dateStr)) {
      el.classList.add('has-setoran');
      el.innerHTML = `${d}<span class="cal-check">✓</span>`;
    } else {
      el.textContent = d;
    }
    grid.appendChild(el);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'short' });
}

// ════════════════════════════════════════════════════════════
//  SETORAN — RECORDING
// ════════════════════════════════════════════════════════════
let mediaRecorder = null;
let audioChunks = [];
let recordingInterval = null;
let recordingSeconds = 0;
let audioBlob = null;
let audioObjectURL = null;
let playbackAudio = null;
let isRecording = false;

function initSetoranPage() {
  populateSurahSel('setoran-surah-sel');
}

function setoranSurahChanged() {
  const sel = document.getElementById('setoran-surah-sel');
  const num = parseInt(sel.value);
  const surah = SURAHS[num] || JUZ_SURAHS[num];
  const max = surah ? (surah.ayahs ? surah.ayahs.length : surah.ayahCount) : 1;
  document.getElementById('setoran-ayat-ke').max = max;
  document.getElementById('setoran-ayat-dari').max = max;
}

async function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      if (audioObjectURL) URL.revokeObjectURL(audioObjectURL);
      audioObjectURL = URL.createObjectURL(audioBlob);
      onRecordingDone();
      stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorder.start();
    isRecording = true;
    recordingSeconds = 0;

    const btn = document.getElementById('rec-btn');
    btn.classList.add('recording');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    document.getElementById('rec-btn-label').textContent = 'Tap untuk berhenti';
    document.getElementById('rec-timer').style.display = 'block';
    document.getElementById('rec-area').classList.add('recording');
    document.getElementById('btn-simpan-setoran').style.display = 'none';
    document.getElementById('rec-audio-player').classList.remove('show');

    recordingInterval = setInterval(() => {
      recordingSeconds++;
      const m = Math.floor(recordingSeconds/60), s = recordingSeconds%60;
      document.getElementById('rec-timer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
  } catch(e) {
    showToast('❌ Izinkan akses mikrofon di browser');
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  clearInterval(recordingInterval);
  isRecording = false;
  const btn = document.getElementById('rec-btn');
  btn.classList.remove('recording');
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
}

function onRecordingDone() {
  const btn = document.getElementById('rec-btn');
  btn.classList.add('done');
  document.getElementById('rec-btn-label').textContent = 'Rekaman selesai ✓';
  document.getElementById('rec-area').classList.remove('recording');
  document.getElementById('rec-area').classList.add('has-audio');

  const durEl = document.getElementById('rec-audio-duration');
  durEl.textContent = `${recordingSeconds}s`;
  document.getElementById('rec-audio-player').classList.add('show');
  document.getElementById('btn-simpan-setoran').style.display = 'flex';
}

function togglePlayback() {
  if (!audioObjectURL) return;
  const btn = document.getElementById('rec-play-btn');
  if (playbackAudio && !playbackAudio.paused) {
    playbackAudio.pause();
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  } else {
    if (!playbackAudio) {
      playbackAudio = new Audio(audioObjectURL);
      playbackAudio.onended = () => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      };
    }
    playbackAudio.play();
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }
}

async function simpanSetoran() {
  if (!audioBlob) { showToast('❌ Rekam audio dulu'); return; }
  const surahSel = document.getElementById('setoran-surah-sel');
  const surahNum = parseInt(surahSel.value);
  const surahName = surahSel.options[surahSel.selectedIndex].text;
  const dari = parseInt(document.getElementById('setoran-ayat-dari').value);
  const ke = parseInt(document.getElementById('setoran-ayat-ke').value);
  const today = new Date().toISOString().split('T')[0];

  const btn = document.getElementById('btn-simpan-setoran');
  btn.disabled = true;
  btn.innerHTML = '<div class="auth-spinner" style="border-color:rgba(255,255,255,0.3);border-top-color:#fff"></div> Menyimpan...';

  let audioUrl = null;

  if (sbClient && currentUser) {
    try {
      const fileName = `${currentUser.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadErr } = await sbClient.storage.from('setoran-audio').upload(fileName, audioBlob, { contentType: 'audio/webm' });
      if (!uploadErr) {
        const { data: urlData } = sbClient.storage.from('setoran-audio').getPublicUrl(fileName);
        audioUrl = urlData?.publicUrl;
      }

      await sbClient.from('setoran').insert({
        user_id: currentUser.id,
        surah_num: surahNum,
        surah_name: surahName,
        ayat_dari: dari,
        ayat_ke: ke,
        audio_url: audioUrl,
        duration: recordingSeconds,
        date: today
      });

      showToast('✅ Setoran berhasil disimpan!');
      resetRecording();
      refreshRiwayat();
      refreshBeranda();
    } catch(e) {
      console.error('simpanSetoran:', e);
      showToast('❌ Gagal menyimpan, coba lagi');
    }
  } else {
    // Simpan lokal jika belum login
    const localData = JSON.parse(localStorage.getItem('murajaah_setoran') || '[]');
    localData.unshift({ id: Date.now().toString(), surah_num: surahNum, surah_name: surahName, ayat_dari: dari, ayat_ke: ke, duration: recordingSeconds, date: today });
    localStorage.setItem('murajaah_setoran', JSON.stringify(localData));
    showToast('💾 Tersimpan lokal (login untuk sync ke cloud)');
    resetRecording();
    refreshRiwayat();
    refreshBeranda();
  }

  btn.disabled = false;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Simpan Setoran';
}

function resetRecording() {
  audioBlob = null; audioChunks = []; recordingSeconds = 0;
  if (audioObjectURL) { URL.revokeObjectURL(audioObjectURL); audioObjectURL = null; }
  if (playbackAudio) { playbackAudio.pause(); playbackAudio = null; }
  const btn = document.getElementById('rec-btn');
  btn.classList.remove('recording', 'done');
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
  document.getElementById('rec-btn-label').textContent = 'Tap untuk mulai rekam';
  document.getElementById('rec-timer').style.display = 'none';
  document.getElementById('rec-timer').textContent = '00:00';
  document.getElementById('rec-area').classList.remove('recording', 'has-audio');
  document.getElementById('rec-audio-player').classList.remove('show');
  document.getElementById('btn-simpan-setoran').style.display = 'none';
}

// HTML escape helper — prevents XSS when injecting data into innerHTML
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function refreshRiwayat() {
  let list = [];
  if (sbClient && currentUser) {
    const { data } = await sbClient.from('setoran').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
    list = data || [];
  } else {
    list = JSON.parse(localStorage.getItem('murajaah_setoran') || '[]');
  }

  const el = document.getElementById('riwayat-setoran-list');
  if (!list.length) {
    el.innerHTML = '<div class="riwayat-empty"><div class="riwayat-empty-icon" aria-hidden="true">🎙️</div><div class="riwayat-empty-text">Belum ada setoran tersimpan</div></div>';
    el.setAttribute('role', 'status');
    return;
  }
  // Semantic list of clickable setoran items with button role + keyboard support
  el.setAttribute('role', 'list');
  el.setAttribute('aria-label', `${list.length} setoran tersimpan`);
  el.innerHTML = list.map(s => {
    const duration = s.duration ? Math.round(s.duration)+' detik' : 'durasi tidak tersedia';
    const ariaLabel = `${escapeHtml(s.surah_name)}, ayat ${escapeHtml(s.ayat_dari)} sampai ${escapeHtml(s.ayat_ke)}, ${duration}, ${escapeHtml(formatDate(s.date))}. Tekan untuk melihat detail.`;
    return `
    <div class="setoran-item" data-setoran-id="${escapeHtml(s.id)}" role="listitem">
      <div role="button" tabindex="0" aria-label="${ariaLabel}" style="display:contents">
        <div class="setoran-dot" aria-hidden="true"><svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg></div>
        <div class="setoran-info">
          <div class="setoran-surah">${escapeHtml(s.surah_name)}</div>
          <div class="setoran-meta">Ayat ${escapeHtml(s.ayat_dari)}–${escapeHtml(s.ayat_ke)} · ${s.duration ? Math.round(s.duration)+'s' : '—'}</div>
        </div>
        <div class="setoran-date">${escapeHtml(formatDate(s.date))}</div>
      </div>
    </div>`;
  }).join('');
  // Attach click + keyboard handlers via delegation
  el.querySelectorAll('.setoran-item').forEach(item => {
    const open = () => openSetoranDetail(item.dataset.setoranId);
    item.onclick = open;
    const btn = item.querySelector('[role="button"]');
    if (btn) {
      btn.onkeydown = (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(); }
      };
    }
  });
}

async function openSetoranDetail(id) {
  let setoran = null;
  if (sbClient && currentUser) {
    // Defense-in-depth: filter user_id explicitly even though RLS already enforces this
    const { data } = await sbClient.from('setoran')
      .select('*')
      .eq('id', id)
      .eq('user_id', currentUser.id)
      .single();
    setoran = data;
  } else {
    const list = JSON.parse(localStorage.getItem('murajaah_setoran') || '[]');
    setoran = list.find(s => s.id == id);
  }
  if (!setoran) return;

  document.getElementById('modal-setoran-title').textContent = setoran.surah_name;

  // Validate audio_url scheme — only allow safe protocols (https, blob, data)
  // Prevents javascript: URI XSS and other unsafe schemes
  let safeAudioUrl = '';
  if (setoran.audio_url) {
    const url = String(setoran.audio_url).trim();
    if (/^(https?:|blob:|data:audio\/)/i.test(url)) {
      safeAudioUrl = url;
    }
  }

  document.getElementById('modal-setoran-content').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="gstat" style="background:var(--accent-soft);border-radius:12px;padding:12px">
          <div style="font-size:18px;font-weight:800;color:var(--accent)">${escapeHtml(setoran.ayat_dari)}–${escapeHtml(setoran.ayat_ke)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Range Ayat</div>
        </div>
        <div class="gstat" style="background:var(--surface2);border-radius:12px;padding:12px">
          <div style="font-size:18px;font-weight:800;color:var(--text)">${setoran.duration ? Math.round(setoran.duration)+'s' : '—'}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">Durasi</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--muted);font-family:var(--font-mono)">📅 ${escapeHtml(new Date(setoran.date || setoran.created_at).toLocaleDateString('id-ID', {weekday:'long',year:'numeric',month:'long',day:'numeric'}))}</div>
      ${safeAudioUrl ? `
        <div>
          <div class="field-label" style="margin-bottom:8px">Rekaman</div>
          <audio controls style="width:100%;border-radius:10px" src="${escapeHtml(safeAudioUrl)}"></audio>
        </div>
      ` : '<div style="font-size:12px;color:var(--muted2);text-align:center;padding:8px">Rekaman tidak tersedia</div>'}
      <button class="btn-secondary" id="modal-setoran-delete-btn" data-setoran-id="${escapeHtml(setoran.id)}">🗑 Hapus Setoran</button>
    </div>`;
  // Attach delete handler via property (safe — no string injection)
  const delBtn = document.getElementById('modal-setoran-delete-btn');
  if (delBtn) delBtn.onclick = () => deleteSetoran(delBtn.dataset.setoranId);
  // Save trigger element so we can restore focus on close
  _lastFocusBeforeModal = document.activeElement;
  const modalEl = document.getElementById('setoran-modal');
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden', 'false');
  // Move focus to modal title for screen reader announcement
  setTimeout(() => {
    const title = document.getElementById('modal-setoran-title');
    if (title) { title.setAttribute('tabindex', '-1'); title.focus(); }
  }, 30);
}

function closeSetoranModal(e) {
  if (e.target === document.getElementById('setoran-modal') || e.target.closest('.modal-sheet') === null) {
    const modalEl = document.getElementById('setoran-modal');
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    // Restore focus to the element that opened the modal
    if (_lastFocusBeforeModal && typeof _lastFocusBeforeModal.focus === 'function') {
      try { _lastFocusBeforeModal.focus(); } catch(err) {}
      _lastFocusBeforeModal = null;
    }
  }
}

async function deleteSetoran(id) {
  if (!confirm('Hapus setoran ini?')) return;
  if (sbClient && currentUser) {
    // Defense-in-depth: filter user_id explicitly
    await sbClient.from('setoran').delete()
      .eq('id', id)
      .eq('user_id', currentUser.id);
  } else {
    const list = JSON.parse(localStorage.getItem('murajaah_setoran') || '[]');
    localStorage.setItem('murajaah_setoran', JSON.stringify(list.filter(s => s.id != id)));
  }
  document.getElementById('setoran-modal').classList.remove('open');
  refreshRiwayat();
  refreshBeranda();
  showToast('Setoran dihapus');
}

// ════════════════════════════════════════════════════════════
//  QURAN / MUSHAF HELPERS
// ════════════════════════════════════════════════════════════
function getAllSurahList() {
  const all = {};
  Object.entries(SURAHS).forEach(([k,v]) => all[k] = v.name);
  Object.entries(JUZ_SURAHS).forEach(([k,v]) => { if (!all[k]) all[k] = v.name; });
  return Object.entries(all).map(([num, name]) => ({ num: parseInt(num), name })).sort((a,b) => a.num - b.num);
}

function populateSurahSel(selId, selectedNum = 68) {
  const sel = document.getElementById(selId);
  sel.innerHTML = getAllSurahList().map(s => `<option value="${s.num}" ${s.num === selectedNum ? 'selected' : ''}>${s.num}. ${s.name}</option>`).join('');
}

async function loadDynamicSurah(surahNum) {
  if (SURAHS[surahNum]) return SURAHS[surahNum];
  if (dynamicSurahCache[surahNum]) return dynamicSurahCache[surahNum];
  const meta = JUZ_SURAHS[surahNum];
  if (!meta) return null;
  return await fetchSurahFromCDN(surahNum, meta);
}

async function fetchSurahFromCDN(surahNum, meta) {
  if (dynamicSurahCache[surahNum]) {
    SURAHS[surahNum] = dynamicSurahCache[surahNum];
    return dynamicSurahCache[surahNum];
  }
  const STRIP = /[\u0600-\u0605\u0616-\u061A\u06D6-\u06E4\u06E7-\u06E9\u0615\u0640]/g;
  function parseWords(text, n) {
    let words = text.trim().split(/\s+/).map(w => w.replace(STRIP,'').trim()).filter(w => w.length > 0);
    if (n === 1 && words.length >= 4) {
      const f = normalizeArabic(words[0]);
      if (f.startsWith('\u0628\u0633\u0645')) words = words.slice(4);
    }
    return words;
  }
  const urls = [
    'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/' + surahNum + '.json',
    'https://api.alquran.cloud/v1/surah/' + surahNum + '/quran-uthmani'
  ];
  for (const url of urls) {
    try {
      const ctrl = new AbortController();
      const tmo = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(url, {signal: ctrl.signal});
      clearTimeout(tmo);
      if (!res.ok) continue;
      const data = await res.json();
      const ayahs = [];
      if (Array.isArray(data)) {
        data.forEach((v, i) => {
          const text = typeof v === 'string' ? v : (v.text || v.arabic || '');
          const n = v.verse || (i + 1);
          const words = parseWords(text, n);
          if (words.length) ayahs.push({n, words});
        });
      } else if (data.data && data.data.ayahs) {
        data.data.ayahs.forEach(v => {
          const words = parseWords(v.text || '', v.numberInSurah);
          if (words.length) ayahs.push({n: v.numberInSurah, words});
        });
      }
      if (ayahs.length > 0) {
        const entry = {name: meta.name, num: surahNum, bismillah: meta.bismillah, ayahs, _dynamic: true};
        dynamicSurahCache[surahNum] = entry;
        SURAHS[surahNum] = entry;
        console.log('Loaded surah ' + surahNum + ': ' + ayahs.length + ' ayahs');
        return entry;
      }
    } catch(e) {
      console.warn('Failed ' + url + ':', e.message);
    }
  }
  return null;
}

// ════════════════════════════════════════════════════════════
//  NORMALIZATION + SMART MATCHING (full engine)
// ════════════════════════════════════════════════════════════
// Map Indonesian/Latin number forms (from speech recognition) to Arabic transliterations
// so e.g. "50.000" / "50,000" / "50000" → "khamsiina alfa" can match خمسين ألف
const _NUM_TO_AR = [
  [/\b50[.,]?000\b/g, 'خمسين الف'],
  [/\b70[.,]?000\b/g, 'سبعين الف'],
  [/\b1[.,]?000\b/g, 'الف'],
  [/\b50\b/g, 'خمسين'],
  [/\b70\b/g, 'سبعين'],
  [/\b19\b/g, 'تسعة عشر'],
  [/\b12\b/g, 'اثنا عشر'],
  [/\b10\b/g, 'عشرة'],
  [/\b7\b/g, 'سبعة'],
  [/\b3\b/g, 'ثلاثة'],
  [/\b2\b/g, 'اثنين'],
  [/\b1\b/g, 'واحد'],
];
function _digitsToArabic(t) {
  for (const [re, ar] of _NUM_TO_AR) t = t.replace(re, ar);
  return t;
}

function normalizeArabic(text) {
  if (!text || typeof text !== 'string') return '';
  return _digitsToArabic(text)
    // Strip any remaining digits, commas, dots between digits
    .replace(/[0-9.,]+/g, ' ')
    // Strip all diacritics, harakat, tajweed marks
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0670\u0640\u0617\u0618\u0619\u06D7\u06D8\u06D9\u06DA\u06DB]/g,'')
    // Normalize alef variants → plain alef
    .replace(/[\u0623\u0625\u0622\u0671\u0672\u0673\u0675]/g,'\u0627')
    // Alef maksura → ya
    .replace(/\u0649/g,'\u064A')
    // Ta marbuta → ha
    .replace(/\u0629/g,'\u0647')
    // Hamza variants → remove or normalize
    .replace(/\u0624/g,'\u0648')  // waw hamza → waw
    .replace(/\u0626/g,'\u064A')  // ya hamza → ya
    .trim();
}
function normalizeArabicStrict(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06E4\u06E7-\u06E9]/g,'')
    .replace(/[\u0622\u0671]/g,'\u0627')
    .replace(/\u0649/g,'\u064A').replace(/\u0629/g,'\u0647').replace(/\u0640/g,'').trim();
}
function alternateNormalize(text) {
  if (!text || typeof text !== 'string') return '';
  return normalizeArabic(text).replace(/\u0621/g,'').replace(/\u0626/g,'\u064A').replace(/\u0624/g,'\u0648').trim();
}
function editDist(a,b) {
  const m=a.length,n=b.length; if(!m)return n; if(!n)return m;
  const dp=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);
  for(let j=0;j<=n;j++)dp[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}
function simNorm(s,r) {
  if(!s||!r)return 0; if(s===r)return 1;
  const sF=s[0],rF=r[0];
  if(s.length>=2&&r.length>=2){
    if((sF==='\u0641'&&rF==='\u0648')||(sF==='\u0648'&&rF==='\u0641')){
      if(editDist(s.slice(1),r.slice(1))<=1)return 0;
    }
  }
  const maxLen=Math.max(s.length,r.length);
  let sim=1-editDist(s,r)/maxLen;
  // Softer first-char penalty (Safari SR often varies first char)
  if(sF!==rF)sim*=0.82;
  const lr=Math.min(s.length,r.length)/maxLen;
  if(lr<0.55)sim*=lr;
  return Math.max(0,sim);
}
function spokenCandidates(spoken) {
  const s=normalizeArabic(spoken);
  const c=new Set([s,alternateNormalize(spoken)]);
  // Also add version with hamza stripped entirely
  c.add(s.replace(/\u0621/g,''));
  if(s.startsWith('\u0627\u0644')&&s.length>3){c.add(s.slice(2));c.add('\u0644'+s.slice(2));}
  if(s.startsWith('\u0648\u0627\u0644')&&s.length>4){c.add(s.slice(3));c.add('\u0644'+s.slice(3));}
  if(s==='\u0627\u0644\u0627'){c.add('\u0644\u0627');c.add('\u0627\u0646');}
  const C='\u0628\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A\u0641\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u064A';
  if(s.length>=4&&C.includes(s[0]))c.add('\u0627'+s);
  if(s.length>=4&&s[0]==='\u0627'&&C.includes(s[1]||''))c.add(s.slice(1));
  if(s.endsWith('\u0627')&&s.length>=3)c.add(s+'\u0621');
  if(s.endsWith('\u0621')&&s.length>=3)c.add(s.slice(0,-1));
  if(s.endsWith('\u0645')&&s.length>=3){c.add(s.slice(0,-1));c.add(s.slice(0,-1)+'\u0646');}
  if(s.endsWith('\u064A\u0646'))c.add(s.slice(0,-2)+'\u0648\u0646');
  if(s.endsWith('\u0648\u0646'))c.add(s.slice(0,-2)+'\u064A\u0646');
  if(s.startsWith('\u0648')&&s.length>=3)c.add('\u0639'+s.slice(1));
  if(s.startsWith('\u0639')&&s.length>=3)c.add('\u0648'+s.slice(1));
  // Safari sometimes prefixes/suffixes differently
  if(s.length>=3){
    c.add(s+'\u0627'); // add trailing alef
    c.add(s+'\u0647'); // add trailing ha
    if(s.endsWith('\u0647'))c.add(s.slice(0,-1)); // remove trailing ha
    if(s.endsWith('\u0627'))c.add(s.slice(0,-1)); // remove trailing alef
  }
  return [...c].filter(Boolean);
}
const LETTER_NAMES={'\u0646\u0648\u0646':'\u0646','\u0642\u0627\u0641':'\u0642','\u0635\u0627\u062F':'\u0635','\u0633\u064A\u0646':'\u0633','\u0645\u064A\u0645':'\u0645','\u0644\u0627\u0645':'\u0644','\u0643\u0627\u0641':'\u0643','\u0639\u064A\u0646':'\u0639','\u0637\u0627\u0621':'\u0637','\u062D\u0627\u0621':'\u062D','\u064A\u0627\u0621':'\u064A','\u0647\u0627\u0621':'\u0647','\u0646\u0646':'\u0646','\u0642\u0641':'\u0642'};
// Browser/platform detection (needed early for threshold tuning)
const _isMobileEarly = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const _isSafariEarly = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome'));
const MATCH_THRESHOLD = _isSafariEarly ? 0.42 : 0.50;

function wordSim(spokenRaw,refNorm){
  if(!refNorm)return 0;
  const refAlt=refNorm.replace(/\u0621/g,'');
  if(refAlt!==refNorm){const s=Math.max(...spokenCandidates(spokenRaw).map(c=>simNorm(c,refAlt)));if(s>=MATCH_THRESHOLD)return s;}
  if(refNorm.length>=3&&refNorm[0]==='\u0627'){const rna=refNorm.slice(1);const s=Math.max(...spokenCandidates(spokenRaw).map(c=>simNorm(c,rna)));if(s>=MATCH_THRESHOLD)return s*0.95;}
  if(refNorm.length<=2){const cands=spokenCandidates(spokenRaw);for(const c of cands){if(c===refNorm)return 1.0;if(c.length<=3&&c[0]===refNorm[0])return 0.85;if(c.includes(refNorm)||refNorm.includes(c))return 0.80;}const best=Math.max(...cands.map(c=>simNorm(c,refNorm)));return best>0.5?Math.max(0.75,best):best;}
  if(refNorm.length===1){for(const c of spokenCandidates(spokenRaw)){if(c===refNorm||LETTER_NAMES[c]===refNorm||c[0]===refNorm[0])return 0.95;}return 0;}
  if(refNorm.length<=4){const sn=normalizeArabic(spokenRaw);if(LETTER_NAMES[sn]&&normalizeArabic(LETTER_NAMES[sn])===refNorm)return 1;if(sn[0]===refNorm[0]&&sn.length<=refNorm.length*3){const base=Math.max(...spokenCandidates(spokenRaw).map(c=>simNorm(c,refNorm)));return Math.max(0.78,base);}}
  return Math.max(...spokenCandidates(spokenRaw).map(c=>simNorm(c,refNorm)));
}

function dtwScore(spokenArr,refArr){
  const m=spokenArr.length,n=refArr.length; if(!m||!n)return 0;
  const INF=-1e9;
  const dp=Array.from({length:m+1},()=>new Float32Array(n+1).fill(INF));
  dp[0][0]=0;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
    const ws=wordSim(spokenArr[i-1],refArr[j-1]);
    const best=Math.max(dp[i-1][j-1],dp[i-1][j]-0.30,dp[i][j-1]-0.30);
    if(best>INF/2)dp[i][j]=best+ws;
  }
  let best=INF;
  for(let j=1;j<=n;j++)if(dp[m][j]>best)best=dp[m][j];
  return best>INF/2?best/m:0;
}

// ════════════════════════════════════════════════════════════
//  CEK HAFALAN STATE
// ════════════════════════════════════════════════════════════
let currentSurah=68, allWords=[], allAyahs=[], cursor=0, currentAyahIndex=0;
let sessionActive=false, correctCount=0, wrongCount=0;
let rec=null, recRunning=false, processingResult=false;
let lastTranscriptTime=0, silenceTimeout=null, transcriptBuffer=[];
let sessionRunStart=-1;
let retryMode=false, retryCursor=-1, retryAyahStart=-1;

// ════════════════════════════════════════════════════════════
//  SOUND FEEDBACK (with debounce to prevent duplicate sounds on mobile)
// ════════════════════════════════════════════════════════════
let _lastSoundTime = 0;
const _SOUND_DEBOUNCE = 400; // ms — prevent same sound firing multiple times

function playCorrectSound(){
  const now = Date.now();
  if (now - _lastSoundTime < _SOUND_DEBOUNCE) return;
  _lastSoundTime = now;
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [800,1000].forEach((freq,i)=>{
      const osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.connect(gain);gain.connect(ctx.destination);
      osc.frequency.value=freq;osc.type='sine';
      const t=ctx.currentTime+i*0.05;
      gain.gain.setValueAtTime(0.1,t);
      gain.gain.exponentialRampToValueAtTime(0.01,t+0.15);
      osc.start(t);osc.stop(t+0.15);
    });
  }catch(e){}
}
function playWrongSound(){
  const now = Date.now();
  if (now - _lastSoundTime < _SOUND_DEBOUNCE) return;
  _lastSoundTime = now;
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.connect(gain);gain.connect(ctx.destination);
    osc.frequency.value=200;osc.type='sawtooth';
    gain.gain.setValueAtTime(0.15,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.25);
    osc.start();osc.stop(ctx.currentTime+0.25);
  }catch(e){}
}

// ════════════════════════════════════════════════════════════
//  MUSHAF RENDER + WORD LIST
// ════════════════════════════════════════════════════════════
async function loadSurah(){
  const sel=document.getElementById('hafalanSurahSel');
  const num=parseInt(sel.value);
  currentSurah=num;
  localStorage.setItem('murajaah_last_surah', num);
  sessionActive=false;
  if(rec){try{rec.stop();}catch(e){}rec=null;recRunning=false;}
  setMicOff();
  document.getElementById('mushafBody').innerHTML='<div style="text-align:center;padding:40px;color:var(--muted)">Memuat...</div>';
  const surah=await loadDynamicSurah(num);
  if(!surah){document.getElementById('mushafBody').innerHTML='<div style="text-align:center;padding:40px;color:var(--err)">Gagal memuat surah</div>';return;}
  renderMushaf(surah);
  populateAyatSel(surah);
}

function renderMushaf(surah){
  const body=document.getElementById('mushafBody');
  body.innerHTML='';
  allWords=[];allAyahs=[];cursor=0;currentAyahIndex=0;
  if(surah.bismillah&&surah.num!==1&&surah.num!==9){
    const bis=document.createElement('div');
    bis.className='bismillah';
    bis.textContent='\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650';
    body.appendChild(bis);
  }
  surah.ayahs.forEach((ayah,ayahIdx)=>{
    const row=document.createElement('div');
    row.className='ayah-row';
    row.dataset.ayahIndex=ayahIdx;
    const num=document.createElement('span');
    num.className='ayah-number';num.textContent=ayah.n;
    ayah.words.forEach((word,wordIdx)=>{
      const w=document.createElement('span');
      w.className='w idle';
      w.textContent=word+' ';
      w.dataset.wordIndex=allWords.length;
      const norm=normalizeArabic(word);
      const normStrict=normalizeArabicStrict(word);
      allWords.push({el:w,norm,normStrict,ref:word,original:word,ayahIndex:ayahIdx,wordIndexInAyah:wordIdx,ayahN:ayah.n});
      row.appendChild(w);
    });
    row.appendChild(num);
    body.appendChild(row);
    allAyahs.push(row);
  });
  // apply start ayat filter
  const startAyat=parseInt(document.getElementById('hafalanAyatSel')?.value||1);
  const startAyahIdx=surah.ayahs.findIndex(a=>a.n>=startAyat);
  if(startAyahIdx>0){
    // mark words before startAyat as passed
    let idx=0;
    for(let ai=0;ai<startAyahIdx;ai++){
      for(let wi=0;wi<surah.ayahs[ai].words.length;wi++){
        if(allWords[idx])allWords[idx].el.className='w passed';
        idx++;
      }
    }
    cursor=idx;currentAyahIndex=startAyahIdx;
  }
  updateProgress();highlightCursor();updateCurrentAyahHighlight();
  document.getElementById('audioStartAyah').max=surah.ayahs.length;
  document.getElementById('audioEndAyah').max=surah.ayahs.length;
  document.getElementById('audioEndAyah').value=Math.min(5,surah.ayahs.length);
}

function populateAyatSel(surah){
  const sel=document.getElementById('hafalanAyatSel');
  sel.innerHTML=surah.ayahs.map(a=>`<option value="${a.n}">${a.n}</option>`).join('');
}
function syncStartAyat(){
  const surah=SURAHS[currentSurah];
  if(surah)renderMushaf(surah);
}
function highlightCursor(){
  // Only highlight cursor in Mode Uji
  if(murojaahMode !== 'uji') return;
  allWords.forEach((w,i)=>{
    if(i===cursor){
      if(retryMode&&i===retryAyahStart)w.el.className='w retry-cursor';
      else if(['w idle','w skipped','w passed'].includes(w.el.className))w.el.className='w cursor';
    } else if(w.el.className==='w cursor'||w.el.className==='w retry-cursor'){
      w.el.className='w idle';
    } else if(i<cursor&&w.el.className==='w idle'){
      w.el.className='w passed';
    }
  });
  if(cursor<allWords.length){
    allWords[cursor].el.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
function updateCurrentAyahHighlight(){
  allAyahs.forEach((ayah,idx)=>ayah.classList.toggle('current-reading',idx===currentAyahIndex));
}
function updateProgress(){
  const pct=allWords.length?Math.round(cursor/allWords.length*100):0;
  document.getElementById('progFill').style.width=pct+'%';
}
function setDot(state,text){
  const dot=document.getElementById('statusDot');
  dot.className='status-dot'+(state==='ok'?' ok':state==='rec'?' rec':'');
  const txt=document.getElementById('statusText');
  if(txt)txt.textContent=text;
}
function log(msg){setDot('ok',msg);}
function setMicOff(){
  document.getElementById('btnMic').classList.remove('live');
  setDot('','Siap');
}

// ════════════════════════════════════════════════════════════
//  SESSION CONTROL
// ════════════════════════════════════════════════════════════
function toggleSession(){if(sessionActive)stopSession();else startSession();}
function startSession(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){showToast('❌ Browser tidak mendukung speech recognition');return;}
  if(!setupRec()){showToast('❌ Gagal setup mikrofon');return;}
  sessionActive=true;transcriptBuffer=[];lastTranscriptTime=Date.now();sessionRunStart=cursor;
  // Track activity
  trackDailyActivity('murojaah');

  window.srWarmingUp=true;
  window._interimDisplayTimer=null;
  setTimeout(()=>{window.srWarmingUp=false;log('✅ Siap — mulai membaca');},_SR_WARMUP_MS);
  try{rec.start();}catch(e){}
  const micBtn = document.getElementById('btnMic');
  micBtn.classList.add('live');
  micBtn.setAttribute('aria-pressed', 'true');
  micBtn.setAttribute('aria-label', 'Hentikan sesi murojaah');
}
function stopSession(){
  sessionActive=false;
  clearTimeout(window._hafaFeedbackTimer); window._hafaFeedbackTimer=null;
  clearTimeout(window._interimDisplayTimer); window._interimDisplayTimer=null;
  if(rec){ rec._finalBuffer=''; try{rec.stop();}catch(e){} }
  recRunning=false;setMicOff();
  const micBtn = document.getElementById('btnMic');
  if (micBtn) {
    micBtn.setAttribute('aria-pressed', 'false');
    micBtn.setAttribute('aria-label', 'Mulai sesi murojaah');
  }
}
function setupRec(){if(rec)return true;rec=createRec();return!!rec;}
// Deteksi platform
const _isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const _isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome'));
const _SR_FINAL_DEADLINE  = _isMobile ? 300 : 20;    // ms fixed deadline — timer set once, NOT reset on new tokens
const _SR_INTERIM_DELAY   = _isMobile ? 200 : 0;     // ms wait before applying interim visual
const _SR_RESTART_DELAY   = _isMobile ? 350 : 80;    // ms before restarting SR after onend
const _SR_WARMUP_MS       = _isMobile ? 700 : 200;   // ms warmup to ignore initial noise
const _SR_DEDUP_WINDOW    = _isMobile ? 500 : 200;   // ms dedup guard for same-cursor reprocess

function createRec(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR)return null;
  const r=new SR();
  r.lang='ar-SA';
  // Use non-continuous on mobile AND Safari — prevents duplicate finals
  r.continuous = !_isMobile && !_isSafari;
  r.interimResults=true;
  r.maxAlternatives=3;
  r._lastFinalIdx=-1;

  r.onstart=()=>{recRunning=true;setDot('rec','Mendengarkan...');};

  // Buffer akumulasi final
  r._finalBuffer = '';

  r.onresult=(e)=>{
    if(!sessionActive)return;
    if(window.srWarmingUp)return;

    let newFinal='', interim='';
    for(let i=e.resultIndex;i<e.results.length;i++){
      const res=e.results[i];
      if(res.isFinal){
        if(i<=r._lastFinalIdx)continue;
        r._lastFinalIdx=i;
        let bestAlt = '';
        for(let a=0;a<Math.min(res.length,3);a++){
          const alt=res[a].transcript.trim();
          if(alt){ bestAlt = alt; break; }
        }
        if(bestAlt) newFinal += bestAlt + ' ';
      } else {
        if(!newFinal){
          const alt=res[0].transcript.trim();
          if(alt) interim=alt;
        }
      }
    }

    // === FINAL RESULT ===
    if(newFinal.trim()){
      clearTimeout(window._interimDisplayTimer);
      window._interimDisplayTimer=null;
      clearInterimMark();

      // Dedup: skip if identical to last processed text
      const newNorm = normalizeArabic(newFinal.trim());
      if(window._lastProcessedText && normalizeArabic(window._lastProcessedText) === newNorm){
        return; // exact duplicate, skip
      }

      r._finalBuffer += ' ' + newFinal.trim();
      const accumulated = r._finalBuffer.trim();

      const ctRow=document.getElementById('capturedTextRow');
      const ctAr=document.getElementById('capturedTextAr');
      if(ctRow&&ctAr){ctRow.style.display='block';ctAr.textContent=accumulated;ctAr.style.color='var(--accent-dark)';}

      // Fixed deadline — set timer ONCE, don't reset
      if(!window._hafaFeedbackTimer){
        window._hafaFeedbackTimer=setTimeout(()=>{
          window._hafaFeedbackTimer=null;
          if(!sessionActive)return;
          const finalText = r._finalBuffer.trim();
          r._finalBuffer = '';
          if(!finalText)return;
          window._lastProcessedText = finalText; // remember for dedup
          const tokens = finalText.split(/\s+/).filter(Boolean);
          if(tokens.length > 0){
            processTokensStream(tokens);
          }
        }, _SR_FINAL_DEADLINE);
      }
      return;
    }

    // === INTERIM RESULT — visual only ===
    if(interim && !window._hafaFeedbackTimer && !r._finalBuffer){
      clearTimeout(window._interimDisplayTimer);
      const applyInterim=()=>{
        if(!sessionActive || window._hafaFeedbackTimer || r._finalBuffer) return;
        if(cursor<allWords.length){
          const w=allWords[cursor];
          if(!['w correct','w wrong','w passed'].includes(w.el.className)){
            w.el.className='w interim';
            w.el.scrollIntoView({behavior:'smooth',block:'center'});
          }
        }
        const ctRow=document.getElementById('capturedTextRow');
        const ctAr=document.getElementById('capturedTextAr');
        if(ctRow&&ctAr){ctRow.style.display='block';ctAr.textContent=interim+' ⏳';ctAr.style.color='#B05A00';}
      };
      if(_SR_INTERIM_DELAY===0) applyInterim();
      else window._interimDisplayTimer=setTimeout(applyInterim, _SR_INTERIM_DELAY);
    }
  };

  r.onerror=(e)=>{
    if(e.error==='not-allowed'){showToast('❌ Izinkan mikrofon');stopSession();}
    else if(e.error==='no-speech'){
      // Normal — just restart silently
      recRunning=false;
    }
    else if(e.error!=='aborted'){log('⚠️ '+e.error);recRunning=false;rec=null;}
  };
  r.onend=()=>{
    recRunning=false;
    if(!sessionActive){setMicOff();return;}
    // Process any remaining buffer from old rec before creating new one
    if(r._finalBuffer && r._finalBuffer.trim()){
      clearTimeout(window._hafaFeedbackTimer);
      window._hafaFeedbackTimer=null;
      const finalText = r._finalBuffer.trim();
      r._finalBuffer = '';
      if(finalText){
        window._lastProcessedText = finalText;
        const tokens = finalText.split(/\s+/).filter(Boolean);
        if(tokens.length > 0) processTokensStream(tokens);
      }
    }
    // Clear any pending timer from old rec
    clearTimeout(window._hafaFeedbackTimer);
    window._hafaFeedbackTimer=null;
    // Restart SR — create fresh instance to avoid stale state on Safari
    rec=createRec();if(!rec)return;
    setTimeout(()=>{if(sessionActive&&rec){try{rec.start();}catch(e){}}}, _SR_RESTART_DELAY);
  };
  return r;
}


function clearInterimMark(){
  if(cursor<allWords.length){
    const w=allWords[cursor];
    if(w.el.className==='w interim'){
      w.el.className=retryMode&&cursor===retryAyahStart?'w retry-cursor':'w cursor';
    }
  }
}

// ════════════════════════════════════════════════════════════
//  STREAMING TOKEN PROCESSOR
//  Proses setiap final token langsung, kata per kata
// ════════════════════════════════════════════════════════════
let _lastProcessCursor = -1;
let _lastProcessTime = 0;

function processTokensStream(tokens){
  if(!tokens.length||cursor>=allWords.length)return;

  // Dedup guard: if same cursor position processed very recently, skip
  const now = Date.now();
  if(cursor === _lastProcessCursor && now - _lastProcessTime < _SR_DEDUP_WINDOW){
    return;
  }
  _lastProcessCursor = cursor;
  _lastProcessTime = now;

  let si=0;

  // Cari best start offset (SR kadang prepend noise)
  let bestOffset=0, bestScore=-1;
  const maxOff = Math.min(4, tokens.length);
  for(let off=0;off<maxOff;off++){
    const s=wordSim(tokens[off], allWords[cursor].norm);
    if(s>bestScore){bestScore=s;bestOffset=off;}
  }
  // Always proceed to matcher loop — jalur "Bacaan tidak cocok" dihilangkan biar konsisten.
  // Matcher loop sendiri yang akan decide: kalau emang misalignment, masuk retry mode (Image 2).
  // Kalau cuma noise random, token2 di-skip sebagai si++ tanpa ada side effect.
  si=bestOffset;

  const startCursor=cursor;
  const startAyahIdx=allWords[cursor].ayahIndex;
  let correctInBatch=0, wrongWords=[];

  while(si<tokens.length && cursor<allWords.length){
    // Jangan lewat batas ayat — validasi per ayat
    if(allWords[cursor].ayahIndex !== startAyahIdx) break;

    const token=tokens[si];
    const w=allWords[cursor];
    let sim=wordSim(token, w.norm);

    // Coba ngram: 2 spoken token = 1 ref word
    if(sim<MATCH_THRESHOLD && si+1<tokens.length){
      const merged=normalizeArabic(tokens[si])+normalizeArabic(tokens[si+1]);
      const ngSim=simNorm(merged, w.norm);
      if(ngSim>=MATCH_THRESHOLD){sim=ngSim; si++;} // consume extra token
    }

    // Coba reverse ngram: 1 spoken token = 2 ref words
    if(sim<MATCH_THRESHOLD && cursor+1<allWords.length && allWords[cursor+1].ayahIndex===startAyahIdx){
      const mergedRef = w.norm + allWords[cursor+1].norm;
      const rngSim = simNorm(normalizeArabic(token), mergedRef);
      if(rngSim >= MATCH_THRESHOLD){
        w.el.className='w correct';
        allWords[cursor+1].el.className='w correct';
        correctInBatch+=2; cursor+=2; si++;
        updateProgress();
        if(cursor<allWords.length) allWords[cursor].el.scrollIntoView({behavior:'smooth',block:'center'});
        continue;
      }
    }

    if(sim>=MATCH_THRESHOLD){
      w.el.className='w correct';
      correctInBatch++;
      cursor++;si++;
      updateProgress();
      if(cursor<allWords.length){
        allWords[cursor].el.scrollIntoView({behavior:'smooth',block:'center'});
      }
    } else {
      // Tidak cocok di cursor — cek apakah token ini ada di kata-kata berikutnya
      // Lookahead = 3 (cukup untuk handle SR skip 1-2 hard-to-pronounce words,
      // tapi tidak terlalu jauh sampai user baca ayat lain pun lolos)
      let foundAhead=false;
      const LOOKAHEAD=3;
      for(let look=1;look<=LOOKAHEAD && cursor+look<allWords.length;look++){
        if(allWords[cursor+look].ayahIndex!==startAyahIdx) break;
        const aheadWord = allWords[cursor+look].norm;
        const aheadSim=wordSim(token, aheadWord);
        // STRICT: lookahead pakai threshold lebih TINGGI dari normal (bukan lebih rendah)
        // Kalau user baca ayat lain, kebetulan-cocok dengan kata di lookahead jauh lebih kecil
        const lookThreshold = MATCH_THRESHOLD + 0.08;
        // Tapi kalau gap = 1 (cuma skip 1 kata, biasanya kata sulit), tetep lenient
        const effectiveThreshold = look === 1 ? MATCH_THRESHOLD : lookThreshold;
        if(aheadSim>=effectiveThreshold){
          // Verify: gap ≤ 2 supaya gak ngeklaim banyak kata sekaligus benar
          if(look > 2) break;
          // Kalibrasi skip detection:
          //   gap = 1 → 'passed' (netral) — toleran kalau SR drop 1 kata pendek
          //   gap = 2 → 'wrong' (merah + masuk wrongWords) — user beneran skip,
          //             karena 2 kata sekaligus jarang terjadi karena SR glitch
          const skipClass = (look >= 2) ? 'w wrong' : 'w passed';
          const shouldFlag = (look >= 2);
          for(let skip=0;skip<look;skip++){
            allWords[cursor].el.className = skipClass;
            if (shouldFlag) wrongWords.push(cursor);
            cursor++;
          }
          allWords[cursor].el.className='w correct';
          correctInBatch++;cursor++;si++;
          updateProgress();foundAhead=true;
          if(cursor<allWords.length){
            allWords[cursor].el.scrollIntoView({behavior:'smooth',block:'center'});
          }
          break;
        }
      }
      if(!foundAhead){
        // Loose-sim fallback HANYA kalau ada minimal 1 correct di batch ini
        // (artinya user emang lagi baca ayat yg benar, cuma 1 kata mismatch dikit)
        const looseSim = wordSim(token, w.norm);
        if(correctInBatch > 0 && looseSim >= MATCH_THRESHOLD - 0.12 && looseSim > 0.35){
          w.el.className='w correct';
          correctInBatch++;
          cursor++;si++;
          updateProgress();
          if(cursor<allWords.length){
            allWords[cursor].el.scrollIntoView({behavior:'smooth',block:'center'});
          }
          continue;
        }
        // Token gak match apa-apa → noise / misalignment
        // Track berapa token berturut-turut yg gagal: kalau >= 3, tandai sebagai wrong
        wrongWords.push(cursor);
        si++;
      }
    }
  }

  // Only enter retry mode if we have wrong words AND at least some correct ones
  // (this means the user is reading but made mistakes, not just noise)
  const ayahComplete=checkAyahComplete(startAyahIdx);

  if(wrongWords.length > 0 && correctInBatch > 0){
    playWrongSound();
    enterRetryMode(wrongWords[0]);
    setDot('warn','⚠️ Ada kesalahan');
    // Flush buffer to prevent leftover tokens from causing more errors
    if(rec){ rec._finalBuffer=''; }
    clearTimeout(window._hafaFeedbackTimer);
    window._hafaFeedbackTimer=null;
  } else if(wrongWords.length > 0 && correctInBatch === 0){
    // All wrong with no correct — masuk retry mode dengan kata pertama yang salah
    // (jalur "Bacaan tidak sesuai" lama dihapus biar feedback konsisten dengan Image 2)
    playWrongSound();
    enterRetryMode(wrongWords[0]);
    setDot('warn','⚠️ Ada kesalahan');
    if(rec){ rec._finalBuffer=''; }
    clearTimeout(window._hafaFeedbackTimer);
    window._hafaFeedbackTimer=null;
  } else if(correctInBatch>0){
    if(ayahComplete){
      playCorrectSound();
      exitRetryMode();
      sessionRunStart=cursor;
      const newAyah=cursor<allWords.length?allWords[cursor].ayahIndex:currentAyahIndex;
      if(newAyah!==currentAyahIndex){currentAyahIndex=newAyah;updateCurrentAyahHighlight();}
      setDot('ok','✓ Ayat selesai — lanjut!');
      highlightCursor();
      // CRITICAL: flush SR buffer so leftover tokens from this ayat
      // don't spill into the next ayat and cause false errors
      if(rec){ rec._finalBuffer=''; }
      clearTimeout(window._hafaFeedbackTimer);
      window._hafaFeedbackTimer=null;
      window._lastProcessedText=null;
    } else {
      highlightCursor();
      setDot('ok','✓ Lanjut...');
    }
  }

  if(cursor>=allWords.length) onSurahComplete();
}

function checkAyahComplete(ayahIdx){
  // Cek apakah cursor sudah melewati semua kata di ayat ini
  for(let i=0;i<allWords.length;i++){
    if(allWords[i].ayahIndex===ayahIdx && i>=cursor && allWords[i].el.className==='w idle'){
      return false;
    }
  }
  return true;
}

function markWrongAndRetry(wordIdx){
  if(wordIdx>=allWords.length)return;
  allWords[wordIdx].el.className='w wrong';
  playWrongSound();
  enterRetryMode(wordIdx);
  setDot('warn','⚠️ Bacaan tidak sesuai — cek kata yang disorot merah');
}

// ════════════════════════════════════════════════════════════
//  RETRY MODE
// ════════════════════════════════════════════════════════════
function enterRetryMode(wrongWordIdx){
  retryMode=true;retryCursor=wrongWordIdx;
  const wrongWord=allWords[wrongWordIdx];if(!wrongWord)return;
  const wrongAyah=wrongWord.ayahIndex;
  let returnIdx=wrongWordIdx;
  for(let i=wrongWordIdx-1;i>=0;i--){if(allWords[i].ayahIndex===wrongAyah)returnIdx=i;else break;}
  retryAyahStart=returnIdx;
  for(let i=wrongWordIdx+1;i<allWords.length;i++){if(allWords[i]?.el?.className==='w correct'||allWords[i]?.el?.className==='w wrong')allWords[i].el.className='w idle';}
  for(let i=returnIdx;i<wrongWordIdx;i++){if(allWords[i]?.el&&allWords[i].el.className!=='w correct')allWords[i].el.className='w correct';}
  if(wrongWord.el)wrongWord.el.className='w wrong';
  cursor=returnIdx;
  if(allWords[returnIdx]?.el)allWords[returnIdx].el.className='w retry-cursor';
  currentAyahIndex=wrongAyah;updateCurrentAyahHighlight();
  sessionRunStart=returnIdx;
  document.getElementById('retryAyahNum').textContent=`AYAT ${wrongWord.ayahN||wrongAyah+1}`;
  document.getElementById('retryWord').textContent=wrongWord.original||wrongWord.norm;
  document.getElementById('retryBanner').classList.add('show');
  wrongWord.el.closest('.ayah-row')?.scrollIntoView({behavior:'smooth',block:'center'});
  setDot('warn','\uD83D\uDD01 Ulangi dari kursor kuning');
}
function exitRetryMode(){
  allWords.forEach(w=>{if(w.el?.className==='w retry-cursor')w.el.className='w idle';});
  retryMode=false;retryCursor=-1;retryAyahStart=-1;
  document.getElementById('retryBanner').classList.remove('show');
  const suggEl=document.getElementById('retrySuggestion');
  if(suggEl)suggEl.style.display='none';
  window._retryWordInfo=null;
}
function skipWrongWord(){
  if(retryCursor>=0&&retryCursor<allWords.length){
    const wrongAyah=allWords[retryCursor].ayahIndex;
    let nextIdx=retryCursor;
    while(nextIdx<allWords.length&&allWords[nextIdx].ayahIndex===wrongAyah){
      if(allWords[nextIdx].el.className!=='w correct')allWords[nextIdx].el.className='w skipped';
      nextIdx++;
    }
    cursor=nextIdx;
    if(cursor<allWords.length)currentAyahIndex=allWords[cursor].ayahIndex;
    sessionRunStart=cursor;
  }
  exitRetryMode();highlightCursor();updateCurrentAyahHighlight();
  log('\u23ED Ayat dilewati');
}
function skipForward(){
  // If currently in retry mode (after a wrong word), use the original behavior
  if (retryCursor >= 0 && retryCursor < allWords.length) {
    skipWrongWord();
    return;
  }
  // Otherwise: advance cursor to the start of the NEXT ayah from current position
  if (cursor >= allWords.length) return;
  const curAyah = allWords[cursor] ? allWords[cursor].ayahIndex : currentAyahIndex;
  let nextIdx = cursor;
  // Mark remaining words of current ayah as skipped
  while (nextIdx < allWords.length && allWords[nextIdx].ayahIndex === curAyah) {
    if (allWords[nextIdx].el.className !== 'w correct') allWords[nextIdx].el.className = 'w skipped';
    nextIdx++;
  }
  cursor = nextIdx;
  if (cursor < allWords.length) currentAyahIndex = allWords[cursor].ayahIndex;
  sessionRunStart = cursor;
  highlightCursor();
  updateCurrentAyahHighlight();
  log('\u23ED Ayat dilewati');
}
function resetSession(){
  stopSession();cursor=0;correctCount=0;wrongCount=0;currentAyahIndex=0;
  clearTimeout(window._hafaFeedbackTimer); window._hafaFeedbackTimer=null;
  clearTimeout(window._interimDisplayTimer); window._interimDisplayTimer=null;
  if(rec) { rec._finalBuffer=''; }
  window._lastProcessedText = null;

  allWords.forEach(w=>w.el.className='w idle');
  document.getElementById('retryBanner').classList.remove('show');
  document.getElementById('progFill').style.width='0%';
  // karaoke mode — no transcript bar
  retryMode=false;retryCursor=-1;retryAyahStart=-1;
  // reset captured text bar
  const ctRow=document.getElementById('capturedTextRow');
  const ctAr=document.getElementById('capturedTextAr');
  if(ctRow)ctRow.style.display='none';
  if(ctAr){ctAr.textContent='—';ctAr.style.color='var(--accent-dark)';}
  if(allWords.length)highlightCursor();
  updateCurrentAyahHighlight();setDot('','\u0633\u064A\u0627\u067E');
}
// ════════════════════════════════════════════════════════════
//  PLAY CORRECT PRONUNCIATION via Quran Audio API
// ════════════════════════════════════════════════════════════
let _retryAudioEl=null;
async function playWrongWordAudio(){
  const info=window._retryWordInfo;
  if(!info){showToast('Info kata tidak tersedia');return;}
  const btn=document.getElementById('retryAudioBtn');
  if(btn){btn.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';btn.style.background='var(--err)';}
  // Stop existing
  if(_retryAudioEl){_retryAudioEl.pause();_retryAudioEl=null;}
  // Try Quran Foundation audio for the ayah
  const url=`https://verses.quran.foundation/Shaatri/${String(info.surah).padStart(3,'0')}${String(info.ayah).padStart(3,'0')}.mp3`;
  try{
    const a=new Audio(url);
    _retryAudioEl=a;
    a.onended=()=>{
      if(btn){btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';btn.style.background='var(--accent)';}
    };
    a.onerror=()=>{
      showToast('Audio tidak tersedia untuk ayat ini');
      if(btn){btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';btn.style.background='var(--accent)';}
    };
    await a.play();
  }catch(e){
    showToast('Gagal memutar audio');
    if(btn){btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';btn.style.background='var(--accent)';}
  }
}

function onSurahComplete(){
  stopSession();setDot('ok','\uD83C\uDF89 Selesai!');
  showToast('Masyaa Allah! 🌙 Surah selesai!');
}

// ════════════════════════════════════════════════════════════
//  AUDIO REPEAT
// ════════════════════════════════════════════════════════════
let audioPlaying=false,audioCurrentRepeat=0,audioCurrentAyah=0,audioTimeoutId=null,audioCurrentSurah=parseInt(localStorage.getItem('murajaah_last_audio_surah'))||1;
let audioCurrentEl=null; // track elemen audio yg sedang diputar
function getAudioUrl(s,a){return `https://everyayah.com/data/Alafasy_128kbps/${String(s).padStart(3,'0')}${String(a).padStart(3,'0')}.mp3`;}
function syncAudioSurah(){
  audioCurrentSurah=parseInt(document.getElementById('audioSurahSel').value);
  localStorage.setItem('murajaah_last_audio_surah',audioCurrentSurah);
  // Update max attribute on ayah inputs based on selected surah's ayah count
  const meta = JUZ_SURAHS[audioCurrentSurah] || SURAHS[audioCurrentSurah];
  const maxAyah = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;
  const startEl = document.getElementById('audioStartAyah');
  const endEl = document.getElementById('audioEndAyah');
  startEl.max = maxAyah;
  endEl.max = maxAyah;
  // Clamp current values if surah changed to a smaller surah
  if (parseInt(startEl.value) > maxAyah) startEl.value = 1;
  if (parseInt(endEl.value) > maxAyah) endEl.value = maxAyah;
}

// Validate ayah range: clamp to [1, surah max], and enforce to >= from
function validateAudioAyahRange(changedField) {
  const startEl = document.getElementById('audioStartAyah');
  const endEl = document.getElementById('audioEndAyah');
  const meta = JUZ_SURAHS[audioCurrentSurah] || SURAHS[audioCurrentSurah];
  const maxAyah = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;

  let from = parseInt(startEl.value);
  let to = parseInt(endEl.value);

  // Clamp to valid range [1, maxAyah]
  if (isNaN(from) || from < 1) from = 1;
  if (from > maxAyah) from = maxAyah;
  if (isNaN(to) || to < 1) to = 1;
  if (to > maxAyah) to = maxAyah;

  // Cross-validation: to must be >= from
  if (changedField === 'from' && from > to) {
    to = from;
  } else if (changedField === 'to' && to < from) {
    from = to;
  }

  startEl.value = from;
  endEl.value = to;
  updateAudioStatusText();
}

// Adjust repeat count via stepper buttons (- / +)
function adjustAudioRepeat(delta) {
  const input = document.getElementById('audioRepeatCount');
  let v = parseInt(input.value) || 1;
  v = Math.max(1, Math.min(99, v + delta));
  input.value = v;
  updateAudioStatusText();
}

// Update the status text under the form to reflect current selection
function updateAudioStatusText() {
  const statusEl = document.getElementById('audioStatus');
  if (!statusEl) return;
  // Don't override if currently playing (status shows playback state)
  if (audioPlaying) return;
  const sel = document.getElementById('audioSurahSel');
  const surahName = sel && sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '—';
  // Strip leading number prefix like "70. Al-Ma'arij" → "Al-Ma'arij"
  const cleanName = surahName.replace(/^\d+\.\s*/, '');
  const from = parseInt(document.getElementById('audioStartAyah').value) || 1;
  const to = parseInt(document.getElementById('audioEndAyah').value) || from;
  const repeat = parseInt(document.getElementById('audioRepeatCount').value) || 1;
  statusEl.textContent = `Siap memutar: ${cleanName} ayat ${from} sampai ${to} dengan ${repeat}x pengulangan.`;
}

function toggleAudioPlayer(){if(audioPlaying)stopAudioPlayer();else startAudioPlayer();}
function startAudioPlayer(){
  syncAudioSurah(); // always sync surah from dropdown before playing
  // Run validation to clamp ayah inputs to valid range BEFORE reading values
  validateAudioAyahRange();
  const start=parseInt(document.getElementById('audioStartAyah').value);
  const end=parseInt(document.getElementById('audioEndAyah').value);
  const meta = JUZ_SURAHS[audioCurrentSurah] || SURAHS[audioCurrentSurah];
  const maxAyah = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;
  // Final defense: refuse to play if range is somehow still invalid
  if (!start || !end || start < 1 || end < 1 || start > maxAyah || end > maxAyah || end < start) {
    showToast('❌ Range ayat tidak valid');
    return;
  }
  const repeat=parseInt(document.getElementById('audioRepeatCount').value);
  const pause=parseFloat(document.getElementById('audioPause').value)*1000;
  audioPlaying=true;audioCurrentRepeat=0;audioCurrentAyah=start;
  const btn=document.getElementById('audioPlayBtn');
  btn.style.background='var(--err)';btn.style.boxShadow='0 4px 12px rgba(217,79,79,0.3)';
  btn.setAttribute('aria-pressed', 'true');
  btn.setAttribute('aria-label', 'Hentikan audio');
  document.getElementById('audioPlayIcon').innerHTML='<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  document.getElementById('audioPlayLabel').textContent='Stop';
  playNextAudio(start,end,repeat,pause);
}
function playNextAudio(start,end,totalRepeats,pause){
  if(!audioPlaying)return;
  if(audioCurrentAyah>end){audioCurrentRepeat++;if(audioCurrentRepeat>=totalRepeats){stopAudioPlayer();document.getElementById('audioStatus').textContent='✅ Selesai';return;}audioCurrentAyah=start;}
  const surah=SURAHS[audioCurrentSurah]||JUZ_SURAHS[audioCurrentSurah]||{name:'Surah'};
  document.getElementById('audioStatus').textContent=`${surah.name} · Ayat ${audioCurrentAyah} · Pengulangan ke- ${audioCurrentRepeat+1}/${totalRepeats}`;
  const audio=new Audio(getAudioUrl(audioCurrentSurah,audioCurrentAyah));
  audioCurrentEl=audio;
  audio.onended=()=>{if(!audioPlaying)return;audioCurrentAyah++;audioTimeoutId=setTimeout(()=>playNextAudio(start,end,totalRepeats,pause),pause);};
  audio.onerror=()=>{if(!audioPlaying)return;audioCurrentAyah++;playNextAudio(start,end,totalRepeats,pause);};
  audio.play().catch(()=>{});
}
function stopAudioPlayer(){
  audioPlaying=false;
  clearTimeout(audioTimeoutId);
  if(audioCurrentEl){audioCurrentEl.pause();audioCurrentEl.src='';audioCurrentEl=null;}
  const btn=document.getElementById('audioPlayBtn');
  btn.style.background='';btn.style.boxShadow='';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', 'Putar audio pengulangan');
  document.getElementById('audioPlayIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3"/>';
  document.getElementById('audioPlayLabel').textContent='Putar Audio';
  document.getElementById('audioStatus').textContent='Dihentikan';
}

// ════════════════════════════════════════════════════════════
//  SAMBUNG AYAT — FULL LOGIC WITH AUDIO PLAYBACK
// ════════════════════════════════════════════════════════════
let sambungActive = false;
let sambungWaitingForUser = false;
let sambungRec = null;
let sambungRecRunning = false;
let sambungBuffer = [];
let sambungSilenceTimeout = null;
let sambungCurrentAudio = null;
let sambungPromptSurah = 68, sambungPromptAyahN = 1;
let sambungTargetSurah = 68, sambungTargetAyahN = 2;
let sambungScoreOk = 0, sambungScoreErr = 0;
let sambungSurahRanges = [];
let sambungCountdownTimer = null;
let sambungCurrentSurah = 68;
// Smart shuffle: queue untuk hindari pengulangan soal
let sambungQuestionQueue = [];
let sambungRecentHistory = []; // history soal yang sudah ditanya (max 1/3 pool)
const SAMBUNG_HISTORY_RATIO = 0.4; // hindari 40% soal terakhir

let sambungSelectedJuz = new Set();
let sambungSelectedSurahs = new Set(); // tidak ada default — user pilih sendiri
let sambungTabMode = 'surah'; // default Per Surah

// Juz → surah range mapping
const JUZ_MAP = {
  1:{surahs:[{s:1,from:1,to:7},{s:2,from:1,to:141}]},
  2:{surahs:[{s:2,from:142,to:252}]},
  3:{surahs:[{s:2,from:253,to:286},{s:3,from:1,to:92}]},
  4:{surahs:[{s:3,from:93,to:200},{s:4,from:1,to:23}]},
  5:{surahs:[{s:4,from:24,to:147}]},
  6:{surahs:[{s:4,from:148,to:176},{s:5,from:1,to:81}]},
  7:{surahs:[{s:5,from:82,to:120},{s:6,from:1,to:110}]},
  8:{surahs:[{s:6,from:111,to:165},{s:7,from:1,to:87}]},
  9:{surahs:[{s:7,from:88,to:206},{s:8,from:1,to:40}]},
  10:{surahs:[{s:8,from:41,to:75},{s:9,from:1,to:92}]},
  11:{surahs:[{s:9,from:93,to:129},{s:10,from:1,to:109},{s:11,from:1,to:5}]},
  12:{surahs:[{s:11,from:6,to:123},{s:12,from:1,to:52}]},
  13:{surahs:[{s:12,from:53,to:111},{s:13,from:1,to:43},{s:14,from:1,to:52},{s:15,from:1,to:1}]},
  14:{surahs:[{s:15,from:1,to:99},{s:16,from:1,to:128}]},
  15:{surahs:[{s:17,from:1,to:111},{s:18,from:1,to:74}]},
  16:{surahs:[{s:18,from:75,to:110},{s:19,from:1,to:98},{s:20,from:1,to:135}]},
  17:{surahs:[{s:21,from:1,to:112},{s:22,from:1,to:78}]},
  18:{surahs:[{s:23,from:1,to:118},{s:24,from:1,to:64},{s:25,from:1,to:20}]},
  19:{surahs:[{s:25,from:21,to:77},{s:26,from:1,to:227},{s:27,from:1,to:55}]},
  20:{surahs:[{s:27,from:56,to:93},{s:28,from:1,to:88},{s:29,from:1,to:45}]},
  21:{surahs:[{s:29,from:46,to:69},{s:30,from:1,to:60},{s:31,from:1,to:34},{s:32,from:1,to:30}]},
  22:{surahs:[{s:33,from:1,to:73},{s:34,from:1,to:54},{s:35,from:1,to:45},{s:36,from:1,to:27}]},
  23:{surahs:[{s:36,from:28,to:83},{s:37,from:1,to:182},{s:38,from:1,to:88},{s:39,from:1,to:31}]},
  24:{surahs:[{s:39,from:32,to:75},{s:40,from:1,to:85},{s:41,from:1,to:46}]},
  25:{surahs:[{s:41,from:47,to:54},{s:42,from:1,to:53},{s:43,from:1,to:89},{s:44,from:1,to:59},{s:45,from:1,to:37}]},
  26:{surahs:[{s:46,from:1,to:35},{s:47,from:1,to:38},{s:48,from:1,to:29},{s:49,from:1,to:18},{s:50,from:1,to:45},{s:51,from:1,to:30}]},
  27:{surahs:[{s:51,from:31,to:60},{s:52,from:1,to:49},{s:53,from:1,to:62},{s:54,from:1,to:55},{s:55,from:1,to:78},{s:56,from:1,to:96},{s:57,from:1,to:29}]},
  28:{surahs:[{s:58,from:1,to:22},{s:59,from:1,to:24},{s:60,from:1,to:13},{s:61,from:1,to:14},{s:62,from:1,to:11},{s:63,from:1,to:11},{s:64,from:1,to:18},{s:65,from:1,to:12},{s:66,from:1,to:12}]},
  29:{surahs:[{s:67,from:1,to:30},{s:68,from:1,to:52},{s:69,from:1,to:52},{s:70,from:1,to:44},{s:71,from:1,to:28},{s:72,from:1,to:28},{s:73,from:1,to:20},{s:74,from:1,to:56},{s:75,from:1,to:40},{s:76,from:1,to:31},{s:77,from:1,to:50}]},
  30:{surahs:[{s:78,from:1,to:40},{s:79,from:1,to:46},{s:80,from:1,to:42},{s:81,from:1,to:29},{s:82,from:1,to:19},{s:83,from:1,to:36},{s:84,from:1,to:25},{s:85,from:1,to:22},{s:86,from:1,to:17},{s:87,from:1,to:19},{s:88,from:1,to:26},{s:89,from:1,to:30},{s:90,from:1,to:20},{s:91,from:1,to:15},{s:92,from:1,to:21},{s:93,from:1,to:11},{s:94,from:1,to:8},{s:95,from:1,to:8},{s:96,from:1,to:19},{s:97,from:1,to:5},{s:98,from:1,to:8},{s:99,from:1,to:8},{s:100,from:1,to:11},{s:101,from:1,to:11},{s:102,from:1,to:8},{s:103,from:1,to:3},{s:104,from:1,to:9},{s:105,from:1,to:5},{s:106,from:1,to:4},{s:107,from:1,to:7},{s:108,from:1,to:3},{s:109,from:1,to:6},{s:110,from:1,to:3},{s:111,from:1,to:5},{s:112,from:1,to:4},{s:113,from:1,to:5},{s:114,from:1,to:6}]}
};

function sambungSwitchTab(tab) {
  sambungTabMode = tab;
  const juzPanel   = document.getElementById('sambung-juz-panel');
  const surahPanel = document.getElementById('sambung-surah-panel');
  const tabJuz     = document.getElementById('sambung-tab-juz');
  const tabSurah   = document.getElementById('sambung-tab-surah');

  if (tab === 'surah') {
    surahPanel.style.display = 'block'; juzPanel.style.display = 'none';
    tabSurah.style.background  = 'var(--accent)'; tabSurah.style.color = '#fff';
    tabSurah.style.boxShadow   = '0 1px 4px rgba(0,0,0,0.08)';
    tabJuz.style.background    = 'transparent'; tabJuz.style.color = 'var(--muted)';
    tabJuz.style.boxShadow     = 'none';
    tabSurah.setAttribute('aria-selected', 'true');
    tabJuz.setAttribute('aria-selected', 'false');
    renderSambungSurahChips();
  } else {
    juzPanel.style.display = 'block'; surahPanel.style.display = 'none';
    tabJuz.style.background    = 'var(--accent)'; tabJuz.style.color = '#fff';
    tabJuz.style.boxShadow     = '0 1px 4px rgba(0,0,0,0.08)';
    tabSurah.style.background  = 'transparent'; tabSurah.style.color = 'var(--muted)';
    tabSurah.style.boxShadow   = 'none';
    tabJuz.setAttribute('aria-selected', 'true');
    tabSurah.setAttribute('aria-selected', 'false');
  }
  updateSambungSummary();
}

// Map surahNum → {from, to} — user bisa override range ayat per surah
const sambungSurahRangeOverrides = {};

function renderSambungJuzChips() {
  const container = document.getElementById('sambung-juz-chips');
  if (!container) return;
  container.innerHTML = '';
  for (let j = 1; j <= 30; j++) {
    const isSelected = sambungSelectedJuz.has(j);
    const chip = document.createElement('div');
    chip.className = 'sambung-chip' + (isSelected ? ' selected' : '');
    chip.textContent = 'Juz ' + j;
    // ARIA: toggle-able checkbox
    chip.setAttribute('role', 'checkbox');
    chip.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-label', 'Juz ' + j);
    const toggle = () => {
      if (sambungSelectedJuz.has(j)) { if (sambungSelectedJuz.size > 1) sambungSelectedJuz.delete(j); }
      else sambungSelectedJuz.add(j);
      renderSambungJuzChips();
      updateSambungSummary();
    };
    chip.onclick = toggle;
    chip.onkeydown = (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); toggle(); }
    };
    container.appendChild(chip);
  }
}

function renderSambungSurahChips() {
  const container = document.getElementById('sambung-surah-chips');
  if (!container) return;
  const searchVal = (document.getElementById('sambung-surah-search')?.value || '').toLowerCase();
  container.innerHTML = '';
  const list = getAllSurahList();
  list.filter(s => !searchVal || s.name.toLowerCase().includes(searchVal) || String(s.num).includes(searchVal))
    .forEach(s => {
      const isSelected = sambungSelectedSurahs.has(s.num);
      const chip = document.createElement('div');
      chip.className = 'sambung-chip' + (isSelected ? ' selected' : '');
      chip.textContent = s.num + '. ' + s.name;
      // ARIA: treat as a toggle-able checkbox
      chip.setAttribute('role', 'checkbox');
      chip.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('aria-label', `${s.num}. ${s.name}`);
      const toggle = () => {
        if (sambungSelectedSurahs.has(s.num)) {
          sambungSelectedSurahs.delete(s.num);
          delete sambungSurahRangeOverrides[s.num];
        } else {
          sambungSelectedSurahs.add(s.num);
          // Auto-fill default range (1 sampai max ayat)
          const meta = JUZ_SURAHS[s.num] || SURAHS[s.num];
          const maxAyah = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;
          sambungSurahRangeOverrides[s.num] = { from: 1, to: maxAyah };
        }
        renderSambungSurahChips();
        renderSambungAyatRanges();
        updateSambungSummary();
      };
      chip.onclick = toggle;
      // Keyboard support: Space or Enter toggles the chip
      chip.onkeydown = (ev) => {
        if (ev.key === ' ' || ev.key === 'Enter') {
          ev.preventDefault();
          toggle();
        }
      };
      container.appendChild(chip);
    });
  renderSambungAyatRanges();
}

function renderSambungAyatRanges() {
  const container = document.getElementById('sambung-ayat-ranges');
  if (!container) return;
  const selected = [...sambungSelectedSurahs].sort((a,b) => a-b);
  if (selected.length === 0) { container.style.display = 'none'; return; }
  container.style.display = 'flex';
  container.innerHTML = '';

  // Label header
  const hdr = document.createElement('div');
  hdr.style.cssText = 'font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-family:var(--font-mono);margin-bottom:2px';
  hdr.textContent = 'Range Ayat';
  container.appendChild(hdr);

  selected.forEach(num => {
    const meta = JUZ_SURAHS[num] || SURAHS[num];
    const maxAyah = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;
    const name = meta ? meta.name : 'Surah ' + num;

    if (!sambungSurahRangeOverrides[num]) {
      sambungSurahRangeOverrides[num] = { from: 1, to: maxAyah };
    }
    const ov = sambungSurahRangeOverrides[num];

    const row = document.createElement('div');
    row.className = 'sambung-range-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'sambung-range-name';
    nameEl.textContent = num + '. ' + name;

    const fromInput = document.createElement('input');
    fromInput.type = 'number'; fromInput.className = 'sambung-range-input';
    fromInput.min = 1; fromInput.max = maxAyah; fromInput.value = ov.from;
    fromInput.title = 'Dari ayat';
    fromInput.oninput = () => {
      let v = parseInt(fromInput.value) || 1;
      v = Math.max(1, Math.min(v, maxAyah));
      sambungSurahRangeOverrides[num].from = v;
      if (sambungSurahRangeOverrides[num].to < v) {
        sambungSurahRangeOverrides[num].to = v;
        toInput.value = v;
      }
    };

    const sep = document.createElement('span');
    sep.className = 'sambung-range-sep'; sep.textContent = '–';

    const toInput = document.createElement('input');
    toInput.type = 'number'; toInput.className = 'sambung-range-input';
    toInput.min = 1; toInput.max = maxAyah; toInput.value = ov.to;
    toInput.title = 'Sampai ayat';
    toInput.oninput = () => {
      let v = parseInt(toInput.value) || maxAyah;
      v = Math.max(1, Math.min(v, maxAyah));
      sambungSurahRangeOverrides[num].to = v;
      if (sambungSurahRangeOverrides[num].from > v) {
        sambungSurahRangeOverrides[num].from = v;
        fromInput.value = v;
      }
    };

    const maxLbl = document.createElement('span');
    maxLbl.style.cssText = 'font-size:11px;color:var(--muted2);font-family:var(--font-mono);flex-shrink:0';
    maxLbl.textContent = '/' + maxAyah;

    row.appendChild(nameEl);
    row.appendChild(fromInput);
    row.appendChild(sep);
    row.appendChild(toInput);
    row.appendChild(maxLbl);
    container.appendChild(row);
  });
}

function updateSambungSummary() {
  const el = document.getElementById('sambung-selected-summary');
  if (!el) return;
  if (sambungTabMode === 'juz') {
    const sorted = [...sambungSelectedJuz].sort((a,b) => a-b);
    el.textContent = sorted.length ? `${sorted.length} juz dipilih: Juz ${sorted.join(', ')}` : 'Pilih minimal 1 juz';
  } else {
    const sorted = [...sambungSelectedSurahs].sort((a,b) => a-b);
    el.textContent = sorted.length ? `${sorted.length} surah dipilih` : 'Pilih minimal 1 surah';
  }
}

function initSambungPage() {
  renderSambungJuzChips();
  renderSambungSurahChips();
  renderSambungAyatRanges();
  // Aktifkan tab Per Surah sebagai default
  sambungSwitchTab('surah');
  updateSambungSummary();
}

async function startSambungMode() {
  const btn = document.getElementById('sambung-start-btn');

  // Build ranges berdasarkan tab mode
  let surahsToLoad = [];
  let ranges = [];

  if (sambungTabMode === 'juz') {
    if (sambungSelectedJuz.size === 0) { showToast('Pilih minimal 1 juz'); return; }
    sambungSelectedJuz.forEach(j => {
      const juzData = JUZ_MAP[j];
      if (juzData) juzData.surahs.forEach(r => {
        if (!surahsToLoad.includes(r.s)) surahsToLoad.push(r.s);
        ranges.push({ surahNum: r.s, fromAyah: r.from, toAyah: r.to });
      });
    });
  } else {
    if (sambungSelectedSurahs.size === 0) { showToast('Pilih minimal 1 surah'); return; }
    sambungSelectedSurahs.forEach(s => {
      if (!surahsToLoad.includes(s)) surahsToLoad.push(s);
      const meta = JUZ_SURAHS[s] || SURAHS[s];
      const ayahCount = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;
      const ov = sambungSurahRangeOverrides[s];
      ranges.push({ surahNum: s, fromAyah: ov ? ov.from : 1, toAyah: ov ? ov.to : ayahCount });
    });
  }

  btn.disabled = true;
  btn.textContent = '⏳ Memuat...';

  // Load semua surah yang dibutuhkan
  for (const s of surahsToLoad) {
    await loadDynamicSurah(s);
  }

  // Verify ranges — gunakan data yang ada di SURAHS
  const validRanges = [];
  for (const r of ranges) {
    const data = SURAHS[r.surahNum];
    if (!data || !data.ayahs || data.ayahs.length < 2) continue;
    const actualFrom = data.ayahs[0].n;
    const actualTo = data.ayahs[data.ayahs.length - 1].n;
    validRanges.push({
      surahNum: r.surahNum,
      fromAyah: Math.max(r.fromAyah, actualFrom),
      toAyah: Math.min(r.toAyah, actualTo)
    });
  }

  if (validRanges.length === 0) {
    setDotSambung('warn', '❌ Gagal memuat surah');
    btn.disabled = false;
    btn.textContent = 'Mulai Sambung Ayat';
    btn.style.display = 'flex';
    document.getElementById('sambung-surah-row').style.display = 'block';
    document.getElementById('sambung-prompt-card').style.display = 'none';
    document.getElementById('sambung-controls').style.display = 'none';
    return;
  }

  document.getElementById('sambung-prompt-card').style.display = 'block';
  document.getElementById('sambung-controls').style.display = 'block';
  document.getElementById('sambung-score-chips').style.display = 'flex';
  btn.style.display = 'none';
  document.getElementById('sambung-surah-row').style.display = 'none';

  sambungSurahRanges = validRanges;
  sambungActive = true;
  sambungScoreOk = 0;
  sambungScoreErr = 0;
  // Reset shuffle queue untuk sesi baru
  sambungQuestionQueue = [];
  sambungRecentHistory = [];
  document.getElementById('sambung-score-ok').textContent = '0';
  document.getElementById('sambung-score-err').textContent = '0';

  nextSambung();
}

async function nextSambung() {
  cancelSambungCountdown();
  stopSambungRec();
  sambungWaitingForUser = false;

  const resultEl = document.getElementById('sambung-result-ar');
  if (resultEl) { resultEl.style.display = 'none'; resultEl.textContent = '—'; resultEl.className = 'sambung-result-ar'; }
  const nextBtn = document.getElementById('sambung-next-btn');
  if (nextBtn) nextBtn.style.display = 'none';
  const hintBox = document.getElementById('sambung-hint-box');
  if (hintBox) hintBox.style.display = 'none';

  // Reset captured text box setiap soal baru
  const capRow = document.getElementById('sambung-captured-row');
  const capAr  = document.getElementById('sambung-captured-ar');
  if (capRow) capRow.style.display = 'block';
  if (capAr)  { capAr.textContent = '—'; capAr.style.color = 'var(--muted2)'; }
  // KUNCI: reset buffer setiap soal baru
  sambungBuffer = [];
  clearTimeout(sambungSilenceTimeout);
  sambungSilenceTimeout = null;

  setDotSambung('', 'Memilih ayat...');

  // Build full pool
  let pool = [];
  sambungSurahRanges.forEach(r => {
    const data = SURAHS[r.surahNum];
    if (!data) return;
    data.ayahs.forEach((a, idx) => {
      if (a.n >= r.fromAyah && a.n < r.toAyah && idx + 1 < data.ayahs.length) {
        pool.push({ surahNum: r.surahNum, ayahN: a.n });
      }
    });
  });

  if (pool.length === 0) {
    setDotSambung('warn', '⚠️ Tidak ada ayat tersedia');
    return;
  }

  // --- Smart shuffle: isi ulang queue jika kosong ---
  function makeShuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Trim history max SAMBUNG_HISTORY_RATIO * pool
  const maxHistory = Math.max(1, Math.floor(pool.length * SAMBUNG_HISTORY_RATIO));

  // Cari kandidat: pool minus recent history
  function getKey(item) { return `${item.surahNum}_${item.ayahN}`; }
  const historySet = new Set(sambungRecentHistory);
  let candidates = pool.filter(p => !historySet.has(getKey(p)));

  // Jika semua sudah pernah ditanya (pool sangat kecil), reset history
  if (candidates.length === 0) {
    sambungRecentHistory = [];
    candidates = pool.slice();
  }

  // Jika queue habis, isi ulang dari candidates
  if (sambungQuestionQueue.length === 0) {
    sambungQuestionQueue = makeShuffle(candidates);
  }

  // Ambil soal dari depan queue
  let pick = sambungQuestionQueue.shift();

  // Jika soal ini ada di recent history (edge case pool kecil), coba ambil yang lain dari queue
  if (historySet.has(getKey(pick)) && sambungQuestionQueue.length > 0) {
    const alt = sambungQuestionQueue.find(p => !historySet.has(getKey(p)));
    if (alt) {
      sambungQuestionQueue = sambungQuestionQueue.filter(p => p !== alt);
      sambungQuestionQueue.unshift(pick); // kembalikan yang diambil
      pick = alt;
    }
  }

  // Catat di history, trim jika perlu
  sambungRecentHistory.push(getKey(pick));
  if (sambungRecentHistory.length > maxHistory) sambungRecentHistory.shift();

  sambungPromptSurah = pick.surahNum;
  sambungPromptAyahN = pick.ayahN;
  sambungTargetSurah = pick.surahNum;

  const data = SURAHS[sambungPromptSurah];
  const promptIdx = data.ayahs.findIndex(a => a.n === sambungPromptAyahN);
  const targetAyahObj = data.ayahs[promptIdx + 1];
  if (!targetAyahObj) { setTimeout(nextSambung, 100); return; }
  sambungTargetAyahN = targetAyahObj.n;

  document.getElementById('sambung-prompt-ar').textContent = data.ayahs[promptIdx].words.join(' ');
  document.getElementById('sambung-surah-info').textContent = `${data.name} • Ayat ${sambungPromptAyahN}`;

  setDotSambung('', '🔊 Sistem sedang membaca...');
  document.getElementById('sambungMicBtn').disabled = true;

  playSambungAudio(sambungPromptSurah, sambungPromptAyahN, () => {
    if (!sambungActive) return;
    document.getElementById('sambungMicBtn').disabled = false;
    sambungWaitingForUser = true;
    // Tidak auto on mic — user klik sendiri tombol mic
    setDotSambung('rec', '🎙 Tap mic untuk menjawab!');
  });
}

function playSambungAudio(surahNum, ayahNum, onDone) {
  if (sambungCurrentAudio) { sambungCurrentAudio.pause(); sambungCurrentAudio = null; }
  const audio = new Audio(getAudioUrl(surahNum, ayahNum));
  sambungCurrentAudio = audio;
  audio.onended = () => { sambungCurrentAudio = null; if (onDone) onDone(); };
  audio.onerror = () => {
    sambungCurrentAudio = null;
    setDotSambung('warn', '⚠️ Audio gagal — langsung jawab');
    if (onDone) onDone();
  };
  audio.play().catch(() => { if (onDone) onDone(); });
}

function replaySambungAudio() {
  if (!sambungActive) return;
  cancelSambungCountdown();
  stopSambungRec();
  sambungWaitingForUser = false;
  setDotSambung('', '🔊 Memutar ulang...');
  document.getElementById('sambungMicBtn').disabled = true;
  playSambungAudio(sambungPromptSurah, sambungPromptAyahN, () => {
    if (!sambungActive) return;
    sambungWaitingForUser = true;
    document.getElementById('sambungMicBtn').disabled = false;
    // Tidak auto on mic — user klik sendiri
    setDotSambung('rec', '🎙 Tap mic untuk menjawab!');
  });
}

function toggleSambungRec() {
  if (!sambungWaitingForUser) {
    showToast('Tunggu sistem selesai membaca dulu');
    return;
  }
  if (sambungRecRunning) {
    // User klik stop — langsung proses
    stopSambungRec();
    processSambungBuffer();
  } else {
    // User klik start — mulai mic
    startSambungRec();
    setDotSambung('rec', '🎙 Mendengarkan — baca ayat selanjutnya!');
  }
}

function startSambungRec() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { setDotSambung('warn', '❌ Gunakan Chrome'); return; }
  if (sambungRecRunning) return; // Jangan double-start

  // Reset buffer & processed index setiap sesi baru
  sambungBuffer = [];

  if (sambungRec) { try { sambungRec.abort(); } catch(e) {} sambungRec = null; }

  sambungRec = new SR();
  sambungRec.lang = 'ar-SA';
  // NON-continuous di mobile: hindari duplikasi hasil dari Chrome mobile
  sambungRec.continuous = false;
  sambungRec.interimResults = true;
  sambungRec.maxAlternatives = 1;

  let sessionHasFinal = false; // track apakah sesi ini sudah dapat final

  sambungRec.onresult = (e) => {
    if (!sambungWaitingForUser) return;
    let finalText = '', interimText = '';
    for (let i = 0; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
      else interimText += e.results[i][0].transcript;
    }

    const capRow = document.getElementById('sambung-captured-row');
    const capAr  = document.getElementById('sambung-captured-ar');

    if (interimText && !sessionHasFinal) {
      // Tampilkan interim di captured box (warna oranye)
      if (capRow && capAr) {
        capRow.style.display = 'block';
        capAr.textContent = interimText + ' ⏳';
        capAr.style.color = 'var(--muted2)';
      }
    }

    if (finalText.trim() && !sessionHasFinal) {
      sessionHasFinal = true;
      sambungBuffer.push(finalText.trim());
      // Tampilkan final di captured box (warna hijau)
      if (capRow && capAr) {
        capRow.style.display = 'block';
        capAr.textContent = finalText.trim();
        capAr.style.color = 'var(--muted)';
      }
      clearTimeout(sambungSilenceTimeout);
      // Jeda 20ms sebelum proses feedback
      sambungSilenceTimeout = setTimeout(processSambungBuffer, 20);
    }
  };

  sambungRec.onend = () => {
    sambungRecRunning = false;
    const _mic=document.getElementById('sambungMicBtn');_mic.classList.remove('live');_mic.setAttribute('aria-pressed','false');_mic.setAttribute('aria-label','Mulai rekam jawaban');
    // Hanya restart jika masih menunggu final (belum dapat hasil sama sekali)
    // Tapi TIDAK restart setelah dapat final — user harus klik manual untuk soal berikutnya
    if (sambungActive && sambungWaitingForUser && !sessionHasFinal && !sambungSilenceTimeout) {
      // Tidak auto restart — beri status agar user tahu perlu tap lagi
      setDotSambung('rec', '🎙 Tap mic untuk mencoba lagi');
    }
  };

  sambungRec.onerror = (e) => {
    sambungRecRunning = false;
    const _mic=document.getElementById('sambungMicBtn');_mic.classList.remove('live');_mic.setAttribute('aria-pressed','false');_mic.setAttribute('aria-label','Mulai rekam jawaban');
    if (e.error === 'not-allowed') { showToast('❌ Izinkan mikrofon'); stopSambungMode(); }
    else if (e.error === 'no-speech') {
      setDotSambung('rec', '🎙 Tidak terdengar — tap mic untuk coba lagi');
    } else if (e.error === 'aborted') {
      // Normal abort, tidak perlu pesan
    }
  };

  try {
    sambungRec.start();
    sambungRecRunning = true;
    const micBtn = document.getElementById('sambungMicBtn');
    micBtn.classList.add('live');
    micBtn.setAttribute('aria-pressed', 'true');
    micBtn.setAttribute('aria-label', 'Hentikan rekam jawaban');
  } catch(e) { setDotSambung('warn', '❌ Gagal mulai mic'); }
}

function stopSambungRec() {
  if (sambungRec) { try { sambungRec.abort(); } catch(e) {} sambungRec = null; }
  sambungRecRunning = false;
  clearTimeout(sambungSilenceTimeout);
  sambungSilenceTimeout = null;
  const micBtn = document.getElementById('sambungMicBtn');
  micBtn.classList.remove('live');
  micBtn.setAttribute('aria-pressed', 'false');
  micBtn.setAttribute('aria-label', 'Mulai rekam jawaban');
}

function processSambungBuffer() {
  clearTimeout(sambungSilenceTimeout);
  sambungSilenceTimeout = null;
  if (!sambungWaitingForUser) return; // guard double-call
  stopSambungRec();
  sambungWaitingForUser = false;
  if (!sambungActive) return;

  const spokenRaw = sambungBuffer.join(' ').trim();
  sambungBuffer = [];

  if (!spokenRaw) {
    setDotSambung('warn', '⚠️ Tidak ada bacaan terdeteksi');
    // Tidak auto restart — user tap mic sendiri
    sambungWaitingForUser = true;
    setDotSambung('rec', '🎙 Tap mic untuk coba lagi');
    return;
  }

  const data = SURAHS[sambungTargetSurah];
  const targetAyah = data?.ayahs.find(a => a.n === sambungTargetAyahN);
  if (!targetAyah) return;

  const result = validateSambung(spokenRaw, targetAyah.words);
  showSambungResult(result, targetAyah.words);
}

function validateSambung(spokenRaw, refWords) {
  const spokenTokens = spokenRaw.trim().split(/\s+/).filter(Boolean);
  if (!spokenTokens.length) return { ok: false, score: 0, detail: 'Tidak ada bacaan' };

  const WORD_THRESHOLD = 0.58;
  const BIGRAM_THRESHOLD = 0.62;
  const refNorms = refWords.map(w => normalizeArabic(w));

  let bestScore = 0, bestMatched = 0;
  const maxStartOffset = Math.min(3, spokenTokens.length - 1);

  for (let startOffset = 0; startOffset <= maxStartOffset; startOffset++) {
    let matched = 0, si = startOffset;
    for (let wi = 0; wi < refNorms.length && si < spokenTokens.length; wi++) {
      if (wi + 1 < refNorms.length) {
        const bg = refNorms[wi] + refNorms[wi + 1];
        const bgScores = [simNorm(normalizeArabic(spokenTokens[si]), bg), ...spokenCandidates(spokenTokens[si]).map(c => simNorm(c, bg))];
        if (Math.max(...bgScores) >= BIGRAM_THRESHOLD) { matched += 2; si++; wi++; continue; }
      }
      const ws = wordSim(spokenTokens[si], refNorms[wi]);
      if (ws >= WORD_THRESHOLD) { matched++; si++; }
      else {
        if (wi + 1 < refNorms.length) { const wsN = wordSim(spokenTokens[si], refNorms[wi+1]); if (wsN >= WORD_THRESHOLD) { matched += 1; wi++; matched++; si++; continue; } }
        if (si + 1 < spokenTokens.length) { const wsS = wordSim(spokenTokens[si+1], refNorms[wi]); if (wsS >= WORD_THRESHOLD) { matched++; si += 2; continue; } }
        if (matched > 0) continue; break;
      }
    }
    const score = matched / refNorms.length;
    if (score > bestScore) { bestScore = score; bestMatched = matched; }
  }

  const minPct = refWords.length <= 2 ? 0.80 : refWords.length <= 4 ? 0.65 : refWords.length <= 7 ? 0.50 : 0.40;
  return { ok: bestScore >= minPct, score: bestScore, matched: bestMatched, total: refWords.length, detail: `${bestMatched}/${refWords.length} kata cocok` };
}

function showSambungResult(result, refWords) {
  const resultEl = document.getElementById('sambung-result-ar');

  if (result.ok) {
    sambungScoreOk++;
    document.getElementById('sambung-score-ok').textContent = sambungScoreOk;
    if (resultEl) { resultEl.style.display = 'block'; resultEl.textContent = refWords.join(' '); resultEl.className = 'sambung-result-ar correct'; }
    setDotSambung('ok', '✅ Masyaa Allah! ' + result.detail);
    playCorrectSound();
    const nextBtn = document.getElementById('sambung-next-btn');
    if (nextBtn) nextBtn.style.display = 'flex';
  } else {
    sambungScoreErr++;
    document.getElementById('sambung-score-err').textContent = sambungScoreErr;
    if (resultEl) { resultEl.style.display = 'block'; resultEl.textContent = 'Jawaban: ' + refWords.join(' '); resultEl.className = 'sambung-result-ar wrong'; }
    setDotSambung('warn', '❌ Kurang tepat — ' + result.detail);
    playWrongSound();
    setTimeout(() => {
      if (!sambungActive) return;
      sambungWaitingForUser = true;
      setDotSambung('rec', '🎙 Tap mic untuk coba lagi!');
    }, 1200);
  }
}

function startSambungCountdown(seconds) {
  clearTimeout(sambungCountdownTimer);
  const nextBtn = document.getElementById('sambung-next-btn');
  if (nextBtn) nextBtn.style.display = 'flex';
  setDotSambung('ok', `✅ Lanjut dalam ${seconds}...`);
  let remaining = seconds;
  function tick() {
    remaining--;
    if (remaining <= 0) { nextSambung(); }
    else { setDotSambung('ok', `✅ Lanjut dalam ${remaining}...`); sambungCountdownTimer = setTimeout(tick, 1000); }
  }
  sambungCountdownTimer = setTimeout(tick, 1000);
}

function cancelSambungCountdown() { clearTimeout(sambungCountdownTimer); }

function stopSambungMode() {
  sambungActive = false; sambungWaitingForUser = false;
  stopSambungRec();
  if (sambungCurrentAudio) { sambungCurrentAudio.pause(); sambungCurrentAudio = null; }
  const g = id => document.getElementById(id);
  if (g('sambung-prompt-card')) g('sambung-prompt-card').style.display = 'none';
  if (g('sambung-controls')) g('sambung-controls').style.display = 'none';
  if (g('sambung-score-chips')) g('sambung-score-chips').style.display = 'none';
  if (g('sambung-start-btn')) { g('sambung-start-btn').style.display = 'flex'; g('sambung-start-btn').disabled = false; g('sambung-start-btn').textContent = 'Mulai Sambung Ayat'; }
  if (g('sambung-surah-row')) g('sambung-surah-row').style.display = 'block';
  if (g('sambung-result-ar')) { g('sambung-result-ar').style.display = 'none'; g('sambung-result-ar').textContent = '—'; g('sambung-result-ar').className = 'sambung-result-ar'; }
  if (g('sambung-next-btn')) g('sambung-next-btn').style.display = 'none';
  if (g('sambung-hint-box')) g('sambung-hint-box').style.display = 'none';
  // Reset captured box
  if (g('sambung-captured-row')) g('sambung-captured-row').style.display = 'none';
  if (g('sambung-captured-ar')) { g('sambung-captured-ar').textContent = '—'; g('sambung-captured-ar').style.color = 'var(--muted2)'; }
  setDotSambung('', 'Selesai');
}
function stopSambung() { stopSambungMode(); }
function stopSambungNew() { stopSambungMode(); }
function nextSambungNew() { nextSambung(); }
function skipSambung() { if (sambungActive) nextSambung(); }

function showSambungHint() {
  if (!sambungActive) return;
  const data = SURAHS[sambungTargetSurah];
  const targetAyah = data?.ayahs.find(a => a.n === sambungTargetAyahN);
  if (!targetAyah || !targetAyah.words.length) return;
  const hintWords = targetAyah.words.slice(0, 2).join(' ');
  const box = document.getElementById('sambung-hint-box');
  const txt = document.getElementById('sambung-hint-text');
  if (txt) txt.textContent = hintWords + '...';
  if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function setDotSambung(state, text) {
  const dot = document.getElementById('sambung-dot');
  const txt = document.getElementById('sambung-status-text');
  if (!dot || !txt) return;
  dot.className = 'status-dot' + (state === 'rec' ? ' rec' : state === 'ok' ? ' ok' : '');
  txt.textContent = text;
}


// ════════════════════════════════════════════════════════════
//  MODE BACA / UJI
// ════════════════════════════════════════════════════════════
let murojaahMode = 'uji'; // 'baca' or 'uji'

function setMurojaahMode(mode) {
  murojaahMode = mode;
  const mushaf = document.getElementById('mushafBody');
  const bacaBtn = document.getElementById('mode-baca-btn');
  const ujiBtn = document.getElementById('mode-uji-btn');
  const controls = document.getElementById('hafalan-controls');
  const ctxText = document.getElementById('mode-context-text');

  if (mode === 'uji') {
    mushaf.classList.add('mode-uji');
    ujiBtn.classList.add('active');
    bacaBtn.classList.remove('active');
    controls.style.display = '';
    if (ctxText) ctxText.textContent = 'Yuk ulang hafalan kamu dengan klik tombol mic di bawah.';
    if (currentPage === 'hafalan') showToast('Mode Murojaah — tap kata untuk mengintip');
    trackDailyActivity('murojaah');
  } else {
    mushaf.classList.remove('mode-uji');
    bacaBtn.classList.add('active');
    ujiBtn.classList.remove('active');
    controls.style.display = 'none';
    if (ctxText) ctxText.textContent = 'Saat ini kamu dalam mode baca Al-Quran. Pindah ke Mode Murojaah untuk cek hafalanmu.';
    if (sessionActive) stopSession();
    mushaf.querySelectorAll('.w.revealed, .w.revealing').forEach(w => {
      w.classList.remove('revealed', 'revealing');
    });
  }
}

// Touch/click to reveal words in Mode Uji
document.addEventListener('click', (e) => {
  if (murojaahMode !== 'uji') return;
  const w = e.target.closest('.w');
  if (!w) return;
  const mushaf = document.getElementById('mushafBody');
  if (!mushaf.classList.contains('mode-uji')) return;

  // Only reveal idle/cursor words
  if (w.classList.contains('idle') || w.classList.contains('cursor')) {
    w.classList.add('revealing');
    w.classList.add('revealed');
    // Auto-hide after 2 seconds
    setTimeout(() => {
      if (murojaahMode === 'uji') {
        w.classList.remove('revealed', 'revealing');
      }
    }, 2500);
  }
});

// Reveal whole ayah on ayah-number click
document.addEventListener('click', (e) => {
  if (murojaahMode !== 'uji') return;
  const ayahNum = e.target.closest('.ayah-number');
  if (!ayahNum) return;
  const row = ayahNum.closest('.ayah-row');
  if (!row) return;
  const words = row.querySelectorAll('.w');
  words.forEach(w => {
    if (w.classList.contains('idle') || w.classList.contains('cursor')) {
      w.classList.add('revealing', 'revealed');
    }
  });
  // Auto-hide after 4 seconds
  setTimeout(() => {
    if (murojaahMode === 'uji') {
      words.forEach(w => w.classList.remove('revealed', 'revealing'));
    }
  }, 4000);
});

// ════════════════════════════════════════════════════════════
//  SETORAN FROM MUROJAAH
// ════════════════════════════════════════════════════════════
let miniRecorder = null;
let miniAudioChunks = [];
let miniRecordingInterval = null;
let miniRecordingSeconds = 0;
let miniAudioBlob = null;
let miniIsRecording = false;
let setoranModeActive = false;

function toggleSetoranMode() {
  const cb = document.getElementById('setoran-toggle-cb');
  setoranModeActive = cb.checked;
  const recArea = document.getElementById('setoran-rec-area');
  recArea.style.display = setoranModeActive ? 'block' : 'none';
}

async function toggleMiniRecording() {
  if (miniIsRecording) {
    stopMiniRecording();
  } else {
    await startMiniRecording();
  }
}

async function startMiniRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    miniAudioChunks = [];
    miniRecorder = new MediaRecorder(stream);
    miniRecorder.ondataavailable = e => { if (e.data.size > 0) miniAudioChunks.push(e.data); };
    miniRecorder.onstop = () => {
      miniAudioBlob = new Blob(miniAudioChunks, { type: 'audio/webm' });
      onMiniRecordingDone();
      stream.getTracks().forEach(t => t.stop());
    };
    miniRecorder.start();
    miniIsRecording = true;
    miniRecordingSeconds = 0;

    const btn = document.getElementById('rec-mini-btn');
    btn.classList.add('recording');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    document.getElementById('rec-mini-label').textContent = 'Merekam...';
    document.getElementById('rec-mini-timer').style.display = 'block';

    miniRecordingInterval = setInterval(() => {
      miniRecordingSeconds++;
      const m = Math.floor(miniRecordingSeconds / 60), s = miniRecordingSeconds % 60;
      document.getElementById('rec-mini-timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
  } catch (e) {
    showToast('❌ Izinkan akses mikrofon');
  }
}

function stopMiniRecording() {
  if (miniRecorder && miniRecorder.state !== 'inactive') miniRecorder.stop();
  clearInterval(miniRecordingInterval);
  miniIsRecording = false;
  const btn = document.getElementById('rec-mini-btn');
  btn.classList.remove('recording');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>';
}

function onMiniRecordingDone() {
  const btn = document.getElementById('rec-mini-btn');
  btn.classList.add('done');
  document.getElementById('rec-mini-label').textContent = `Rekaman selesai · ${miniRecordingSeconds}s`;
  document.getElementById('btn-simpan-mini').classList.add('show');
}

async function simpanSetoranFromMurojaah() {
  if (!miniAudioBlob) { showToast('❌ Rekam audio dulu'); return; }
  const surahSel = document.getElementById('hafalanSurahSel');
  const surahNum = parseInt(surahSel.value);
  const surahName = surahSel.options[surahSel.selectedIndex].text;
  const startAyat = parseInt(document.getElementById('hafalanAyatSel').value) || 1;
  const surah = SURAHS[surahNum];
  const endAyat = surah ? surah.ayahs[surah.ayahs.length - 1].n : startAyat;
  const today = new Date().toISOString().split('T')[0];

  const btn = document.getElementById('btn-simpan-mini');
  btn.textContent = 'Menyimpan...';
  btn.disabled = true;

  let audioUrl = null;

  if (sbClient && currentUser) {
    try {
      const fileName = `${currentUser.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadErr } = await sbClient.storage.from('setoran-audio').upload(fileName, miniAudioBlob, { contentType: 'audio/webm' });
      if (!uploadErr) {
        const { data: urlData } = sbClient.storage.from('setoran-audio').getPublicUrl(fileName);
        audioUrl = urlData?.publicUrl;
      }
      await sbClient.from('setoran').insert({
        user_id: currentUser.id,
        surah_num: surahNum,
        surah_name: surahName,
        ayat_dari: startAyat,
        ayat_ke: endAyat,
        audio_url: audioUrl,
        duration: miniRecordingSeconds,
        date: today
      });
      showToast('✅ Setoran berhasil disimpan!');
      resetMiniRecording();
      refreshBeranda();
    } catch (e) {
      console.error('simpanSetoranFromMurojaah:', e);
      showToast('❌ Gagal menyimpan, coba lagi');
    }
  } else {
    // Local save
    const localData = JSON.parse(localStorage.getItem('murajaah_setoran') || '[]');
    localData.unshift({
      id: Date.now(),
      surah_num: surahNum,
      surah_name: surahName,
      ayat_dari: startAyat,
      ayat_ke: endAyat,
      duration: miniRecordingSeconds,
      date: today,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('murajaah_setoran', JSON.stringify(localData));
    showToast('✅ Setoran disimpan (lokal)');
    resetMiniRecording();
    refreshBeranda();
  }

  btn.disabled = false;
}

function resetMiniRecording() {
  miniAudioBlob = null;
  miniIsRecording = false;
  miniRecordingSeconds = 0;
  const btn = document.getElementById('rec-mini-btn');
  if (btn) {
    btn.classList.remove('recording', 'done');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>';
  }
  const lbl = document.getElementById('rec-mini-label');
  if (lbl) lbl.textContent = 'Tap untuk rekam';
  const timer = document.getElementById('rec-mini-timer');
  if (timer) { timer.style.display = 'none'; timer.textContent = '00:00'; }
  const simpanBtn = document.getElementById('btn-simpan-mini');
  if (simpanBtn) { simpanBtn.classList.remove('show'); simpanBtn.textContent = 'Simpan'; }
}

// ════════════════════════════════════════════════════════════
//  HAFALAN SAYA — Tracking per-ayat with recording proof
// ════════════════════════════════════════════════════════════
/*
  Data structure (localStorage key: 'murajaah_hafalanku'):
  [
    {
      surahNum: 114,
      checkedAyahs: [1,2,3,5],
      recordings: [
        { from: 1, to: 5, duration: 32, date: '2026-03-30', audioUrl: 'blob:...' or null }
      ],
      addedAt: '2026-03-30'
    }
  ]
*/

function getHafalankuData() {
  let data = JSON.parse(localStorage.getItem('murajaah_hafalanku') || '[]');
  // Sanitize — ensure all entries have proper structure
  let needsSave = false;
  data = data.filter(entry => {
    if (!entry || !entry.surahNum) return false;
    if (!Array.isArray(entry.checkedAyahs)) { entry.checkedAyahs = []; needsSave = true; }
    if (!Array.isArray(entry.recordings)) { entry.recordings = []; needsSave = true; }
    if (!entry.addedAt) { entry.addedAt = new Date().toISOString().split('T')[0]; needsSave = true; }
    return true;
  });
  if (needsSave) localStorage.setItem('murajaah_hafalanku', JSON.stringify(data));
  return data;
}
function saveHafalankuData(data) {
  localStorage.setItem('murajaah_hafalanku', JSON.stringify(data));
  // Auto-sync to cloud if logged in
  syncHafalankuToCloud(data);
}

// ════════════════════════════════════════════════════════════
//  HAFALANKU CLOUD SYNC (Supabase)
// ════════════════════════════════════════════════════════════
let _hafalankuSyncTimeout = null;

async function syncHafalankuToCloud(data) {
  if (!sbClient || !currentUser) return;
  // Debounce — wait 1s before syncing to avoid rapid writes
  clearTimeout(_hafalankuSyncTimeout);
  _hafalankuSyncTimeout = setTimeout(async () => {
    try {
      // Clean data for cloud — remove blob URLs from recordings (not transferable)
      const cleanData = (data || []).map(entry => ({
        ...entry,
        recordings: (entry.recordings || []).map(r => ({
          ...r,
          audioUrl: r.audioUrl && r.audioUrl.startsWith('blob:') ? null : r.audioUrl
        }))
      }));
      const { error } = await sbClient.from('hafalanku').upsert({
        user_id: currentUser.id,
        data: JSON.stringify(cleanData),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) {
        // Table might not exist yet — silently fail, data is still in localStorage
        console.warn('Hafalanku sync error:', error.message);
      }
    } catch (e) {
      console.warn('Hafalanku sync failed:', e);
    }
  }, 1000);
}

async function loadHafalankuFromCloud() {
  if (!sbClient || !currentUser) return false;
  try {
    const { data, error } = await sbClient.from('hafalanku')
      .select('data')
      .eq('user_id', currentUser.id)
      .single();
    if (error) {
      // No data found or table doesn't exist
      console.warn('Hafalanku load error:', error.message);
      return false;
    }
    if (data && data.data) {
      const cloudData = JSON.parse(data.data);
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        // Cloud data fully replaces local — no merge with guest data
        localStorage.setItem('murajaah_hafalanku', JSON.stringify(cloudData));
        return true;
      }
    }
    return false;
  } catch (e) {
    console.warn('Hafalanku cloud load failed:', e);
    return false;
  }
}

function addHafalanSurah() {
  const sel = document.getElementById('hk-add-surah-sel');
  const surahNum = parseInt(sel.value);
  if (!surahNum) return;

  const data = getHafalankuData();
  if (data.find(d => d.surahNum === surahNum)) {
    showToast('Surah ini sudah ada di daftar hafalan');
    return;
  }

  // Check if user is logged in — if not, show login prompt
  if (!currentUser) {
    // Store the pending surah to add after user decides
    window._pendingHafalanSurah = surahNum;
    document.getElementById('hk-login-modal').classList.add('open');
    return;
  }

  // Proceed directly
  doAddHafalanSurah(surahNum);
}

function doAddHafalanSurah(surahNum) {
  const data = getHafalankuData();
  if (data.find(d => d.surahNum === surahNum)) return; // double-check

  data.push({
    surahNum,
    checkedAyahs: [],
    recordings: [],
    addedAt: new Date().toISOString().split('T')[0]
  });
  saveHafalankuData(data);
  renderHafalankuList();
  renderHafalankuBeranda();
  showToast('✅ Surah ditambahkan!');
}

function closeHkLoginModal(e) {
  if (e && e.target && e.target !== document.getElementById('hk-login-modal')) return;
  document.getElementById('hk-login-modal').classList.remove('open');
}

function proceedAddHafalanWithoutLogin() {
  const surahNum = window._pendingHafalanSurah;
  window._pendingHafalanSurah = null;
  if (surahNum) {
    doAddHafalanSurah(surahNum);
  }
}

function removeHafalanSurah(surahNum) {
  if (!confirm('Hapus surah ini dari daftar hafalan?')) return;
  let data = getHafalankuData();
  data = data.filter(d => d.surahNum !== surahNum);
  saveHafalankuData(data);
  renderHafalankuList();
  renderHafalankuBeranda();
  showToast('Surah dihapus');
}

function toggleHafalankuExpand(surahNum) {
  const grid = document.getElementById('hk-grid-' + surahNum);
  if (grid) grid.classList.toggle('open');
}

function toggleAyatScroll(gridId) {
  const wrap = document.getElementById(gridId);
  const btn = document.getElementById(gridId + '-btn');
  const label = document.getElementById(gridId + '-label');
  if (!wrap) return;
  const isCollapsed = wrap.classList.contains('collapsed');
  if (isCollapsed) {
    wrap.classList.remove('collapsed');
    wrap.classList.add('expanded');
    btn.classList.add('expanded');
    if (label) label.textContent = 'Sembunyikan';
  } else {
    wrap.classList.remove('expanded');
    wrap.classList.add('collapsed');
    btn.classList.remove('expanded');
    if (label) label.textContent = 'Tampilkan semua ayat';
  }
}

// ── Recording modal state ──
let hkRecState = {
  surahNum: 0, from: 1, to: 5,
  recorder: null, chunks: [], blob: null, objectUrl: null,
  isRecording: false, seconds: 0, interval: null,
  playback: null
};

function openHkRecModal(surahNum) {
  const meta = JUZ_SURAHS[surahNum] || SURAHS[surahNum];
  const name = meta ? meta.name : 'Surah ' + surahNum;
  const totalAyahs = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 1;
  const data = getHafalankuData();
  const entry = data.find(d => d.surahNum === surahNum);
  // Find first unchecked ayah as start suggestion
  let suggestFrom = 1;
  if (entry && entry.checkedAyahs.length > 0) {
    const sorted = [...entry.checkedAyahs].sort((a,b) => a - b);
    suggestFrom = sorted[sorted.length - 1] + 1;
    if (suggestFrom > totalAyahs) suggestFrom = 1;
  }
  const suggestTo = Math.min(suggestFrom + 4, totalAyahs);

  hkRecState.surahNum = surahNum;
  hkRecState.from = suggestFrom;
  hkRecState.to = suggestTo;
  hkRecState.blob = null;
  hkRecState.objectUrl = null;
  hkRecState.isRecording = false;
  hkRecState.seconds = 0;

  document.getElementById('hk-rec-modal-title').textContent = `Setor Hafalan · ${name}`;
  document.getElementById('hk-rec-range-label').textContent = `Ayat ${suggestFrom} – ${suggestTo}`;
  document.getElementById('hk-rec-label').textContent = 'Tap untuk rekam';
  document.getElementById('hk-rec-timer').style.display = 'none';
  document.getElementById('hk-rec-player').classList.remove('show');
  document.getElementById('hk-rec-save-btn').style.display = 'none';
  const _retryBtn = document.getElementById('hk-rec-retry-btn');
  if (_retryBtn) _retryBtn.style.display = 'none';
  const btn = document.getElementById('hk-rec-btn');
  btn.classList.remove('recording', 'done');
  btn.onclick = toggleHkRecording;
  btn.title = '';
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';

  // Render range inputs inside the modal content
  const content = document.getElementById('hk-rec-modal-content');
  // Check if range row already exists, if not create
  let rangeRow = document.getElementById('hk-rec-range-row');
  if (!rangeRow) {
    rangeRow = document.createElement('div');
    rangeRow.id = 'hk-rec-range-row';
    rangeRow.className = 'hk-range-row hk-range-row-highlight';
    rangeRow.innerHTML = `
      <span class="field-label hk-range-label">AYAT</span>
      <input class="hk-range-input hk-range-input-lg" type="number" id="hk-rec-from" min="1" max="${totalAyahs}" value="${suggestFrom}" onchange="updateHkRangeLabel()" onfocus="this.select()">
      <span class="hk-range-sep">–</span>
      <input class="hk-range-input hk-range-input-lg" type="number" id="hk-rec-to" min="1" max="${totalAyahs}" value="${suggestTo}" onchange="updateHkRangeLabel()" onfocus="this.select()">
      <span class="hk-range-total">/ ${totalAyahs}</span>
    `;
    content.insertBefore(rangeRow, content.children[0]);
  } else {
    document.getElementById('hk-rec-from').max = totalAyahs;
    document.getElementById('hk-rec-from').value = suggestFrom;
    document.getElementById('hk-rec-to').max = totalAyahs;
    document.getElementById('hk-rec-to').value = suggestTo;
    rangeRow.querySelector('.hk-range-total').textContent = '/ ' + totalAyahs;
    // Restart pulse animation so the ayat row catches the user's eye on every open
    rangeRow.classList.remove('hk-range-row-highlight');
    void rangeRow.offsetWidth;
    rangeRow.classList.add('hk-range-row-highlight');
  }

  const modal = document.getElementById('hk-rec-modal');
  modal.classList.add('open');
}

function updateHkRangeLabel() {
  const from = parseInt(document.getElementById('hk-rec-from').value) || 1;
  const to = parseInt(document.getElementById('hk-rec-to').value) || from;
  hkRecState.from = from;
  hkRecState.to = Math.max(from, to);
  document.getElementById('hk-rec-range-label').textContent = `Ayat ${hkRecState.from} – ${hkRecState.to}`;
}

function closeHkRecModal(e) {
  if (e && e.target && e.target !== document.getElementById('hk-rec-modal')) return;
  if (hkRecState.isRecording) stopHkRec();
  if (hkRecState.playback) { hkRecState.playback.pause(); hkRecState.playback = null; }
  document.getElementById('hk-rec-modal').classList.remove('open');
}

async function toggleHkRecording() {
  if (hkRecState.isRecording) {
    stopHkRec();
  } else {
    await startHkRec();
  }
}

async function startHkRec() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    hkRecState.chunks = [];
    hkRecState.recorder = new MediaRecorder(stream);
    hkRecState.recorder.ondataavailable = e => { if (e.data.size > 0) hkRecState.chunks.push(e.data); };
    hkRecState.recorder.onstop = () => {
      hkRecState.blob = new Blob(hkRecState.chunks, { type: 'audio/webm' });
      if (hkRecState.objectUrl) URL.revokeObjectURL(hkRecState.objectUrl);
      hkRecState.objectUrl = URL.createObjectURL(hkRecState.blob);
      onHkRecDone();
      stream.getTracks().forEach(t => t.stop());
    };
    hkRecState.recorder.start();
    hkRecState.isRecording = true;
    hkRecState.seconds = 0;

    const btn = document.getElementById('hk-rec-btn');
    btn.classList.add('recording');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    document.getElementById('hk-rec-label').textContent = 'Merekam... tap untuk stop';
    document.getElementById('hk-rec-timer').style.display = 'block';
    document.getElementById('hk-rec-save-btn').style.display = 'none';
    document.getElementById('hk-rec-player').classList.remove('show');

    hkRecState.interval = setInterval(() => {
      hkRecState.seconds++;
      const m = Math.floor(hkRecState.seconds / 60), s = hkRecState.seconds % 60;
      document.getElementById('hk-rec-timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
  } catch (e) {
    showToast('❌ Izinkan akses mikrofon');
  }
}

function stopHkRec() {
  if (hkRecState.recorder && hkRecState.recorder.state !== 'inactive') hkRecState.recorder.stop();
  clearInterval(hkRecState.interval);
  hkRecState.isRecording = false;
  const btn = document.getElementById('hk-rec-btn');
  btn.classList.remove('recording');
}

function onHkRecDone() {
  const btn = document.getElementById('hk-rec-btn');
  btn.classList.add('done');
  btn.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;line-height:1"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg><span style="font-size:9px;font-weight:700;letter-spacing:0.5px">ULANGI</span></div>';
  btn.onclick = resetHkRecording;
  btn.title = 'Ulangi rekaman';
  document.getElementById('hk-rec-label').textContent = `Rekaman selesai · ${hkRecState.seconds}s`;
  document.getElementById('hk-rec-duration').textContent = hkRecState.seconds + 's';
  document.getElementById('hk-rec-player').classList.add('show');
  document.getElementById('hk-rec-save-btn').style.display = 'flex';

  // Inject "Ulangi Rekaman" button if not present
  let retryBtn = document.getElementById('hk-rec-retry-btn');
  if (!retryBtn) {
    retryBtn = document.createElement('button');
    retryBtn.id = 'hk-rec-retry-btn';
    retryBtn.type = 'button';
    retryBtn.className = 'btn-secondary';
    retryBtn.style.cssText = 'margin-top:8px;display:flex;align-items:center;justify-content:center;gap:6px';
    retryBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Ulangi Rekaman';
    retryBtn.onclick = resetHkRecording;
    const saveBtn = document.getElementById('hk-rec-save-btn');
    saveBtn.parentNode.insertBefore(retryBtn, saveBtn.nextSibling);
  }
  retryBtn.style.display = "none";
}

function resetHkRecording() {
  // Stop any playback
  if (hkRecState.playback) { try { hkRecState.playback.pause(); } catch(e){} hkRecState.playback = null; }
  if (hkRecState.objectUrl) { URL.revokeObjectURL(hkRecState.objectUrl); }
  hkRecState.blob = null;
  hkRecState.objectUrl = null;
  hkRecState.seconds = 0;
  hkRecState.isRecording = false;

  // Reset UI back to "tap to record" state
  const btn = document.getElementById('hk-rec-btn');
  btn.classList.remove('recording', 'done');
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
  btn.onclick = toggleHkRecording;
  btn.title = '';
  // Auto-start recording immediately so user doesn't need extra tap
  setTimeout(() => toggleHkRecording(), 50);
  document.getElementById('hk-rec-label').textContent = 'Tap untuk rekam';
  const timerEl = document.getElementById('hk-rec-timer');
  timerEl.style.display = 'none';
  timerEl.textContent = '00:00';
  document.getElementById('hk-rec-player').classList.remove('show');
  document.getElementById('hk-rec-save-btn').style.display = 'none';
  const retryBtn = document.getElementById('hk-rec-retry-btn');
  if (retryBtn) retryBtn.style.display = 'none';
  // Reset play button icon to play state
  const playBtn = document.getElementById('hk-rec-play-btn');
  if (playBtn) playBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
}

function toggleHkPlayback() {
  if (!hkRecState.objectUrl) return;
  const btn = document.getElementById('hk-rec-play-btn');
  if (hkRecState.playback && !hkRecState.playback.paused) {
    hkRecState.playback.pause();
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  } else {
    if (!hkRecState.playback) {
      hkRecState.playback = new Audio(hkRecState.objectUrl);
      hkRecState.playback.onended = () => {
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      };
    }
    hkRecState.playback.play();
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
  }
}

async function saveHkRecording() {
  if (!hkRecState.blob) { showToast('❌ Rekam audio dulu'); return; }
  const from = parseInt(document.getElementById('hk-rec-from').value) || hkRecState.from;
  const to = parseInt(document.getElementById('hk-rec-to').value) || hkRecState.to;
  const surahNum = hkRecState.surahNum;

  const data = getHafalankuData();
  const entry = data.find(d => d.surahNum === surahNum);
  if (!entry) return;

  // Upload audio to Supabase Storage if logged in
  let audioUrl = hkRecState.objectUrl || null;
  if (sbClient && currentUser && hkRecState.blob) {
    try {
      const fileName = `${currentUser.id}/hk_${surahNum}_${Date.now()}.webm`;
      const { data: uploadData, error: uploadErr } = await sbClient.storage
        .from('setoran-audio')
        .upload(fileName, hkRecState.blob, { contentType: 'audio/webm' });
      if (!uploadErr && uploadData) {
        const { data: urlData } = sbClient.storage.from('setoran-audio').getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          audioUrl = urlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn('Hafalan audio upload failed:', e);
      // Fall back to blob URL (won't persist but at least works this session)
    }
  }

  // Check ayahs in range
  for (let i = from; i <= to; i++) {
    if (!entry.checkedAyahs.includes(i)) entry.checkedAyahs.push(i);
  }
  entry.checkedAyahs.sort((a, b) => a - b);

  // Save recording metadata
  if (!entry.recordings) entry.recordings = [];
  entry.recordings.push({
    from, to,
    duration: hkRecState.seconds,
    date: new Date().toISOString().split('T')[0],
    audioUrl: audioUrl
  });

  saveHafalankuData(data);
  renderHafalankuList();
  renderHafalankuBeranda();
  trackDailyActivity('hafalan');

  // Close modal
  document.getElementById('hk-rec-modal').classList.remove('open');
  showToast(`✅ Ayat ${from}–${to} tercatat & rekaman tersimpan!`);
  playCorrectSound();
}

// Play archived recording
let _hkArchiveAudio = null;
let _hkArchivePlaying = null; // track which button is currently playing: {surahNum, recIdx}

function playHkArchive(surahNum, recIdx) {
  const data = getHafalankuData();
  const entry = data.find(d => d.surahNum === surahNum);
  if (!entry || !entry.recordings[recIdx]) return;
  const rec = entry.recordings[recIdx];
  const btnId = `hk-play-${surahNum}-${recIdx}`;
  const btn = document.getElementById(btnId);

  // If same recording is playing → pause it
  if (_hkArchiveAudio && _hkArchivePlaying &&
      _hkArchivePlaying.surahNum === surahNum && _hkArchivePlaying.recIdx === recIdx) {
    if (!_hkArchiveAudio.paused) {
      _hkArchiveAudio.pause();
      if (btn) btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      return;
    } else {
      // Resume
      _hkArchiveAudio.play().catch(() => showToast('Gagal memutar audio'));
      if (btn) btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';
      return;
    }
  }

  // Stop previous if different
  if (_hkArchiveAudio) {
    _hkArchiveAudio.pause();
    _hkArchiveAudio = null;
    // Reset previous button icon
    if (_hkArchivePlaying) {
      const prevBtn = document.getElementById(`hk-play-${_hkArchivePlaying.surahNum}-${_hkArchivePlaying.recIdx}`);
      if (prevBtn) prevBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
  }

  if (!rec.audioUrl) { showToast('Audio tidak tersedia'); return; }

  _hkArchiveAudio = new Audio(rec.audioUrl);
  _hkArchivePlaying = { surahNum, recIdx };

  // Change icon to pause
  if (btn) btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';

  _hkArchiveAudio.onended = () => {
    // Reset icon back to play when finished
    if (btn) btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    _hkArchivePlaying = null;
    _hkArchiveAudio = null;
  };

  _hkArchiveAudio.play().catch(() => {
    showToast('Gagal memutar audio');
    if (btn) btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    _hkArchivePlaying = null;
  });
}

// ── Render ──

function renderHafalankuList() {
  const data = getHafalankuData();
  const container = document.getElementById('hafalanku-list');

  if (data.length === 0) {
    container.innerHTML = '';
    container.appendChild(createHafalankuEmpty());
    return;
  }

  container.innerHTML = data.map(entry => {
    const meta = JUZ_SURAHS[entry.surahNum] || SURAHS[entry.surahNum];
    const name = meta ? meta.name : 'Surah ' + entry.surahNum;
    const totalAyahs = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 0;
    const checked = entry.checkedAyahs ? entry.checkedAyahs.length : 0;
    const pct = totalAyahs > 0 ? Math.round((checked / totalAyahs) * 100) : 0;
    const isComplete = pct >= 100;

    // Ayat grid — always individual boxes, capped height for long surahs
    let ayatHtml = '';
    for (let i = 1; i <= totalAyahs; i++) {
      const isChecked = entry.checkedAyahs && entry.checkedAyahs.includes(i);
      const stateLabel = isChecked ? 'sudah dihafal' : 'belum dihafal';
      ayatHtml += `<div class="ayat-check${isChecked ? ' checked' : ''}" style="cursor:default;font-size:11px" role="img" aria-label="Ayat ${i}, ${stateLabel}">${i}</div>`;
    }
    const needsScroll = totalAyahs > 50;
    const gridId = 'hk-ayat-scroll-' + entry.surahNum;
    const ayatGridWrapped = needsScroll
      ? `<div class="ayat-scroll-wrap collapsed" id="${gridId}">
           <div class="ayat-checks">${ayatHtml}</div>
           <div class="ayat-scroll-fade" id="${gridId}-fade"></div>
         </div>
         <button class="ayat-expand-btn" id="${gridId}-btn" onclick="event.stopPropagation();toggleAyatScroll('${gridId}')">
           <span id="${gridId}-label">Tampilkan semua ${totalAyahs} ayat</span>
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
         </button>`
      : `<div class="ayat-checks">${ayatHtml}</div>`;

    // Recording history
    const recs = entry.recordings || [];
    let recsHtml = '';
    if (recs.length > 0) {
      recsHtml = `<div class="hk-rec-history">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-family:var(--font-mono);margin-bottom:4px">Riwayat Setoran</div>
        ${recs.map((r, idx) => `
          <div class="hk-rec-item">
            <button class="hk-rec-item-play" id="hk-play-${entry.surahNum}-${idx}" onclick="event.stopPropagation();playHkArchive(${entry.surahNum},${idx})">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <div class="hk-rec-item-info">
              <div class="hk-rec-item-range">Ayat ${r.from}–${r.to}</div>
              <div class="hk-rec-item-date">${r.date || '—'}</div>
            </div>
            <div class="hk-rec-item-dur">${r.duration || 0}s</div>
          </div>
        `).join('')}
      </div>`;
    }

    return `
      <div class="hafalanku-item">
        <div class="hafalanku-item-top hafalanku-item-expand" onclick="toggleHafalankuExpand(${entry.surahNum})">
          <span class="hafalanku-item-name">${isComplete ? '✅ ' : ''}${entry.surahNum}. ${name}</span>
          <span style="display:flex;align-items:center;gap:6px">
            <span class="hafalanku-item-pct">${pct}%</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted2)" stroke-width="2.5" style="transition:transform 0.2s"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </div>
        <div class="hafalanku-item-bar">
          <div class="hafalanku-item-fill" style="width:${pct}%"></div>
        </div>
        <div class="hafalanku-item-meta">
          <span>${checked}/${totalAyahs} ayat · ${recs.length} setoran</span>
          <span style="cursor:pointer;color:var(--err);font-weight:700;font-size:11px" onclick="event.stopPropagation();removeHafalanSurah(${entry.surahNum})">Hapus</span>
        </div>
        <div class="hafalanku-ayat-grid" id="hk-grid-${entry.surahNum}">
          <!-- Setor hafalan -->
          <div style="font-size:11px;color:var(--muted);text-align:center;margin-bottom:8px;line-height:1.5">Setor hafalan untuk dapat checklist progres ayat</div>
          <button class="hk-rec-start-btn" onclick="event.stopPropagation();openHkRecModal(${entry.surahNum})" style="width:100%;justify-content:center;margin-bottom:12px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
            Setor Tambah Hafalan
          </button>
          <!-- Ayat grid -->
          <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-family:var(--font-mono);margin-bottom:6px">Progress Ayat</div>
          ${ayatGridWrapped}
          ${recsHtml}
        </div>
      </div>`;
  }).join('');
}

function createHafalankuEmpty() {
  const div = document.createElement('div');
  div.className = 'hafalanku-empty';
  div.id = 'hafalanku-empty';
  div.innerHTML = `
    <div class="hafalanku-empty-icon">📚</div>
    <div class="hafalanku-empty-text">Belum ada hafalan</div>
    <div class="hafalanku-empty-sub">Tambahkan surah yang sedang kamu hafal di atas</div>`;
  return div;
}

function renderHafalankuBeranda() {
  const data = getHafalankuData();
  const card = document.getElementById('hafalanku-beranda');
  if (data.length === 0) {
    card.style.display = 'none';
    return;
  }
  card.style.display = 'block';

  let totalAyahs = 0, totalChecked = 0, totalRecs = 0;
  data.forEach(entry => {
    const meta = JUZ_SURAHS[entry.surahNum] || SURAHS[entry.surahNum];
    const count = meta ? (meta.ayahs ? meta.ayahs.length : meta.ayahCount) : 0;
    totalAyahs += count;
    totalChecked += entry.checkedAyahs ? entry.checkedAyahs.length : 0;
    totalRecs += entry.recordings ? entry.recordings.length : 0;
  });

  const pct = totalAyahs > 0 ? Math.round((totalChecked / totalAyahs) * 100) : 0;
  document.getElementById('hk-beranda-count').textContent = data.length + ' surah';
  document.getElementById('hk-beranda-fill').style.width = pct + '%';
  document.getElementById('hk-beranda-ayat').textContent = totalChecked;
  document.getElementById('hk-beranda-total').textContent = totalAyahs;
  // Sync ARIA progress values for screen readers
  const progressWrap = document.getElementById('hk-beranda-progress');
  if (progressWrap) {
    progressWrap.setAttribute('aria-valuenow', pct);
    progressWrap.setAttribute('aria-label', `Progress hafalan keseluruhan ${pct} persen, ${totalChecked} dari ${totalAyahs} ayat`);
  }
}

function initHafalankuPage() {
  populateSurahSel('hk-add-surah-sel', 114);
  renderHafalankuList();
  renderHafalankuBeranda();
}


window.addEventListener('DOMContentLoaded', async () => {
  // Remember last surah picks or default to Al-Fatihah (1)
  const lastMurojaahSurah = parseInt(localStorage.getItem('murajaah_last_surah')) || 1;
  const lastAudioSurah = parseInt(localStorage.getItem('murajaah_last_audio_surah')) || 1;

  // Populate all selectors
  populateSurahSel('hafalanSurahSel', lastMurojaahSurah);
  populateSurahSel('audioSurahSel', lastAudioSurah);
  populateSurahSel('setoran-surah-sel', 1);
  // Initialize audio status text now that surah list is loaded
  setTimeout(() => { try { updateAudioStatusText(); } catch(e){} }, 0);

  // Init sambung ayat multi-select
  initSambungPage();

  // Load default surah for hafalan
  await loadSurah();

  // Apply default mode (murojaah/uji)
  setMurojaahMode('uji');

  // Init beranda
  initBeranda();

  // Init Hafalanku
  initHafalankuPage();

  // Init Supabase
  initSupabase();

  // Route to page from URL hash (e.g. #hafalan, #hafalanku)
  routeFromHash();

  // ── Pull-to-refresh ──
  initPullToRefresh();
});

// ════════════════════════════════════════════════════════════
//  PULL-TO-REFRESH
// ════════════════════════════════════════════════════════════
function initPullToRefresh() {
  const appEl = document.getElementById('app');
  let startY = 0;
  let pulling = false;
  let pullIndicator = null;
  const THRESHOLD = 80; // px to trigger refresh

  // Create pull indicator element
  pullIndicator = document.createElement('div');
  pullIndicator.id = 'pull-refresh-indicator';
  pullIndicator.innerHTML = '<div class="pull-refresh-spinner"></div><span>Tarik untuk refresh</span>';
  pullIndicator.style.cssText = `
    position:fixed;top:56px;left:50%;transform:translateX(-50%) translateY(-60px);
    z-index:99;display:flex;align-items:center;gap:8px;
    background:var(--surface);padding:8px 18px;border-radius:100px;
    box-shadow:var(--shadow-md);font-size:12px;font-weight:600;color:var(--muted);
    transition:transform 0.25s ease,opacity 0.25s ease;opacity:0;pointer-events:none;
    font-family:var(--font);max-width:480px;
  `;
  document.body.appendChild(pullIndicator);

  // Add spinner CSS
  const style = document.createElement('style');
  style.textContent = `
    .pull-refresh-spinner{width:18px;height:18px;border:2.5px solid var(--border);border-top-color:var(--accent);border-radius:50%;display:inline-block;}
    .pull-refresh-spinner.spinning{animation:ptr-spin 0.6s linear infinite;}
    @keyframes ptr-spin{to{transform:rotate(360deg)}}
  `;
  document.head.appendChild(style);

  // Helper: find the nearest scrollable ancestor within #app (e.g. .hafalan-mushaf)
  function getScrollableAncestor(el) {
    while (el && el !== appEl && el !== document.body) {
      const style = window.getComputedStyle(el);
      const oy = style.overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  let innerScroller = null;

  appEl.addEventListener('touchstart', (e) => {
    innerScroller = getScrollableAncestor(e.target);
    // If the touch started inside an inner scroller that is NOT at the top,
    // don't arm PTR at all — user is scrolling that section.
    if (innerScroller && innerScroller.scrollTop > 0) {
      pulling = false;
      return;
    }
    if (appEl.scrollTop <= 0) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  }, { passive: true });

  appEl.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    // If the inner scroller has since scrolled away from the top, cancel PTR
    if (innerScroller && innerScroller.scrollTop > 0) {
      pulling = false;
      pullIndicator.style.transform = 'translateX(-50%) translateY(-60px)';
      pullIndicator.style.opacity = '0';
      return;
    }
    const dy = e.touches[0].clientY - startY;
    if (dy > 10 && appEl.scrollTop <= 0) {
      const progress = Math.min(dy / THRESHOLD, 1);
      pullIndicator.style.transform = `translateX(-50%) translateY(${Math.min(dy * 0.4, 40)}px)`;
      pullIndicator.style.opacity = progress;
      pullIndicator.querySelector('span').textContent = dy >= THRESHOLD ? 'Lepas untuk refresh' : 'Tarik untuk refresh';
    }
  }, { passive: true });

  appEl.addEventListener('touchend', () => {
    if (!pulling) { innerScroller = null; return; }
    pulling = false;
    innerScroller = null;
    const currentOpacity = parseFloat(pullIndicator.style.opacity || 0);
    if (currentOpacity >= 1) {
      // Trigger refresh
      pullIndicator.querySelector('span').textContent = 'Memuat ulang...';
      pullIndicator.querySelector('.pull-refresh-spinner').classList.add('spinning');
      pullIndicator.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => window.location.reload(), 400);
    } else {
      // Reset
      pullIndicator.style.transform = 'translateX(-50%) translateY(-60px)';
      pullIndicator.style.opacity = '0';
    }
  }, { passive: true });
}