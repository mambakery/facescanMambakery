// ============================================================
//  Admin Auth Helper — ใช้ร่วมกันใน register.html & config.html
// ============================================================

const ADMIN_TOKEN_KEY  = 'maemberry_admin_token';
const ADMIN_EXPIRY_KEY = 'maemberry_admin_expiry';
const SESSION_HOURS    = 8; // session อายุ 8 ชั่วโมง

function getAdminToken() {
  const expiry = parseInt(sessionStorage.getItem(ADMIN_EXPIRY_KEY) || '0');
  if (Date.now() > expiry) {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_EXPIRY_KEY);
    return null;
  }
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminSession(token) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_EXPIRY_KEY, String(Date.now() + SESSION_HOURS * 3600 * 1000));
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_EXPIRY_KEY);
}

function requireAdminOrRedirect() {
  const token = getAdminToken();
  if (!token) {
    const page = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    window.location.href = 'login.html?next=' + page;
    return null;
  }
  return token;
}

function getApiUrl() {
  return localStorage.getItem('gasApiUrl') || (typeof GAS_API_URL !== 'undefined' ? GAS_API_URL : '');
}
