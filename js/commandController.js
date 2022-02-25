const fs = require("fs");
const path = require("path");
const { createSpinner } = require("nanospinner");

const { downloadYoutube } = require("./musicDownloader");
const { welcome, askTasks, askInput } = require("./commandLine");
const { getGroups, getDevice, createSonos } = require("./sonos.js");
const { sleep } = require("./util");

const TASK_OPTIONS = ["Add song to server", "Control SONOS"];
const SONOS_ACTIOS = ["PLAY", "PLAY SONG", "PAUSE", "STOP"];

async function commandDownloadSong(cb = () => {}) {
  const id = await askInput("What is the youtube id from the song?");
  const spinner = createSpinner("Downloading Song...").start();
  const PATH = path.join(__dirname, "./public/music/" + id + ".mp3");
  console.log(PATH);
  if (fs.existsSync(PATH)) {
    spinner.success({
      text: `Song with id:${id} was already downloaded.`,
    });
    cb(id);
  } else {
    downloadYoutube(id, (err) => {
      if (err) spinner.error({ text: `Downloading failed` });
      spinner.success({
        text: `Song with id:${id} is downloaded.`,
      });
      cb(id);
    });
  }
}

async function startCommandLineController(IP, PORT) {
  console.clear();

  await welcome("Play youtube on sonos!");

  const task = await askTasks("What do you want to do?", TASK_OPTIONS);

  switch (task) {
    case TASK_OPTIONS[0]:
      commandDownloadSong();
      break;
    case TASK_OPTIONS[1]:
      const searchingSonosDeviceSpinner = createSpinner(
        "Searching for sonos device..."
      ).start();
      getDevice().then((device) => {
        searchingSonosDeviceSpinner.success({
          text: `found device at ${device.host}`,
        });
        getGroups(device).then((groups) => {
          const groupNames = groups.map((group) => {
            return group.name;
          });
          const askGroups = async () => {
            const groupName = await askTasks(
              "What group do you want to control?",
              groupNames
            );
            group = groups.find((group) => group.name == groupName);
            const sonos = createSonos(group);
            let loop = true;
            let inProcess = false;
            while (loop) {
              if (inProcess) {
                await sleep(1000);
                continue;
              }
              const action = await askTasks(
                "What do you want to do?",
                SONOS_ACTIOS
              );
              switch (action) {
                case SONOS_ACTIOS[0]:
                  sonos.play();
                  break;
                case SONOS_ACTIOS[1]:
                  inProcess = true;
                  await commandDownloadSong((id) => {
                    sonos.play(
                      "http://" + IP + ":" + PORT + "/music/" + id + ".mp3"
                    );
                    inProcess = false;
                  });
                  break;
                case SONOS_ACTIOS[2]:
                  sonos.stop();
                  break;
                case SONOS_ACTIOS[3]:
                  sonos.stop();
                  loop = false;
                  break;
              }
            }
            console.log("Shutting down");
            await sleep();
            process.exit(0);
          };
          askGroups();
        });
      });
      break;
  }
}

module.exports = { startCommandLineController };
