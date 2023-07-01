const { SlashCommandBuilder } = require('discord.js');
const { MessageEmbed} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume a song that has been paused!')
    .addStringOption((option) =>
      option.setName('song_name').setDescription('Enter the song name that you want to type').setRequired(false)
    ),
    async execute(client, interaction) {
        const guildId = interaction.guild.id;
        const player = client.manager.players.get(guildId);

        if(!player || !player.queue.current){
            return interaction.reply({
                content: 'There is no song currently playing. :(',
                ephemeral:true,
            });
        }

        player.pause(false);

        interaction.reply('Resume the current song ^^.');

        //await interaction.reply('type `/pause` to pause the song');
    },
};