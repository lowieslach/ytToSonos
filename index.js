const { createSpinner } = require("nanospinner");

const { downloadYoutube } = require("./js/musicDownloader");
const { welcome, askTasks, askInput } = require("./js/commandLine");
const { getGroups, getDevice, createSonos } = require("./js/sonos.js");
const { sleep } = require("./js/util");

const TASK_OPTIONS = ["Add song to server", "Control SONOS"];
const SONOS_ACTIOS = ["PLAY", "PAUSE", "STOP"];

const start = async function () {
  //   console.clear();
  await welcome("Play youtube on sonos!");
  const task = await askTasks("What do you want to do?", TASK_OPTIONS);

  switch (task) {
    case TASK_OPTIONS[0]:
      const id = await askInput("What is the youtube id from the song?");
      const spinner = createSpinner("Downloading Song...").start();
      downloadYoutube(id, (err) => {
        if (err) spinner.error({ text: `Downloading failed` });
        spinner.success({
          text: `Song with id:${id} is downloaded.`,
        });
      });
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
            while (loop) {
              const action = await askTasks(
                "What do you want to do?",
                SONOS_ACTIOS
              );
              switch (action) {
                case SONOS_ACTIOS[0]:
                  sonos.play();
                  break;
                case SONOS_ACTIOS[1]:
                  sonos.stop();
                  break;
                case SONOS_ACTIOS[2]:
                  sonos.stop();
                  loop = false;
                  break;
              }
            }
            await sleep();
            process.exit(0);
          };
          askGroups();
        });
      });
      break;
  }
};
start();
