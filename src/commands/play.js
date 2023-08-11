const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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

    //make it embedded
      const embed = new EmbedBuilder()
      .setTitle(`[${songs.tracks[0].title}]`)
      .setURL(songs.url)
      .setDescription("Now Playing")
      .setColor('#777FFF')
      .setThumbnail(songs.tracks[0].thumbnail)
      .setTimestamp()
      .setFooter({text: `Requested by:  ${interaction.user.tag}`, 
                 iconURL: interaction.user.displayAvatarURL()});

    // interaction.reply(`Now Playing - "${songs.tracks[0].title}"`);
    interaction.reply({ embeds : [embed]});

  },
};
