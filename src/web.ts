import puppeteer from 'puppeteer';
import ora from 'ora';
import { getAccessCrdentials } from './utils';

export default async function(url: string, debug: boolean) {
    var load = ora("Setting up").start();

    const browser = await puppeteer.launch({headless: false});
    const page = (await browser.pages())[0];

    await page.goto(url);

    load.text = "All set up";
    load.succeed();
    
    //Step 1 - Login
    await page.title().then(async (title) => {
        console.log(title);
        if (title.includes("Prihlásenie")) {
            console.log("Attempting to log in.");
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
    await page.waitForNavigation();
    
    load.text = "Waiting for contents to load"
    var exam_data: Array<Object> = [];

    setTimeout(async() => {
        await page.evaluate('ETestUtils.cardsData').then((data) => {
            if (data !== {} || data != null) {
                load.text = "Data obtained"
                load.succeed();
                exam_data = data as Array<Object>; 
            }
        });
    }, 2000);
    
    // Step 4 - Process the data
    exam_data.forEach(element => {
        //TODO
    });
    
    //await browser.close();
}