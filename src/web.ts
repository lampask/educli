import puppeteer from 'puppeteer';
import { getAccessCrdentials, CardHolderModel, CardModel } from './utils';

// Design
import ora from 'ora';
import chalk from 'chalk';
import boxen from 'boxen';

export default async function(url: string, debug: boolean, marking: boolean, web: boolean) {
    var load = ora("Setting up").start();

    const browser = await puppeteer.launch({headless: !web});
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
                var message: string = "";
                Object.values(exam_data).forEach((cardData: CardModel) => {
                    message += chalk.red(`Test Question ${++i}`);
                    var formatted_output = cardData.description!!;
                    message += formatted_output.replace("aid", chalk.green("Correct answer is: "));
                });
                console.log(boxen(message, {padding: 1, margin: 1}))
            } else {
                load.text = "An error occured while obtaining data"
                load.fail();
            }
        });
        await browser.close();
        process.exit()
    }, 5000);
}