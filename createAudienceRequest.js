require('dotenv').config(); // Load environment variables
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const destinationSpaceId = process.env.DESTINATION_SPACE_ID;
const bearerToken = process.env.DESTINATION_BEARER_TOKEN;
// API URL for the POST request
const postApiUrl = `https://api.segmentapis.com/spaces/${destinationSpaceId}/audiences`;

// Function to delay execution for a given number of milliseconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to read the JSON file and send POST requests for each item
async function sendPostRequests() {
    try {
        // Read the filtered audience data from the JSON file
        const filePath = path.join(__dirname, 'output', 'filteredAudienceResponse.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const audienceData = JSON.parse(fileData);

        // Loop through the audienceData array and send POST requests for each item
        for (const audience of audienceData) {
            // Remove id and audience id from the audience object
            const { id, spaceId, ...audienceWithoutId } = audience; // Destructure to remove id and spaceId

            // Check if the query contains the keyword 'entity' or if the description is empty
            if (audienceWithoutId.definition.query.includes('entity') || audienceWithoutId.description === "") {
                const skipReason = audienceWithoutId.description === "" 
                    ? "has an empty description" 
                    : "contains 'entity' in query";
                console.log(chalk.yellow(`Skipping audience: ${audienceWithoutId.name} (${skipReason})`));
                continue; // Skip this audience and move to the next one
            }

            console.log(chalk.blue(`Sending POST request for: ${audienceWithoutId.name}`));

            try {
                const response = await axios.post(postApiUrl, audienceWithoutId, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${bearerToken}`, // If required
                    }
                });

                // Log the successful response for each request
                console.log(chalk.green(`POST request successful for: ${audienceWithoutId.name}`));
            } catch (postError) {
                // Simple error logging
                console.error(chalk.red(`Error during POST request for audience: ${audienceWithoutId.name}`));
                console.error(chalk.red(`Error message: ${postError.message}`));
            }

            // Throttle requests to 10rpm (1 request every 6 seconds)
            await delay(6000); // 6000ms = 6 seconds
        }
    } catch (error) {
        // General error handling for reading the file or parsing the JSON
        console.error(chalk.red('Error occurred while reading the JSON file or sending requests:'));
        console.error(error.message);
    }
}

// Run the function
sendPostRequests();
