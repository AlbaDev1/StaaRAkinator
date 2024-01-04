const BetterSqlite3 = require("better-sqlite3")
/**
 * @type {BetterSqlite3.Database}
 */
let db
let updateRecordStatement
let selectAllStatement

function initDb() {
    const debug = require("./config.json").enableDebug
    db = BetterSqlite3("yetAnotherDatabase.db", {verbose: (...args) => {if (debug) console.log(...args)}})
    db.pragma('journal_mode = WAL');
    db.prepare("CREATE TABLE IF NOT EXISTS TimesFound(character TEXT PRIMARY KEY NOT NULL, total INTEGER, bot INTEGER);").run()
    updateRecordStatement = db.prepare("UPDATE TimesFound SET total = ?, bot = bot + 1 WHERE character = ?;")
    selectAllStatement = db.prepare("SELECT * FROM TimesFound;");
}

function insertCharacter(name) {
    db.prepare("INSERT INTO TimesFound (character, total, bot) VALUES (?, 0, 0) ON CONFLICT(character) DO NOTHING;").run(name)
}

function updateRecord(character, total) {
    updateRecordStatement.run(total, character)
}

function selectAll() {
    return selectAllStatement.all()
}

process.on("exit", () => {
    db.close()
})


module.exports = {
    initDb,
    insertCharacter,
    updateRecord,
    selectAll
}