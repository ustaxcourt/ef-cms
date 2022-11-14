const {
  getDocumentIdFromSQSMessage,
} = require('./getDocumentIdFromSQSMessage');

describe('getDocumentIdFromSQSMessage', () => {
  it('should retrieve s3 object key from message', () => {
    const mockS3ObjectKey = 'f2bfef68-0df7-421f-9f88-c95e16045e72';

    const result = getDocumentIdFromSQSMessage({
      Body: JSON.stringify({
        Records: [{ s3: { object: { key: mockS3ObjectKey } } }],
      }),
    });

    expect(result).toEqual(mockS3ObjectKey);
  });
});
