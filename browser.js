const puppeteer = require('puppeteer');
const fs = require('fs');
const { getResponseByQuestion, extractNumber } = require('./functions.js')
const config = require('./config.json')
const db = require('./databaseManager.js')

const head = config.main.headless ? 'new' : false;
const folderPath = config.main.screenshotFolder;
const personnage = config.main.character.name;
const description = config.main.character.description;
const baseURL = config.main.baseURL
const screenshotIdFile = folderPath + "/id.txt"

function saveScreenshot(screenshotBuffer) {
    const filePath = folderPath + "/" + getNextScreenshotNumber() + ".png";
    fs.writeFileSync(filePath, screenshotBuffer);
}

function getNextScreenshotNumber() {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {recursive: true});
    }

    let id
    if (fs.existsSync(screenshotIdFile)) {
        id = parseInt(fs.readFileSync(screenshotIdFile, 'utf8')) + 1;
    } else {
        id = 1
    }
    fs.writeFileSync(screenshotIdFile, id.toString(), {encoding: 'utf8'})
    return id
}

async function launchBrowser() {
    const browser = await puppeteer.launch({ headless: head });
    const page = await browser.newPage();
    
    await page.goto(baseURL);
    
    await page.setViewport({width: 1266, height: 913});
    
    await page.waitForTimeout(5000);
    
    await page.mouse.click(1140, 842);
    
    // Choix du thème
    
    page.goto(baseURL + 'theme-selection')
    
    await page.waitForTimeout(2000);
    
    page.mouse.click(595, 484);
    
    // Jeu
    
    while (true) {
        
        await page.waitForTimeout(5000);
        
        const bubbleContainer = await page.$('.bubble-propose-container');
        
        const content = await page.$eval('span.proposal-title', (spanElement) => {
            return spanElement.textContent;
        });
        
        if (bubbleContainer && content !== "") {
            
            if (content === "Un souci technique s'est produit. Merci de réessayer.") {
                await page.waitForSelector('#a_replay');
                
                await page.click('#a_replay');
                await page.waitForTimeout(5000);
            } else {
                
                const content2 = await page.$eval('span.proposal-subtitle', (spanElement) => {
                    return spanElement.textContent;
                });
                
                if (content === personnage && content2 ===  description) {
                    await page.waitForSelector('#a_propose_yes');
                    
                    await page.click('#a_propose_yes');
                    await page.waitForTimeout(5000);

                    const content3 = await page.$eval('span.win-subtitle.last-played', (spanElement) => {
                        return spanElement.textContent;
                    });
                    
                    const total = extractNumber(content3)

                    if (config.main.saveScreenshots) {
                        const screenshot = await page.screenshot()
                        saveScreenshot(screenshot);
                    }
                    db.updateRecord(personnage, total)
                    
                    await page.waitForSelector('#a_replay');
                    await page.click('#a_replay');
    
                    await page.waitForTimeout(2000);
                    
                    page.mouse.click(595, 484);
                } else {
                    await page.waitForSelector('#a_propose_no');
                    
                    await page.click('#a_propose_no');
                    await page.waitForTimeout(500);
                    await page.waitForSelector('#a_propose_no');
                    
                    await page.click('#a_propose_no');
                    await page.waitForTimeout(500);
                    
                    const divFormulaire = await page.$('.aki-formulaire.dialog-box');
                    
                    if (divFormulaire) {
                        try {
                            const inputSelector = '.aki-formulaire.dialog-box form .input-diamond2 label input[type="text"][name="name"]';
                            
                            await page.waitForSelector(inputSelector);
                            
                            await page.type(inputSelector, personnage);
                            await page.waitForSelector('#input-soundlike-search');
                            await page.click('#input-soundlike-search');
                            await page.waitForTimeout(3000);
                            
                            const links = await page.$$('a');
                            
                            for (const link of links) {
                                const linkText = await page.evaluate((el) => el.textContent, link);
                                
                                if (linkText.includes(`${personnage} (${description})`)) {
                                    await link.click();
                                    await page.waitForTimeout(2000);
                                    await page.waitForSelector('#a_replay');
                                    await page.click('#a_replay');
                                    break;
                                }
                            }
                        } catch (error) {
                            console.error('Une erreur s\'est produite : ', error);
                        }
                    } else {
                        await page.waitForSelector('#a_yes');
                        
                        await page.click('#a_yes');
                    }
                }
            }
        } else {
            const content = await page.$eval('p.question-text', (pElement) => {
                return pElement.textContent;
            });
            
            const reponse = getResponseByQuestion(content)
            await page.waitForSelector(`#a_${reponse}`);
                
            await page.click(`#a_${reponse}`);            
        }
    }
    await browser.close();
}



module.exports = {
    launchBrowser
}