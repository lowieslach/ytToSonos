require("dotenv").config();
const ip = require("ip");
const express = require("express");
const app = express();

const { startCommandLineController } = require("./js/commandController");

app.use(express.static("public"));

app.use("/api/sonos", require("./routes/api/sonosAPI"));
app.use("/", require("./routes/sonos"));

const PORT = process.env.PORT;
const IP = ip.address();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  // startCommandLineController(IP, PORT);
});
