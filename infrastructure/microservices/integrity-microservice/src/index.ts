console.clear();
import app from './app';
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 8260;

app.listen(port, () => {
  console.log(`\x1b[32m[TCPListen@Integrity]\x1b[0m localhost:${port}`);
});