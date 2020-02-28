const inquirer = require("inquirer");
const fs = require("fs");
// const util = require("util");
const axios = require("axios");

// const writeFileAsync = util.promisify(fs.writeFile);
//
init();
function init() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "What is your Github username?"
      },
      {
        type: "input",
        name: "title",
        message: "What is the title of your project?"
      },
      {
        type: "input",
        name: "description",
        message: "Please write a short description of your project!"
      },
      {
        type: "list",
        message: "What kind of license should your project have?",
        name: "license",
        choices: ["MIT", "APACHE 2.0", "BSD 3", "None"]
      },
      {
        type: "input",
        name: "dependencies",
        message: "What command should be run to install dependencies?",
        default: "npm i"
      },
      {
        type: "input",
        name: "test",
        message: "What command should be run to run tests?",
        default: "npm test"
      },
      {
        type: "input",
        name: "usage",
        message: "What does the user need to know to use the application?"
      },
      {
        type: "input",
        name: "collaboration",
        message: "Name all collaborators and third-party assets!"
      },
      {
        type: "input",
        name: "contribution",
        message:
          "What does the user need to know about contributing to the project?"
      }
    ])
    .then(response => {
      const data = {
        username: response.username,
        title: response.title,
        description: response.description,
        license: response.license,
        dependencies: response.dependencies,
        test: response.test,
        usage: response.usage,
        contribution: response.contribution
      };

      return data;
    })
    .then(data => {
      //======call the badge function==========
      data.licenseBanner = getLicenseBadge(data.license);
      
      //=====call avatar function
      data.avatar = getAvatar(data.username)


      //======call the create function
      createREADME(data);


      return data;
    })
    .then(data => {
      console.log(data);
    });
}

//====get the licence badge function==========================
function getLicenseBadge(license) {
  try {
    if (license === "MIT") {
      return "![Github license](https://img.shields.io/badge/License-MIT-yellow.svg)"; //(https://opensource.org/licenses/MIT)
    }
    if (license === "APACHE 2.0") {
      return "![Github license](https://img.shields.io/badge/License-Apache-2.svg)"; //(https://opensource.org/licenses/Apache-2.0)
    }
    if (license === "BSD 3") {
      return "![Github license](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)"; //(https://opensource.org/licenses/BSD-3-Clause)
    }
    if (license === "none") {
      return "![[Github license](https://img.shields.io/badge/License-none.svg)";
    }
  } catch (error) {
    console.log(error);
  }
}

//======get the github profile image==========
async function getAvatar(username) {
  const queryURL = "https://api.github.com/users/" + username;
  try {
    const response = await axios.get(queryURL);
    return response.data.avatar_url;
  } catch (error) {
    console.log(error);
  }
}

//====create the file layout function=========

function createREADME(data) {
  const fileName = `README.md`;
  let layout =
    // the readme layout
    `# ${data.title}

${data.licenseBanner}

## Description

${data.description}

## Table of Content

*[Installation](#installation)

*[Usage](#usage)

*[Credits](#credits)

*[License](#license)

*[Tests](#tests)

*[Contributing](#contributing)

## Installation

To install the necessary dependencies, run the following command:


${data.dependencies}


## Usage

${data.usage}

## Collaborators or Third-Party Assets

${data.collaboration}

## License

${data.license}

## Tests

To run tests, run the following command:


${data.test}


## Contribution

${data.contribution}

## Questions

If you have any questions about the repo, open an issue or contact ${data.username} directly.

${data.avatar}`;

  console.log(data.title);

  fs.writeFile(fileName, layout, err => {
    if (err) throw err;
    console.log("saved readme!");
    console.log(fileName);
  });
}

