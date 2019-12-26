const { PublicDocument } = require('./PublicDocument');

describe('PublicDocument', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocument({
      additionalInfo: 'something',
      additionalInfo2: 'something else',
      anotherThing: false,
      caseId: 'testing',
      createdAt: 'testing',
      documentId: 'testing',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      isPaper: true,
      processingStatus: 'testing',
      receivedAt: 'testing',
      servedAt: '2019-03-01T21:40:46.415Z',
      status: 'served',
    });

    expect(entity.toRawObject()).toEqual({
      additionalInfo: 'something',
      additionalInfo2: 'something else',
      caseId: 'testing',
      createdAt: 'testing',
      documentId: 'testing',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      isPaper: true,
      processingStatus: 'testing',
      receivedAt: 'testing',
      servedAt: '2019-03-01T21:40:46.415Z',
      status: 'served',
    });
  });
});
