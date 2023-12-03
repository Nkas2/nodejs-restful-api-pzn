import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

const port = process.env.PORT || 3000;

web.listen(port, "0.0.0.0", () => {
  logger.info("App start");
});
