# EduExam CLI
Web automation cli package used to get exam data. Written in node.js and typescript and mainly the pupeteer package.

[![npm](https://img.shields.io/npm/v/edu-exam-cli?color=green)](https://www.npmjs.com/package/edu-exam-cli)
[![Stable](https://github.com/lampask/educli/workflows/Stable/badge.svg?branch=master&event=push)](https://github.com/lampask/educli/actions?query=workflow%3AStable)
[![Develop](https://github.com/lampask/educli/workflows/Develop/badge.svg?branch=develop)](https://github.com/lampask/educli/actions?query=workflow%3ADevelop)
[![GitHub](https://img.shields.io/github/license/lampask/EduCli)](https://opensource.org/licenses/MIT)
## Installation
Install using node package manager: ```npm i -g edu-exam-cli```

## Usage
- `eduhack [options] <url>` where *url* is the adress of specific exam
- `-d, --debug` displays some debug information during the process
- `-w, --web` displays web simulation (pupeteer chromium window)
- `-m, --marking` tries to get individual markings for each question **(wip)**

After running the command the cli asks you for credentials to log in. Your personal data isn't collected or saved in any way or form, it's only used by web automation script to log into your account. Then the script navigates to specified url and extracts the data.

## Build from source
To build the package yourself:
1. clone package repository
2. install dependencies using `npm install` in project folder
3. build project using `npm run build`

*(you can also globally install it in one go using `npm run create`)*