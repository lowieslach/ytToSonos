const chalkAnimation = require("chalk-animation");
const inquirer = require("inquirer");

const { sleep } = require("./util");

async function welcome(msg) {
  const rainbowTitle = chalkAnimation.rainbow(msg + "\n");

  await sleep(1000);
  rainbowTitle.stop();
}
async function askTasks(msg, tasks) {
  const answers = await inquirer.prompt({
    name: "task",
    type: "list",
    message: msg + "\n",
    choices: tasks,
  });

  return answers.task;
}
async function askInput(msg) {
  const answers = await inquirer.prompt({
    name: "task",
    type: "input",
    message: msg + "\n",
  });

  return answers.task;
}

module.exports = {
  welcome,
  askTasks,
  askInput,
};
