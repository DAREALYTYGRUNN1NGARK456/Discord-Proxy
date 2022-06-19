const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const { Authorization, PROXY_URL } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("proxylist")
    .setDescription("List of proxies"),
  async execute(client, interaction) {
    if (!interaction.member.roles.cache.has(process.env.MASTER_ROLE))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("You are not allowed to run this!")
            .setColor("RED"),
        ],
      });

    var config = {
      method: "get",
      url: PROXY_URL,
      headers: {
        Authorization: Authorization,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        let embed = new MessageEmbed()
          .setTitle("Proxy List")
          .setFooter("Total Proxies: " + response.data.length)
          .setColor("GREEN");

        if(response.data.length == 0) {
          embed.setDescription("No proxies found!");
        }

        for (let i = 0; i < response.data.length; i++) {
          embed.addField(
            "Domain: " + response.data[i].domain,
            "Target: " + response.data[i].target + "\n" + "SSL: " + response.data[i].ssl
          );
        }
        interaction.reply({ embeds: [embed] });

      })
      .catch(function (error) {
        console.log(error);
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("An error has occured!")
              .setColor("RED"),
          ],
        });
      });
  },
};
