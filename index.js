const inquirer = require("inquirer");
const fs = require('fs');
const util = require("util");
const axios= require("axios");


// const writeFileAsync = util.promisify(fs.writeFile);


function init() {

 inquirer.prompt([
  // const questionsToUser= [

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
    choices: [
      "MIT", 
      "APACHE 2.0", 
      "BSD 3", 
      "None"
    ]
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
    message: "What does the user need to know about contributing to the project?"
  }
]).then(response => {
  let data = {
    username: response.username,
    title: response.title,
    description: response.description,
    license: response.license,
    dependencies: response.dependencies,
    test: response.test,
    usage: response.usage,
    contribution: response.contribution
  };
  console.log(data)
  let fileName = `README.md`
  // let fileName = `${data.title.toLowerCase().split(' ').join('')}.md`

  console.log(fileName);
  console.log(data.username);

  const queryURL ="https://api.github.com/users/" + data.username;
  console.log(queryURL);


  //====get the licence badge function==========================

  async function getLicenseBadge() {
    console.log(data.license);
    try {
      if(data.license === "MIT"){
        return "[![Github license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";
  
      };
      if (data.license === "APACHE 2.0"){
        return "[![Github license](https://img.shields.io/badge/License-Apache-2.svg)](https://opensource.org/licenses/Apache-2.0)";
  
      };
      if (data.license === "BSD 3"){
        return "[![Github license](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)";
  
      };
      if (data.license==="none"){
        return "[![[Github license](https://img.shields.io/badge/License-none.svg)";
      };
    }catch(error){
      console.log(error)
    }
  
  };

  //===call the badge function==========
  // getLicenseBadge(data.license);
  const licenseBanner= getLicenseBadge(data.license);

  //======get the github profile image==========

  async function getAvatar(){
    try{
  
      const response= await axios.get(queryURL);
      const avatarURL= await response.data.avatar_url; //double check 
      console.log(avatarURL);
    }catch(error) {
      console.log(error);
    }
  };

  //=====call avatar function

  getAvatar(queryURL);

//====create the file layout function=========

  function createREADME (data, licenseBanner){
  let layout=
    // the readme layout
    `# ${data.title}
  
    ${licenseBanner}
  
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
   
    ==================
    ${data.dependencies}
    ==================

    ## Usage
    
    ${data.usage}
  
    ## Collaborators or Third-Party Assets
    
    ${data.collaboration}
  
    ## License
    
    ${data.license}
  
    ## Tests

    To run tests, run the following command:
    
    ==================
    ${data.test}
    ==================

    ## Contribution
    
    ${data.contribution}

    ## Questions

    If you have any questions about the repo, open an issue or contact ${data.username} directly.`
  
   // ${avatarURL}
  
    console.log(data.title);

    fs.writeFile(fileName, layout, (err)=>{
        if(err) throw err;
        console.log('saved readme!')
        console.log(fileName);

        });
    };
     
  
  //======call the create function

createREADME(data, licenseBanner);



  });
};



init();

