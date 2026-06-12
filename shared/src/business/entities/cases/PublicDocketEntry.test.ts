import { INITIAL_DOCUMENT_TYPES, PARTIES_CODES } from '../EntityConstants';
import { PublicDocketEntry } from './PublicDocketEntry';

describe('PublicDocketEntry', () => {
  const mockFullEntry = {
    action: 'some action',
    additionalInfo: 'something',
    additionalInfo2: 'something else',
    affectedByDocketEntries: ['entry1'],
    affectedDocketEntries: ['entry2'],
    attachments: true,
    certificateOfService: true,
    certificateOfServiceDate: '2018-06-07',
    docketEntryId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
    docketNumber: '123-20',
    documentTitle: 'Test Document',
    documentType: 'testing',
    eventCode: 'O',
    filedBy: 'testing',
    filedByRole: 'docketclerk',
    filingDate: '2020-05-27T09:23:43.007Z',
    freeText: 'Some free text content',
    index: 5,
    isFileAttached: true,
    isLegacyServed: true,
    isOnDocketRecord: true,
    isPaper: true,
    isSealed: false,
    isStricken: false,
    judge: 'Judge Test',
    lodged: true,
    numberOfPages: 10,
    objections: 'Yes' as const,
    previousDocument: {
      docketEntryId: 'something else else',
      documentTitle: 'blah',
      documentType: 'fhqwhgads',
    },
    processingStatus: 'testing',
    receivedAt: '2020-05-27T09:23:43.007Z',
    sealedTo: 'Public' as const,
    servedAt: '2019-03-01T21:40:46.415Z',
    servedPartiesCode: PARTIES_CODES.BOTH,
    signedJudgeName: 'Judge Signed Name',
  };

  it('filters out unsupported fields and returns only expected fields', () => {
    const docketEntry = new PublicDocketEntry(mockFullEntry);

    expect(docketEntry.toRawObject()).toEqual({
      action: 'some action',
      additionalInfo: 'something',
      additionalInfo2: 'something else',
      affectedByDocketEntries: ['entry1'],
      affectedDocketEntries: ['entry2'],
      attachments: true,
      certificateOfService: true,
      certificateOfServiceDate: '2018-06-07',
      docketEntryId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
      docketNumber: '123-20',
      documentTitle: 'Test Document',
      documentType: 'testing',
      entityName: 'PublicDocketEntry',
      eventCode: 'O',
      filedBy: 'testing',
      filedByRole: 'docketclerk',
      filingDate: '2020-05-27T09:23:43.007Z',
      freeText: 'Some free text content',
      index: 5,
      isFileAttached: true,
      isLegacyServed: true,
      isOnDocketRecord: true,
      isPaper: true,
      isSealed: false,
      isStricken: false,
      judge: 'Judge Test',
      lodged: true,
      numberOfPages: 10,
      objections: 'Yes',
      previousDocument: {
        docketEntryId: 'something else else',
        documentTitle: 'blah',
        documentType: 'fhqwhgads',
      },
      processingStatus: 'testing',
      receivedAt: '2020-05-27T09:23:43.007Z',
      sealedTo: 'Public',
      servedAt: '2019-03-01T21:40:46.415Z',
      servedPartiesCode: 'B',
      signedJudgeName: 'Judge Signed Name',
    });
  });

  describe('isOnDocketRecord', () => {
    describe('minute entries', () => {
      it('creates a valid minute entry', () => {
        const docketEntry = new PublicDocketEntry({
          docketNumber: '101-21',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          filingDate: '2020-05-27T09:23:43.007Z',
          isOnDocketRecord: true,
          receivedAt: '2020-05-27T09:23:43.007Z',
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        });

        expect(docketEntry.isValid()).toBe(true);
      });
    });

    it('sets docket record related fields when document is on the docket record', () => {
      const docketEntry = new PublicDocketEntry({
        docketEntryId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
        docketNumber: '101-21',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filedBy: 'testing',
        filingDate: '2020-05-27T09:23:43.007Z',
        index: 1,
        isOnDocketRecord: true,
        isStricken: false,
        numberOfPages: null,
        receivedAt: '2020-05-27T09:23:43.007Z',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      });

      expect(docketEntry.validate().toRawObject()).toMatchObject({
        docketEntryId: 'e1d0b1c2-e531-4e07-ab82-851ee9acde64',
        docketNumber: '101-21',
        documentType:
          INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        filedBy: 'testing',
        filingDate: '2020-05-27T09:23:43.007Z',
        index: 1,
        isOnDocketRecord: true,
        isSealed: false,
        isStricken: false,
        receivedAt: '2020-05-27T09:23:43.007Z',
      });
    });
  });
});
