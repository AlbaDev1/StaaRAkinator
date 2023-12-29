const phrase = "Personnage déjà joué 190 fois";

function extraireNombre(phrase) {
    const match = phrase.match(/\b(\d+)\b/);

    if (match) {
        const nombre = match[1];
        return nombre;
    } else {
        return null;
    }
}

const nombreExtrait = extraireNombre(phrase);

if (nombreExtrait !== null) {
    console.log("Nombre extrait:", nombreExtrait);
} else {
    console.log("Aucun nombre trouvé dans la phrase.");
}


const staarMap = {
    "Ton personnage affronté Alexandre le Grand ?": "yes"
}