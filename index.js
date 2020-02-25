const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");

inquirer.prompt([
    {
        type: "input",
        message: "Please enter your GitHub username:",
        name: "username"
    },
    {
        type: "input",
        message: "Please enter the title of your project:",
        name: "title"
    },
    {
        type: "input",
        message: "Write the project's description:",
        name: "description"
    },
    {
        type: "input",
        message: "Write the project's installation instructions:",
        name: "install"
    },
    {
        type: "input",
        message: "Write instructions and/or provide examples for this project's usage:",
        name: "usage"
    },
    {
        type: "list",
        message: "Please select a license for this project:",
        name: "license",
        choices: ["MIT License", "GNU General Public License v3.0", "ISC License", "Mozilla Public License 2.0", "Apache License 2.0"]
    },
    {
        type: "input",
        message: "Please add guidelines for other developers to contribute to your project:",
        name: "contributing"
    },
    {
        type: "input",
        message: "Write tests for your application and provide examples on how to run them:",
        name: "tests"
    },
    {
        type: "input",
        message: "Give information for developers to contact you for questions about your project:",
        name: "questions"
    }
]).then(response => {
    const url = `https://api.github.com/users/${response.username}?access_token=`
    const project = {
        title: response.title,
        description: response.description,
        install: response.install,
        usage: response.usage,
        license: response.license,
        contributing: response.contributing,
        tests: response.tests,
        questions: response.questions
    };
    
    axios.get(url).then(response => {
        project.email = response.data.email;
        project.avatar = response.data.avatar_url;

        fs.writeFile("newREADME.md", JSON.stringify(project, null, 2), error => {
            if(error){
                console.log(error);
            }
    
            console.log("Info saved");
        })
    })
});