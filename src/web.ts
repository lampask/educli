import puppeteer from 'puppeteer';
import ora from 'ora';
import { getAccessCrdentials, CardHolderModel, CardModel } from './utils';
import chalk from 'chalk';

export default async function(url: string, debug: boolean) {
    var load = ora("Setting up").start();

    const browser = await puppeteer.launch({headless: false});
    const page = (await browser.pages())[0];

    await page.goto(url);

    load.text = "All set up";
    load.succeed();
    
    //Step 1 - Login
    await page.title().then(async (title) => {
        if (title.includes("Prihlásenie")) {
            console.log("- Attempting to log in.");
            const creds_pack = await getAccessCrdentials();
            
            load = ora("Logging in").start();
            await page.type("#login_Login_1e1", creds_pack.username);
            await page.type("#login_Login_1e2", creds_pack.password);
            await page.click('.skgdFormSubmit');
        }
    });

    //Step 2 - Check logged status
    var success = false;
    await page.title().then(async (title) => {
        if (title.includes("Prihlásenie")) {
            load.text = "Logging process failed.";
            load.fail();
        } else {
            load.text = "Sucessfully logged in.";
            load.succeed();
            success = true;
        }
    });

    if (!success) {
        await browser.close();
        return false;
    }

    load = ora("Obtaining data").start();

    //Step 3 - Obtain data

    await page.goto(url);
    //await page.waitForNavigation();
    
    load.text = "Waiting for contents to load"
    var exam_data: CardHolderModel = {};
    setTimeout(async() => {
        await page.evaluate('ETestUtils.cardsData').then((data) => {
            if (data !== {} || typeof(data) == "object") {
                load.text = "Data obtained"
                load.succeed();
                exam_data = data as Object; 

                // Step 4 - Process the data
                var i = 0;
                Object.values(exam_data).forEach((cardData: CardModel) => {
                    console.log(chalk.red(`Test Question ${++i}`))
                    var formatted_output = cardData.description;
                    console.log(formatted_output?.replace("aid", chalk.green("Correct answer is: ")));
                });
            } else {
                load.text = "An error occured while obtaining data"
                load.fail();
            }
        });
        await page.close();
    }, 2000);
    
    return;
}