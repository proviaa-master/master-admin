import app from "../backend/src/index";

export default app;
if (typeof module !== "undefined" && module.exports) {
  module.exports = app;
}
