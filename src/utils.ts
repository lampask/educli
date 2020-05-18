import readline from 'readline';
import chalk from 'chalk';
import { Writable } from 'stream';

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator


export function isValidUrl(url: string) {
    if (!!pattern.test(url)) {
        if (url.includes('edupage')) {
            return true;
        } else {
            console.log("The provided url is not valid edupage url.")
        }
    } else {
        console.log("Invalid url address provided.")
    }
    return false;
}

interface Credentials {
    username: string;
    password: string;
}
const question = (str: string): Promise<string> => new Promise(resolve => rl.question(str, resolve));
const hiddenQuestion = (str: string): Promise<string> => new Promise((resolve, reject) => {
    rl.question(str, value => {
        rl.addListener("line", (data) => {
            process.stdout.clearLine(-1);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(str + Array(rl.line.length + 1).join('*'));
        });
      resolve(value);
    });
  });


export async function getAccessCrdentials(): Promise<Credentials> {
    return await new Promise(async (resolve, reject) => {
        let pack:Credentials = {
            username: "NaN",
            password: "NaN",
        };
        pack.username = await question(chalk.cyan("Username: "));
        pack.password = await hiddenQuestion(chalk.cyan("Password: "));
        resolve(pack);
    })
}

export interface CardHolderModel {
    id?: CardModel;
}

export interface CardModel {
    description?: string;
}