import app from "./app";

const port = Number(process.env.PORT) || 4015;

app.listen(port, () => {
  console.log(`Security Incident Simulator running on port ${port}`);
});
