const { INITIAL_DOCUMENT_TYPES } = require('../EntityConstants');
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

  describe('minute entries', () => {
    it('creates minute entry', () => {
      const document = new PublicDocument({
        description: 'Request for Place of Trial at Flavortown, TN',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        isMinuteEntry: true,
        isOnDocketRecord: true,
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      });

      expect(document.isValid()).toBe(true);
    });
  });
});
