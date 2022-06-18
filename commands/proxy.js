const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { Authorization, PROXY_URL } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('proxy')
        .setDescription('Proxies')
        .addStringOption(option => option.setName('domain').setDescription('Your domain/subdomain').setRequired(true))
        .addStringOption(option => option.setName('target').setDescription('The target').setRequired(true)),
    async execute(client, interaction) {

        const domain = interaction.options.getString('domain');
        const target = interaction.options.getString('target');

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
                    .setColor('YELLOW')
            ]
        });

        var data = JSON.stringify({
            "domain": domain,
            "target": target,
            "ssl": true
        });
          
        var config = {
            method: 'post',
            url: PROXY_URL,
            headers: { 
              'Authorization': Authorization, 
              'Content-Type': 'application/json'
            },
            data : data
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