module.exports.sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
