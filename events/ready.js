module.exports = async (client) => {
  client.user.setActivity("just started!", { type: "PLAYING" });

  setTimeout(function () {
    client.user.setActivity(`Proxys are up!`, {
      type: "WATCHING",
    });
  }, 5000);

  global.logger.info("Watcher Proxy is online!");
};
