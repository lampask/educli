import readline from "readline";
import chalk from "chalk";

const url_pattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
  "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
  "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
  "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
  "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
); // fragment locator

const edupage_pattern = new RegExp(
  "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]edupage+).(org)?(/.*)?$"
);

export function is_valid_url(url: string): boolean {
  if (url_pattern.test(url)) {
    if (edupage_pattern.test(url)) {
      return true;
    } else {
      console.log("The provided url is not valid edupage url.");
    }
  } else {
    console.log("Invalid url address provided.");
  }
  return false;
}

interface Credentials {
  username: string;
  password: string;
}
const question = (str: string): Promise<string> =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(str, (data) => {
      rl.close();
      resolve(data);
    });
  });

// TODO: Finish hidden writable
const hidden_question = (str: string): Promise<string> => question(str);

export async function get_access_crdentials(): Promise<Credentials> {
  const pack: Credentials = {
    username: "NaN",
    password: "NaN",
  };

  pack.username = await question(chalk.cyan("Username: "));
  pack.password = await hidden_question(chalk.cyan("Password: "));

  return pack;
}

export interface CardHolderModel {
  id?: CardModel;
}

export interface CardModel {
  description?: string;
}
