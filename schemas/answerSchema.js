const answerSchema = {
  type: 'object',
  properties: {
    testID: { type: 'string', minLength: 1 },
    testName: { type: 'string', minLength: 1 },
    mesechta: { type: 'string', minLength: 1 },
    sugyaID: { type: 'string', minLength: 1 },
    sugya: { type: 'string', minLength: 1 },
    students: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          studentID: { type: 'string', minLength: 1 },
          studentName: { type: 'string', minLength: 1 }
        },
        required: ['studentID', 'studentName'],
        additionalProperties: false
      },
      minItems: 1
    },
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['multipleChoice'] },
          isExtraCredit: { type: 'boolean' },
          answers: { type: 'integer', minimum: 2 }
        },
        required: ['type', 'isExtraCredit', 'answers'],
        additionalProperties: false
      },
      minItems: 1
    }
  },
  required: ['testID', 'testName', 'mesechta', 'sugyaID', 'sugya', 'students', 'questions'],
  additionalProperties: false
};

module.exports = answerSchema;
