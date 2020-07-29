const { PublicDocument } = require('./PublicDocument');

describe('PublicDocument', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocument({
      additionalInfo: 'something',
      additionalInfo2: 'something else',
      anotherThing: false,
      createdAt: 'testing',
      docketNumber: '123-20',
      documentId: 'testing',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      isPaper: true,
      processingStatus: 'testing',
      receivedAt: 'testing',
      servedAt: '2019-03-01T21:40:46.415Z',
    });

    expect(entity.toRawObject()).toEqual({
      additionalInfo: 'something',
      additionalInfo2: 'something else',
      createdAt: 'testing',
      docketNumber: '123-20',
      documentId: 'testing',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      isPaper: true,
      processingStatus: 'testing',
      receivedAt: 'testing',
      servedAt: '2019-03-01T21:40:46.415Z',
    });
  });
});
