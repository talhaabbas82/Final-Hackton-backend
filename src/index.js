import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { seedDemoData } from "./shared/seed.js";

async function bootstrap() {
  await connectDb();
  await seedDemoData();
  app.listen(env.port, () => {
    console.log(`Helplytics API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);

});

module.exports = app;