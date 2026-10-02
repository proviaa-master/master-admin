/* eslint-disable @typescript-eslint/no-var-requires */
// Bridge to compiled backend for production serverless execution
let app: any;
try {
  app = require("../backend/dist/index");
} catch {
  app = require("../backend/src/index");
}

const handler = app.default || app;

export default handler;
if (typeof module !== "undefined" && module.exports) {
  module.exports = handler;
}
