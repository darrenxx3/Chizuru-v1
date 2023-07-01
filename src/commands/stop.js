const { SlashCommandBuilder } = require('discord.js');
const { MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('stop')
      .setDescription('Stop a song that has been played'),

      async execute(client, interaction) {
          const guildId = interaction.guild.id;
          const player = client.manager.players.get(guildId);
  
          if(!player || !player.queue.current){
              return interaction.reply({
                  content: 'There is no song currently playing. :(',
                  ephemeral:true,
              });
          }
  
          player.queue.clear();
          player.stop();
  
          interaction.reply('Stop the song completely ☑');
  
          //await interaction.reply('type `/pause` to pause the song');
      },
  };