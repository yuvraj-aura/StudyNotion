// Resolve lazily because route modules are loaded before dotenv in index.js.
function getClientUrl() {
    const value = process.env.CLIENT_URL?.trim();
    if (!value && process.env.NODE_ENV === "production") {
        throw new Error("CLIENT_URL is required in production");
    }
    const url = new URL(value || "http://localhost:5173");
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) {
        throw new Error("CLIENT_URL must be an HTTP(S) origin without a path or credentials");
    }
    if (process.env.NODE_ENV === "production" &&
        (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
        throw new Error("CLIENT_URL must be a public HTTPS origin in production");
    }
    return url.origin;
}

module.exports = { getClientUrl };
