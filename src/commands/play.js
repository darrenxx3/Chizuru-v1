const { SlashCommandBuilder } = require('discord.js');
const { MessageEmbed} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song that has been requested!')
    .addStringOption((option) =>
      option.setName('song_name').setDescription('Input').setRequired(true)
    ),
  async execute(client, interaction) {
    const song_name = interaction.options.getString('song_name');

    if (!interaction.member.voice.channel)
      return interaction.reply({
        content: 'Join a voice channel first!',
        ephemeral: true,
      });

    let player = client.manager.players.get(interaction.guild.id);

    // Create the player
    if (!player)
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
      });

    const songs = await client.manager.search(song_name);

    player.connect();

    // Connect the voice channel and add track to queue
    player.queue.add(songs.tracks[0]);

    if (!player.playing) player.play();

    interaction.reply(`Now Playing - "${songs.tracks[0].title}"`);
  },
};
