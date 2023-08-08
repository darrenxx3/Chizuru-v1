// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {	Manager	} = require('erela.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,
									GatewayIntentBits.GuildVoiceStates,
									GatewayIntentBits.GuildMembers] });


client.commands = new Collection();


const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));


	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.data.name, command)
			commands.push(command.data.toJSON());
		}

		// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10'}).setToken(process.env.token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();



// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	client.manager.init(client.user.id);
	console.log(`✅ ${c.user.tag} is online, have fun!.`);
});

client.on('interactionCreate', (interaction) =>{
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName)
	if(!command) return;

	try {
		command.execute(client, interaction)
	} catch (error) {
		interaction.reply({content: "There was an error executing this command.", ephemeral:true})
	}
})

/*client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'ping') {
        interaction.reply(`✅ Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
    }
});*/

// Define some options for the node
const nodes = [
	{
	  host: "suki.nathan.to",
	  password: "adowbongmanacc",
	  port: 443,
	  secure: true
	}
  ];

  // Assign Manager to the client variable
client.manager = new Manager({
	// The nodes to connect to, optional if using default lavalink options
	nodes,
	// Method to send voice data to Discord
	send: (id, payload) => {
	  const guild = client.guilds.cache.get(id);
	  // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
	  if (guild) guild.shard.send(payload);
	}
  });

// Emitted whenever a node connects
client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`)
})

// Emitted whenever a node encountered an error
/*client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
})*/

// THIS IS REQUIRED. Send raw events to Erela.js
client.on("raw", d => client.manager.updateVoiceState(d));

// Log in to Discord with your client's token
client.login(process.env.token);