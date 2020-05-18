#!/usr/bin/env node
import figlet from 'figlet';
import program from 'commander';
import { isValidUrl } from './utils';
import web_process from './web';

const lolcat = require("lolcatjs"); // does not have types implementation 
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
	.option('-m, --marking', 'get the point count for each question')
	.option('-w, --web', 'simulate browser in separate window')
	.action(function (url) {
		web_url = url;
	})
	.parse(process.argv);

if (web_url) {
	if (isValidUrl(web_url)) {
		web_process(web_url, program.debug, program.marking, program.web);
	}
} else {
		lolcat.fromString(figlet.textSync('edu-cli', { horizontalLayout: 'full' }))
		lolcat.fromString(`Version ${info.version} | Made by ${Object.keys(info.contributors).length > 0 ? `${info.contributors.join(", ")} and ` : ""}${info.author}\n`)
		program.help();
}
