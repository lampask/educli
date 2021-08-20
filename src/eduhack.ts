#!/usr/bin/env node
import figlet from "figlet";
import program from "commander";
import { is_valid_url } from "./utils";
import web_process from "./web";
import info from "../package.json";

const lolcat = require("lolcatjs"); // does not have types implementation

// SETUP
lolcat.options.seed = Math.round(Math.random() * 1000);
lolcat.options.colors = true;
let web_url;

program
  .version(info.version)
  .arguments("[url]")
  .usage("[options] <url>")
  .description(info.description)
  .option("-d, --debug", "run in debug mode")
  .option("-m, --marking", "get the point count for each question")
  .option("-w, --web", "simulate browser in separate window")
  .option(
    "-t, --timeout [ms]",
    "modify default waiting time in ms for content loading",
    "3000"
  )
  .action(function (url) {
    web_url = url;
  })
  .parse(process.argv);

if (web_url) {
  if (is_valid_url(web_url)) {
    web_process(
      web_url,
      program.debug,
      program.marking,
      program.web,
      program.timeout
    );
  }
} else {
  lolcat.fromString(figlet.textSync("edu-cli", { horizontalLayout: "full" }));
  lolcat.fromString(
    `Version ${info.version} | Made by ${
      Object.keys(info.contributors).length > 0
        ? `${info.contributors.join(", ")} and `
        : ""
    }${info.author}\n`
  );
  program.help();
}
