const YoutubeMp3Downloader = require("youtube-mp3-downloader");

const fs = require("fs");
const path = require("path");

var Downloader = function () {
  var self = this;

  //Configure YoutubeMp3Downloader with your settings
  self.YD = new YoutubeMp3Downloader({
    ffmpegPath: "./lib/ffmpeg/bin/ffmpeg.exe", // FFmpeg binary location
    outputPath: "./music", // Output file location (default: the home directory)
    youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
    queueParallelism: 2, // Download parallelism (default: 1)
    progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
    outputOptions: ["-af", "silenceremove=1:0:-50dB"], // Additional output options passend to ffmpeg
  });

  self.callbacks = {};

  self.YD.on("finished", function (error, data) {
    if (self.callbacks[data.videoId]) {
      self.callbacks[data.videoId](error, data);
    } else {
      console.log("Error: No callback for videoId!");
    }
  });

  self.YD.on("error", function (error, data) {
    //console.error(error + " on videoId " + data.videoId);
    console.log(error);

    if (self.callbacks[data.videoId]) {
      self.callbacks[data.videoId](error, data);
    } else {
      console.log("Error: No callback for videoId!");
    }
  });
};

Downloader.prototype.getMP3 = function (track, callback) {
  var self = this;

  // Register callback
  self.callbacks[track.videoId] = callback;
  // Trigger download
  self.YD.download(track.videoId, track.name);
};
var dl = new Downloader();

function downloadYoutube(id, _callback = function () {}) {
  const PATH = path.join(__dirname, "../public/music/mp3/" + id + ".mp3");
  if (!fs.existsSync(PATH)) {
    dl.getMP3({ videoId: id, name: id + ".mp3" }, function (err, res) {
      if (err) _callback(err);
      else {
        console.log("Song was downloaded: " + res.file);
        _callback();
      }
    });
  } else {
    _callback();
  }
}

module.exports = { downloadYoutube };
