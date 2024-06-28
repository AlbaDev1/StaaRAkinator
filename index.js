const functions = require('./functions.js');
require('dotenv').config();
const db = require('./databaseManager.js')


functions.checkConfig()
const config = require('./config.json')

db.initDb()
db.insertCharacter(config.main.character.name)

if (config.mainModule) require('./browser.js').launchBrowser()

if (config.discordIntegration) require("./bot.js")

process.on("SIGINT", process.exit)
process.on("SIGTERM", process.exit)