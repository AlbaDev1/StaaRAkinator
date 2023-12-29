const fs = require('fs');
const { connect } = require('mongoose');
const nombres = require('./modals/nombres')
require('dotenv').config();
const { token, databaseToken } = process.env;

(async() => {
  await connect(databaseToken).catch(console.error) 
})();

const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false
});

client.on('ready', async () => {
  console.log(`${client.user.username} est prêt !`);
})

client.on('messageCreate', async (message) => {
  if(message.guild.id !== "682949286920585261") return;
  if(message.content.startsWith('alba!akinator')){
    await nombres.find()
    .then(resultats => {
      resultats.forEach(async resultat => {
      const cheminDuFichier = 'questions.json';
const contenuDuFichier = fs.readFileSync(cheminDuFichier, 'utf-8');

const objetJSON = JSON.parse(contenuDuFichier);

const nombreElements = Object.keys(objetJSON).length;
      message.reply(`**${personnage}** a actuellement été trouvé **${resultat.total}** fois !\nJe l'ai trouvé **${resultat.bot}** fois grâce à **${nombreElements}** questions/réponses !`)
      })
    })
  }
})

client.login(token);