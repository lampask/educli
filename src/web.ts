import puppeteer from "puppeteer";
import { get_access_crdentials, CardHolderModel } from "./utils";

// Design
import ora from "ora";
import chalk from "chalk";
import boxen from "boxen";

export default async function (
  url: string,
  debug: boolean,
  marking: boolean,
  web: boolean,
  timeout: string
): Promise<void> {
  let load = ora("Setting up").start();

  const browser = await puppeteer.launch({
    headless: !web,
    dumpio: debug,
  });
  const page = (await browser.pages())[0];

  await page.goto(url);

  load.text = "All set up";
  load.succeed();

  //Step 1 - Login
  await page.title().then(async (title) => {
    if (title.includes("Prihlásenie")) {
      console.log("- Attempting to log in.");
      const creds_pack = await get_access_crdentials();

      load = ora("Logging in").start();
      await page.type("#login_Login_1e1", creds_pack.username);
      await page.type("#login_Login_1e2", creds_pack.password);
      await page.click(".skgdFormSubmit");
    }
  });

  await page.waitFor(parseInt(timeout) / 2);

  //Step 2 - Check logged status
  let success = false;
  await page.title().then(async (title) => {
    if (title.includes("Prihlásenie")) {
      load.text = "Logging process failed.";
      load.fail();
      process.exit();
    } else {
      load.text = "Sucessfully logged in.";
      load.succeed();
      success = true;
    }
  });

  if (!success) {
    await browser.close();
    process.exit();
  }

  load = ora("Obtaining data").start();

  //Step 3 - Obtain data

  await page.goto(url);
  //await page.waitForNavigation();

  load.text = "Waiting for contents to load";
  await page.waitFor(parseInt(timeout));

  let exam_data: CardHolderModel = {};
  await page.evaluate("ETestUtils.cardsData").then((data) => {
    if (data !== {} || typeof data == "object") {
      load.text = "Data obtained";
      load.succeed();
      exam_data = data as Record<string, any>;

      // Step 4 - Process the data
      let i = 0;
      let message = "";
      Object.values(exam_data).forEach((card_data) => {
        message += chalk.red(`Test Question ${++i}`);
        const formatted_output = card_data.description;
        message += formatted_output.replace(
          "aid",
          chalk.green("Correct answer is: ")
        );
        card_data.content.widgets.forEach((widget: any) => {
          if (widget.widgetClass === "ConnectAnswerETestWidget") {
            widget.props.pairs.forEach((pair: any) => {
              message += chalk.green(
                `${pair.l.replace(/(<([^>]+)>)/gi, "")} <=> ${pair.r.replace(
                  /(<([^>]+)>)/gi,
                  ""
                )} \n`
              );
            });
          }
        });
        message +=
          i < Object.keys(exam_data).length
            ? "---------------------------\n"
            : "";
      });
      console.log(boxen(message, { padding: 1, margin: 1 }));
    } else {
      load.text = "An error occured while obtaining data";
      load.fail();
    }
  });
  await browser.close();
  process.exit();
}
