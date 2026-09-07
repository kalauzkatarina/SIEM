import { Db } from "./DbConnectionPool";

export async function initialize_database() {
  try {
    await Db.initialize();
    console.log("\x1b[35m[DbConn@InsiderThreat]\x1b[0m Database connected");

  } catch (err) {
    console.error("\x1b[31m[DbConn@InsiderThreat]\x1b[0m Error during DataSource initialization ", err);
  }
}