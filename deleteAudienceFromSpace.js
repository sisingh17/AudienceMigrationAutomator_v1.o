require('dotenv').config(); // Load environment variables
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const destinationSpaceId = process.env.DELETE_AUDIENCE_FROM_SPACE_ID;
const bearerToken = process.env.DELETE_AUDIENCE_BEARER_TOKEN;

// Function to delay execution for a given number of milliseconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to read the JSON file and send DELETE requests for each item
async function sendDeleteRequests() {
    try {
        // Read the filtered audience data from the JSON file
        const filePath = path.join(__dirname, 'output', 'filteredAudienceResponse.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const audienceData = JSON.parse(fileData);

        // Loop through the audienceData array and send DELETE requests for each item
        for (const audience of audienceData) {
            const { id, name } = audience; // Destructure to get id and name

            console.log(chalk.red(`Sending DELETE request for audience: ${name} / ID: ${id}`));
            const deleteApiUrl = `https://api.segmentapis.com/spaces/${destinationSpaceId}/audiences/${id}`;

            try {
                const response = await axios.delete(deleteApiUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearerToken}`, // If required
                    }
                });

                // Log the successful response for each request
                console.log(chalk.green(`DELETE request successful for: ${name} / ID: ${id}`));
            } catch (postError) {
                // Simple error logging
                console.error(chalk.red(`Error during DELETE request for audience: ${name} / ID: ${id}`));
                console.error(chalk.red(`Error message: ${postError.message}`));
            }

            // Throttle requests to 18rpm (1 request every ~3333ms)
            await delay(3333); // 3333ms = 3.33 seconds
        }
    } catch (error) {
        // General error handling for reading the file or parsing the JSON
        console.error(chalk.red('Error occurred while reading the JSON file or sending requests:'));
        console.error(error.message);
    }
}

// Run the function
sendDeleteRequests();
