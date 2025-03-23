const fs = require('fs');
const path = require('path');
const AnswerUploadHandler = (req, res) => {
	if (req.uploadType === 'answer') {
		const jsonData = req.jsonData;

		// Define the file path
	    const tempDir = path.join(__dirname, '../temp');
	    const filePath = path.join(tempDir, 'answer_sheet.json');

	    // Ensure the temp directory exists
        if (!fs.existsSync(tempDir)) {
          	fs.mkdirSync(tempDir, { recursive: true });
        }

		// Remove the old question_sheet.json if it exists
		try {
			if (fs.existsSync(filePath)) {
		    	fs.unlinkSync(filePath); // Delete the existing file
			}

		  	// Save the new JSON data to temp/question_sheet.json
			fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
		  	// Redirect to /pdf/answer after successful save
			res.redirect('/pdf/answer');
		} catch (error) {
			res.render('index', {
				message: null,
				jsonData: null,
				error: `Failed to process JSON: ${error.message}`
			});
		}
	} else {
		res.render('index', { 
			message: null, 
			jsonData: null, 
			error: 'Please select a valid type (question or answer)' 
		});
	}
}

module.exports = AnswerUploadHandler
