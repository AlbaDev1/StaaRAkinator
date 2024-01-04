const fs = require("fs")
const args = process.argv.slice(2)

if (args.length === 2) {
    console.log("Reading input file...")
    const oldQnA = JSON.parse(fs.readFileSync(args[0], {encoding: "utf-8"}))
    console.log("Converting to new format...")
    const length = oldQnA.length
    let i = 1
    process.stdout.write(`0/${length}`)
    const newQnA = {}
    for (const o of oldQnA) {
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0);
        process.stdout.write(`${i++}/${length}`)
        newQnA[o.question] = o.reponse
    }
    console.log()
    console.log("Successfully converted questions. Writing to the output file...")
    fs.writeFileSync(args[1], JSON.stringify(newQnA, null, 4))
    console.log("Successfully migrated QnA storage.")
} else {
    console.error(`Command usage: ${process.argv.slice(0, 2).join(" ")} [path to input file] [path to output file]`)
}