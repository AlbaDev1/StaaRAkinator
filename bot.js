const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const db = require('./databaseManager.js');
const config = require('./config.json')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.on('ready', () => {
    console.log(`${client.user.username} est prêt !`);
})

client.on('messageCreate', message => {
    if (message.content.startsWith(config.discord.prefix + 'akinator')) {
        const embed = new EmbedBuilder().setTitle("StaaRAkinator stats")
        const data = db.selectAll()
        const current = data.find(row => row.character === config.main.character.name)
        embed.addFields({name: "Current caracter: " + config.main.character.name, value: current === undefined ? "No data to display." : `Found by this bot: ${current.bot}\nFound in total: ${current.total}`})
        for (const row of data) {
            if (row.character === config.main.character.name) continue
            embed.addFields({name: row.character, value: `Found by this bot: ${row.bot}\nFound in total: ${row.total}`})
        }
        message.reply({embeds: [embed]})
    }
})

client.login(process.env.TOKEN);