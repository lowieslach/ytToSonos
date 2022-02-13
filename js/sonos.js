const { DeviceDiscovery, Sonos } = require("sonos");

function getDevice() {
  return new Promise((revolve) => {
    DeviceDiscovery().once("DeviceAvailable", (device) => {
      revolve(device);
    });
  });
}

function getGroups(device) {
  // get all groups
  return new Promise((revolve) =>
    device.getAllGroups().then((groups) => {
      groups = groups.map((group) => {
        return {
          name: group.Name,
          host: group.host,
          port: group.port,
        };
      });
      revolve(groups);
    })
  );
}

function createSonos({ host, port }) {
  if (port) return new Sonos(host, port);
  else return new Sonos(host);
}

module.exports = {
  getDevice,
  getGroups,
  createSonos,
};
