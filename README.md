This repository provides automation scripts to manage Twilio Engage Audiences. Details about the scripts are as follows:

1. getAudienceRequest.js : This file contains the logic to automate the retrieval of audiences from a Twilio Engage Space and the storage of the audience definition into a file called filteredAudienceResponse.json. The file is located inside the output folder and it has the audience definitions stored in a JSON array. As the name suggest this is not the complete Audience definition as retrieved from the API request but instead a filtered file where only those properties are persisted that are required to create the Audiences via a POST request. To run this file simply use the following command in the terminal:
						--> node getAudienceRequest.js

2. createAudienceRequest.js : This file contains the logic to automate the creation of audiences in a Twilio Engage Space. The script looks for a file named filteredAudienceResponse.json inside the output folder and then works through the audience array to send POST requests to the Engage Space that you specify in the postApiUrl variable. To run this file simply use the following command in the terminal: 
						--> node createAudienceRequest.js

