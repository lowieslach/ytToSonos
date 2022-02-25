const express = require("express");

const { getGroups, getDevice } = require("../../js/sonos");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("SONOS API");
});

router.get("/getGroups", (req, res) => {
  getDevice().then((device) => {
    getGroups().then((groups) => {
      res.json(groups);
    });
  });
});

module.exports = router;
