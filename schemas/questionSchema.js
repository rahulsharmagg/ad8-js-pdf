const questionSchema = {
  type: 'object',
  properties: {
    testID: { type: 'string', minLength: 1 },
    testName: { type: 'string', minLength: 1 },
    mesechta: { type: 'string', minLength: 1 },
    sugyaID: { type: 'string', minLength: 1 },
    sugya: { type: 'string', minLength: 1 },
    blocks: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['text'] },
              content: { type: 'string', minLength: 1 }
            },
            required: ['type', 'content'],
            additionalProperties: false
          },
          {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['multipleChoiceQuestion'] },
              isExtraCredit: { type: 'boolean' },
              question: { type: 'string', minLength: 1 },
              answers: {
                type: 'array',
                items: { type: 'string', minLength: 1 },
                minItems: 2
              }
            },
            required: ['type', 'isExtraCredit', 'question', 'answers'],
            additionalProperties: false
          }
        ]
      },
      minItems: 1
    }
  },
  required: ['testID', 'testName', 'mesechta', 'sugyaID', 'sugya', 'blocks'],
  additionalProperties: false
};

module.exports = questionSchema;
