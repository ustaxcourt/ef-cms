const { INITIAL_DOCUMENT_TYPES } = require('../EntityConstants');
const { PublicDocketEntry } = require('./PublicDocketEntry');

describe('PublicDocketEntry', () => {
  it('should only have expected fields', () => {
    const entity = new PublicDocketEntry({
      additionalInfo: 'something',
      additionalInfo2: 'something else',
      anotherThing: false,
      createdAt: 'testing',
      docketEntryId: 'testing',
      docketNumber: '123-20',
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
      docketEntryId: 'testing',
      docketNumber: '123-20',
      documentType: 'testing',
      eventCode: 'testing',
      filedBy: 'testing',
      isPaper: true,
      processingStatus: 'testing',
      receivedAt: 'testing',
      servedAt: '2019-03-01T21:40:46.415Z',
    });
  });

  describe('isOnDocketRecord', () => {
    describe('minute entries', () => {
      it('creates minute entry', () => {
        const document = new PublicDocketEntry({
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

    it('sets docket record related fields if a document is on the docket record', () => {
      const entity = new PublicDocketEntry({
        docketEntryId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filedBy: 'testing',
        filingDate: '2020-05-27T09:23:43.007Z',
        index: 1,
        isMinuteEntry: true,
        isOnDocketRecord: true,
        isStricken: false,
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      });

      expect(entity.validate().toRawObject()).toMatchObject({
        docketEntryId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        filedBy: 'testing',
        filingDate: '2020-05-27T09:23:43.007Z',
        index: 1,
        isOnDocketRecord: true,
        isStricken: false,
      });
    });
  });
});
