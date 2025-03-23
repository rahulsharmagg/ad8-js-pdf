const Ajv = require('ajv');
const questionSchema = require('../schemas/questionSchema');
const answerSchema = require('../schemas/answerSchema');

const ajv = new Ajv({ allErrors: true });

// Middleware to check file and validate JSON
const checkFileMiddleware = (req, res, next) => {
  if (!req.files || !req.files.jsonFile) {
    return res.render('index', { 
      message: null,
      jsonData: null, 
      error: 'No file uploaded' 
    });
  }

  const jsonFile = req.files.jsonFile;
  
  if (jsonFile.mimetype !== 'application/json') {
    return res.render('index', { 
      message: null, 
      jsonData: null, 
      error: 'Please upload a JSON file' 
    });
  }

  try {
    const jsonData = JSON.parse(jsonFile.data.toString());
    req.jsonData = jsonData;
    req.uploadType = req.body.type;

    // Validate based on type
    if (req.uploadType === 'question') {
      const validate = ajv.compile(questionSchema);
      const valid = validate(jsonData);
      if (!valid) {
        const errors = validate.errors.map(err => `${err.instancePath || 'root'} ${err.message}`).join(', ');
        return res.render('index', { 
          message: null, 
          jsonData: null, 
          error: `Invalid Question JSON: ${errors}` 
        });
      }
    } else if (req.uploadType === 'answer') {
      const validate = ajv.compile(answerSchema);
      const valid = validate(jsonData);
      if (!valid) {
        const errors = validate.errors.map(err => `${err.instancePath || 'root'} ${err.message}`).join(', ');
        return res.render('index', { 
          message: null, 
          jsonData: null, 
          error: `Invalid Answer JSON: ${errors}` 
        });
      }
    } else {
      return res.render('index', { 
        message: null, 
        jsonData: null, 
        error: 'Please select a valid type (question or answer)' 
      });
    }

    next();
  } catch (error) {
    res.render('index', { 
      message: null, 
      jsonData: null, 
      error: 'Invalid JSON format: ' + error.message 
    });
  }
};

module.exports = checkFileMiddleware;
