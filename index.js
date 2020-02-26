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
                message: "Please enter the name of your GitHub repository:",
                name: "repo"
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
                choices: ["MIT License", "ISC License", "GNU General Public License v3.0", "Apache License 2.0"]
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

        console.log("Your README file has been generated.")
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

![Dependencies Check](https://img.shields.io/david/${answers.username}/${answers.repo}?style=flat-square)
![Repository Size](https://img.shields.io/github/repo-size/${answers.username}/${answers.repo})
![Top Repository Language](https://img.shields.io/github/languages/top/${answers.username}/${answers.repo}?style=flat-square)
    
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

        case "GNU General Public License v3.0":
            return `Copyright (C) 2020  ${answers.name}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
        
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
        
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`

        case "Apache License 2.0":
            return `Copyright 2020 ${answers.name}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`
    }
};

promptUser();