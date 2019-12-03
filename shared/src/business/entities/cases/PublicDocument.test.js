const { PublicDocument } = require('./PublicDocument');

describe('PublicDocument', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocument({
      caseId: 'testing',
      createdAt: 'testing',
      documentId: 'testing',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      processingStatus: 'testing',
      receivedAt: 'testing',
    });

    expect(entity.toRawObject()).toEqual({
      caseId: 'testing',
      createdAt: 'testing',
      documentId: 'testing',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      processingStatus: 'testing',
      receivedAt: 'testing',
    });
  });
});
