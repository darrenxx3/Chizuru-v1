const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Display the bot's ping in (ms)!"),
	async execute(client, interaction) {
		interaction.reply(`✅ Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
	},
};