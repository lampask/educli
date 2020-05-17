#!/usr/bin/env node
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';
import isValidUrl from './utils';
import web_process from './web';

const lolcat = require("lolcatjs");
const info = require('../package.json');

// SETUP
lolcat.options.seed = Math.round(Math.random() * 1000);
lolcat.options.colors = true;
var web_url;

program
  .version(info.version)
  .arguments('[url]')
  .usage('[options] <url>')
  .description(info.description)
  .option('-d, --debug', 'run in debug mode')
  .option('-p, --page', 'generate test page with questions and answers')
  .option('-m, --marking', 'get the point count for each question')
  .action(function (url) {
    web_url = url;
  })
  .parse(process.argv);

  if (web_url) {
    if (isValidUrl(web_url)) {
        web_process(web_url, program.debug);
    }
} else {
    lolcat.fromString(figlet.textSync('edu-cli', { horizontalLayout: 'full' }))
    lolcat.fromString(`Version ${info.version} | Made by ${Object.keys(info.contributors).length > 0 ? `${info.contributors.join(", ")} and ` : ""}${info.author}\n`)
    program.help();
}