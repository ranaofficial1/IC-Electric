const { verifyToken } = require("../utils/token");
const ApiError = require("../utils/ApiError");

function getTokenFromHeader(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token ? token : null;
}

/** Requires a valid JWT; attaches { id, role } to req.user or rejects with 401. */
function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return next(new ApiError(401, "Authentication required."));

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session. Please log in again."));
  }
}

/** Populates req.user if a valid token is present, but never rejects. Useful for
 *  endpoints that behave differently for guests vs logged-in users. */
function optionalAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return next();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Ignore invalid/expired tokens here — treat the request as a guest
    // rather than failing outright.
  }
  next();
}

/** Must run after requireAuth. Rejects with 403 unless the user is an admin. */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required."));
  }
  next();
}

module.exports = { requireAuth, optionalAuth, requireAdmin };
