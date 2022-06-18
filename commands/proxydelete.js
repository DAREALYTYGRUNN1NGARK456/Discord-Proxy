const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { Authorization, PROXY_URL } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('proxydelete')
        .setDescription('Deletes a proxy')
        .addStringOption(option => option.setName('domain').setDescription('Your domain/subdomain').setRequired(true)),
    async execute(client, interaction) {
        const domain = interaction.options.getString('domain');

        if (!interaction.member.roles.cache.has(process.env.MASTER_ROLE)) return interaction.reply({ 
            embeds: [
                new MessageEmbed()
                    .setTitle('You are not allowed to run this!')
                    .setColor('RED')
            ]
        });

        interaction.reply({ 
            embeds: [
                new MessageEmbed()
                    .setTitle('Loading...')
                    .setDescription('This might take up to 30 seconds, so please wait!')
                    .setFooter('Domain: ' + domain)
                    .setColor('AQUA')
            ]
        });
          
        var config = {
            method: 'delete',
            url: PROXY_URL + domain,
            headers: { 
              'Authorization': Authorization, 
              'Content-Type': 'application/json'
            }
        };

        axios(config)
            .then(function (response) {
                interaction.followUp({ 
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Success!')
                            .setDescription(response.data.message)
                            .setFooter('Domain: ' + domain)
                            .setColor('GREEN')
                    ]
                });
            })
            .catch(function (error) {
                interaction.followUp({ 
                    embeds: [
                        new MessageEmbed()
                            .setTitle('An error has occured!')
                            .setDescription(error.response.data.message || error.response.data.error)
                            .setFooter('Domain: ' + domain)
                            .setColor('RED')
                    ]
                });
            });

    }

}