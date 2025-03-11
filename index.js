const express = require('express');
const fs = require('fs').promises;
const path = require('node:path');
const ejs = require('ejs');

// const questionJSON = require('./data-question.json');
// const answerJSON = require('./data-answer.json');
// const QuestionPDF = require('./libs/PDFGenerator/QuestionPDF');
// const AnswerPDF = require('./libs/PDFGenerator/AnswerPDF');

const QuestionTemplate = require('./libs/PDFGenerator/QuestionTemplate');
const AnswerTemplate = require('./libs/PDFGenerator/AnswerTemplate');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.use("/fonts", express.static(path.join(__dirname, "public/fonts")));

app.get('/', (req, res, next) => {
	return res.render('index');
});

app.get('/test/question', (req, res, next) => {
	const qdoc = new QuestionPDF();
	// const qjsonPath = path.join(__dirname, 'data-question.json');
	// const qjson = JSON.parse(fs.readFileSync(qjsonPath), 'utf8');
	qdoc.setMetaData({
		title: `${questionJSON.testID} ${questionJSON.testName}`,
		author: '',
		subject: 'Question',
		keywords: '',
	});
	qdoc.setData(questionJSON);
	qdoc.generate(res);
});

app.get('/test/answer', (req, res, next) => {
	const adoc = new AnswerPDF();
	adoc.setMetaData({
		title: '',
		author: '',
		subject: 'AnswerSheet',
		keywords: ''
	})
	adoc.setData(answerJSON);
	adoc.generate(res);
})

app.get('/pdf/question', async (req, res) => {
	let embedData = '';

	// Import the question json file
	try {
		// const filePath = path.join(__dirname, 'data-question.json');
		const filePath = path.join(__dirname, 'sample-question-sheet.json');
	    const rawJSON = await fs.readFile(filePath, { encoding: 'utf-8'});
	    embedData = JSON.parse(rawJSON);
	} catch (err) {
		console.error('Error reading JSON file:', err);
		return res.status(500).json({ error: 'Failed to load data' });
	}

    const myquestionTemp = new QuestionTemplate();
    const data = {
    	title: embedData.testID,
    	embed: embedData
    };

    try {
        // Generate the PDF and get the buffer
    	const pdfBuffer = await myquestionTemp.createPDF(data);

        // Set headers for PDF response
    	res.set({
    		'Content-Type': 'application/pdf',
    		'Content-Disposition': 'inline; filename="generated.pdf"',
    		'Content-Length': pdfBuffer.length,
    	});

        // Send the PDF buffer
    	res.send(pdfBuffer);
    } catch (error) {
    	console.error('Error generating PDF:', error);
    	res.status(500).send('Error generating PDF');
    }
})

app.get('/pdf/answer', async (req, res) => {
	let embedData = '';

	// Import the question json file
	try {
		const filePath = path.join(__dirname, 'sample-answer-sheet.json');
		// const filePath = path.join(__dirname, 'data-answer.json');
	    const rawJSON = await fs.readFile(filePath, { encoding: 'utf-8'});
	    embedData = JSON.parse(rawJSON);
	} catch (err) {
		console.error('Error reading JSON file:', err);
		return res.status(500).json({ error: 'Failed to load data' });
	}

    const myquestionTemp = new AnswerTemplate();
    const data = {
    	title: embedData.testID+ '-' + embedData.testName,
    	embed: embedData
    };

    try {
        // Generate the PDF and get the buffer
    	const pdfBuffer = await myquestionTemp.createPDF(data);

        // Set headers for PDF response
    	res.set({
    		'Content-Type': 'application/pdf',
    		'Content-Disposition': 'inline; filename="generated.pdf"',
    		'Content-Length': pdfBuffer.length,
    	});

        // Send the PDF buffer
    	res.send(pdfBuffer);
    } catch (error) {
    	console.error('Error generating PDF:', error);
    	res.status(500).send('Error generating PDF');
    }
})


app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});
