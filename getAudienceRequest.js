require('dotenv').config(); // Load environment variables
const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs'); // Importing the fs module
const path = require('path'); // To handle file paths

// Access the sourceSpaceId and API key from the .env file
const sourceSpaceId = process.env.SOURCE_SPACE_ID;
const bearerToken = process.env.SOURCE_BEARER_TOKEN;
console.log(sourceSpaceId);
console.log(bearerToken);
// Construct the API URL with sourceSpaceId
const apiUrl = `https://api.segmentapis.com/spaces/${sourceSpaceId}/audiences`;
console.log(apiUrl);

// Function to process and save a filtered JSON response with pagination
async function sendGetRequest() {
    try {
        console.log(chalk.blue('Sending GET request to API...'));

        let allAudiences = [];
        let cursor = null;
        let page = 1;

        do {
            // Build URL with pagination parameters
            let url = `${apiUrl}?pagination.count=100`;
            if (cursor) {
                url += `&pagination.cursor=${encodeURIComponent(cursor)}`;
            }

            console.log(chalk.blue(`Fetching page ${page}...`));
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                }
            });

            // Extract audiences and add to the list
            const audiences = response.data.data.audiences || [];
            allAudiences = allAudiences.concat(audiences);

            // Get next cursor if present
            cursor = response.data.data.pagination?.next || null;
            page++;
        } while (cursor);

        console.log(chalk.green(`Fetched ${allAudiences.length} audiences in total.`));

        // Process the audiences data to extract only relevant fields
        const processedData = processJson(allAudiences);

        // Define output directory and file path
        const outputDir = path.join(__dirname, 'output');
        const fileName = 'filteredAudienceResponse.json';
        const filePath = path.join(outputDir, fileName);

        // Check if the output directory exists, if not, create it
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(chalk.yellow('Output directory created.'));
        }

        // Writing the processed data to a JSON file inside the output folder
        fs.writeFile(filePath, JSON.stringify(processedData, null, 2), (err) => {
            if (err) {
                console.error(chalk.red('Error writing to file:'));
                console.error(err.message);
            } else {
                console.log(chalk.green(`Processed data successfully saved to ${filePath}`));
            }
        });
    } catch (error) {
        // Error handling
        console.error(chalk.red('Error occurred while sending GET request:'));
        console.error(error.message);
    }
}

// Function to process and filter the JSON response data
function processJson(audiences) {
    // Loop through the audiences array and extract relevant fields
    return audiences.map(item => ({
        name: item.name,
        id: item.id,
        description: item.description,
        definition: {
            query: item.definition.query,
            type: item.definition.type
        },
        options: item.options
    }));
}

// Run the function
sendGetRequest();
