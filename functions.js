const fs = require('fs');
let jsonData
try {
    const data = fs.readFileSync('questions.json', 'utf8');
    jsonData = JSON.parse(data);
} catch (error) {
    throw new Error('Erreur lors de la lecture ou du parsing du fichier JSON : ' + error)
}
function getResponseByQuestion(question) {
    const response = jsonData[question]
    if (response !== undefined) return response
    console.log(`La question "${question}" n'est pas dans le fichier questions.json !`)
    return "dont_know"
}

function extractNumber(phrase) {
    const match = phrase.match(/\b(\d+)\b/);
    
    if (match) {
        const nombre = match[1];
        return nombre;
    } else {
        return null;
    }
}

/**
 * This function is taken from [this stackoverflow question](https://stackoverflow.com/questions/47062922/how-to-get-all-keys-with-values-from-nested-objects)
 * 
 */
const keyify = (obj, prefix = '') => 
  Object.keys(obj).reduce((res, el) => {
    if( Array.isArray(obj[el]) ) {
      return res;
    } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []
);


function checkConfig() {
    if (!fs.existsSync("./config.json")) {
        console.error("Couldn't find config file. Please create a config.json file and fill it with parameters from example.config.json")
        process.exit(1)        
    }
    let config = require("./config.json")
    
    const current = keyify(config)
    const example = require("./example.config.json")

    let isOutdated = false;
    for (let key of keyify(example)) {
        // If the key is present, we do not need to do anything.
        if (current.includes(key)) continue;
        if (!isOutdated) {
            isOutdated = true;
            console.warn("The configuration is out of date. Copying default values from example.config.json...")
        }
        console.warn("Correcting " + key + " to it's default value...")
        const nestedK = key.split(".")

        // Get default value.
        let source = example
        for (const k of nestedK) {
            source = source[k]
        }
        console.warn("Defaulting to " + source + " ...")

        // Get config location.
        let temp = config
        const lastKey = nestedK.pop()
        for (const k of nestedK) {
            if (!temp[k]) temp[k] = {}            
            temp = temp[k]
        }

        // Set default value.
        temp[lastKey] = source
    }

    if (isOutdated) {
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        console.warn("The configuration has been updated successfully. Reloading...")
        delete require.cache[require.resolve("./config.json")];
        require("./config.json")
        console.warn("Reload complete.")
    }
}


module.exports = {
    getResponseByQuestion,
    extractNumber,
    checkConfig
}
