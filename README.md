# Audience Migration Automator v1.0
This repository provides automation scripts to manage Twilio Engage Audiences.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## installation

Download the Node Installer:

Visit the [Node.js download page](https://nodejs.org/en) and download the macOS version (LTS recommended).

Run the Installer:

Open the downloaded .pkg file.
Follow the prompts to install Node.js.

Verify Installation:

Open Terminal.

Type node -v and press Enter to confirm the Node.js installation.

Install Project: 

To install the Audience Migration Automator simply clone this repo locally and run the below command:

```bash
$ npm install
```
## usage

This project has 2 primary scripts:

1. getAudienceRequest.js :This script automates the retrieval of audiences from a Twilio Engage Space and its storage into a file called filteredAudienceResponse.json. The file is located inside the output folder and it has the audience definitions stored in a JSON array. As the name suggest this is not the complete Audience definition as retrieved from the API request but instead a filtered file where only those properties are persisted that are required to create the Audiences via a POST request. To run this file simply use the following command in the terminal:

```bash
$ node getAudienceRequest.js
```
2. createAudienceRequest.js : This script automates the creation of audiences in a Twilio Engage Space. The script looks for a file named filteredAudienceResponse.json inside the output folder and then works through the audience array to send POST requests to the Engage Space that you specify in the postApiUrl variable. To run this file simply use the following command in the terminal: 

```bash
$ node createAudienceRequest.js
```

## license
This project is licensed under the [MIT License](LICENSE).