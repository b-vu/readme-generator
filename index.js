const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const promptUser = async () =>{
    try{
        const answers = await inquirer.prompt([
            {
                type: "input",
                message: "Please enter your full name:",
                name: "name"
            },
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
                choices: ["MIT License", "ISC License"]
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
                message: "Please link credits to any collaborators, third-party assets, or tutorials used in this project:",
                name: "credits"
            }
        ])

        answers.license = generateLicense(answers, answers.license);

        const github = await axios.get(`https://api.github.com/users/${answers.username}/events/public`);

        const readmeFile = generateReadMe(answers, github.data[0].payload.commits[0].author.email, github.data[0].actor.avatar_url);

        await writeFileAsync(`${answers.title}.md`, readmeFile, "utf8");
    }
    catch(error){
        console.log(error);
    }
};

const generateReadMe = (answers, email, avatar) => {
    return `# ${answers.title}

## Description
    
${answers.description}
    
## Table of Contents
    
* [Installation](#installation)
* [Usage](#usage)
* [Tests](#tests)
* [Badges](#badges)
* [License](#license)
* [Contributing](#contributing)
* [Credits](#credits)
* [Questions](#questions)
    
## Installation
    
${answers.install}
    
## Usage
    
${answers.usage}
    
## Tests
    
${answers.tests}

## Badges


    
## License
    
${answers.license}
        
## Contributing
    
${answers.contributing}
    
## Credits
    
${answers.credits}
    
## Questions
![GitHub avatar](${avatar})

For additional questions, please contact me at ${email}.`
};

const generateLicense = (answers, license) => {
    switch(license){
        case "MIT License":
            return `MIT License

Copyright (c) 2020 ${answers.name}
            
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
            
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
            
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

        case "ISC License":
            return `ISC License

Copyright (c) 2020, ${answers.name}
            
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
            
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`
    }
};

promptUser();