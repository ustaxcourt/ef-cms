const {
  A_VALID_DOCKET_ENTRY,
  MOCK_PETITIONERS,
  mockPrimaryId,
  mockSecondaryId,
} = require('./DocketEntry.test');

const {
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OPINION_DOCUMENT_TYPES,
  ORDER_TYPES,
  TRANSCRIPT_EVENT_CODE,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('validate', () => {
  const mockUserId = applicationContext.getUniqueId();

  it('should do nothing if valid', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentContents: 'this is the content of the document',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );
    docketEntry.docketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    docketEntry.validate();

    expect(docketEntry.documentContents).not.toBeDefined();
    expect(docketEntry.isValid()).toBeTruthy();
  });

  it('should be invalid if filedBy is undefined, filers is valid, and servedAt is populated', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        filedBy: undefined,
        filers: [mockPrimaryId, mockSecondaryId],
        isLegacyServed: undefined,
        servedAt: '2019-08-25T05:00:00.000Z',
        servedParties: [{ name: 'Test Petitioner' }],
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(Object.keys(docketEntry.getFormattedValidationErrors())).toEqual([
      'filedBy',
    ]);
  });

  it('should throw an error on invalid docket entries', () => {
    expect(() => {
      new DocketEntry({}, { applicationContext }).validate();
    }).toThrow('The DocketEntry entity was invalid');
  });

  it('should not throw an error on valid court-issued docket entry with null filedBy string', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle:
          'ORDER THAT PETR. BY 4/18/19 FILE, UNDER SEAL, A RESPONSE TO THIS ORDER AS STATED HEREIN.',
        documentType: 'Order',
        eventCode: 'O',
        filedBy: null,
        signedAt: 'Not in Blackstone',
        signedByUserId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
        signedJudgeName: 'Mock Signed Judge',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    ).validate();
    expect(docketEntry.isValid()).toBeTruthy();
  });

  it('should not throw an error on valid court-issued docket entry with empty filedBy string', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentTitle:
          'ORDER THAT PETR. BY 4/18/19 FILE, UNDER SEAL, A RESPONSE TO THIS ORDER AS STATED HEREIN.',
        documentType: 'Order',
        eventCode: 'O',
        filedBy: '',
        signedAt: 'Not in Blackstone',
        signedByUserId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
        signedJudgeName: 'Mock Signed Judge',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    ).validate();
    expect(docketEntry.isValid()).toBeTruthy();
  });

  describe('handling of sealed legacy documents', () => {
    it('should pass validation when "isLegacySealed", "isLegacy", and "isSealed" are undefined', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should fail validation when "isLegacySealed" is true but "isLegacy" and "isSealed" are undefined', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          isLegacySealed: true,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeFalsy();
      expect(docketEntry.getFormattedValidationErrors()).toMatchObject({
        isLegacy: '"isLegacy" is required',
        isSealed: '"isSealed" is required',
      });
    });

    it('should pass validation when "isLegacy" is true, "isLegacySealed" is true, "isSealed" is true', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'O',
          isLegacy: true,
          isLegacySealed: true,
          isSealed: true,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: 'cb42b552-c112-49f4-b7ef-2b0e20ca8e57',
          signedJudgeName: 'A Judge',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should pass validation when "isLegacySealed" is false, "isSealed" and "isLegacy" are undefined', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'O',
          isLegacySealed: false,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: 'cb42b552-c112-49f4-b7ef-2b0e20ca8e57',
          signedJudgeName: 'A Judge',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeTruthy();
    });
  });

  describe('filedBy scenarios', () => {
    describe('documentType is not in the list of documents that require filedBy', () => {
      it('should pass validation when filedBy is undefined', () => {
        const internalDocketEntry = new DocketEntry(
          { ...A_VALID_DOCKET_ENTRY, documentType: 'Petition' },
          { applicationContext, petitioners: MOCK_PETITIONERS },
        );

        expect(internalDocketEntry.isValid()).toBeTruthy();
      });
    });

    describe('documentType is in the list of documents that require filedBy', () => {
      describe('external filing events', () => {
        describe('that are not autogenerated', () => {
          it('should fail validation when "filedBy" is not provided', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: EXTERNAL_DOCUMENT_TYPES[0],
                eventCode: TRANSCRIPT_EVENT_CODE,
                filedBy: undefined,
                filers: [],
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );
            expect(docketEntry.isValid()).toBeFalsy();
            expect(docketEntry.filedBy).toBeUndefined();
          });

          it('should pass validation when "filedBy" is provided', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: EXTERNAL_DOCUMENT_TYPES[0],
                eventCode: TRANSCRIPT_EVENT_CODE,
                filedBy: 'Test Petitioner1',
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.isValid()).toBeTruthy();
          });
        });

        describe('that are autogenerated', () => {
          it('should pass validation when "isAutoGenerated" is true and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
                isAutoGenerated: true,
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.filedBy).toBeUndefined();
            expect(docketEntry.isValid()).toBeTruthy();
          });

          it('should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.filedBy).toBeUndefined();
            expect(docketEntry.isValid()).toBeTruthy();
          });

          it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
                isAutoGenerated: false,
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.isValid()).toBeFalsy();
          });
        });
      });

      describe('internal filing events', () => {
        describe('that are not autogenerated', () => {
          it('should fail validation when "filedBy" is not provided', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: INTERNAL_DOCUMENT_TYPES[0],
                eventCode: TRANSCRIPT_EVENT_CODE,
                filedBy: undefined,
                filers: [],
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );
            expect(docketEntry.isValid()).toBeFalsy();
            expect(docketEntry.filedBy).toBeUndefined();
          });

          it('should pass validation when "filedBy" is provided', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: INTERNAL_DOCUMENT_TYPES[0],
                eventCode: TRANSCRIPT_EVENT_CODE,
                filedBy: 'Test Petitioner1',
                filers: [],
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.isValid()).toBeTruthy();
          });
        });

        describe('that are autogenerated', () => {
          it('should pass validation when "isAutoGenerated" is true and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
                isAutoGenerated: true,
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.filedBy).toBeUndefined();
            expect(docketEntry.isValid()).toBeTruthy();
          });

          it('should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.filedBy).toBeUndefined();
            expect(docketEntry.isValid()).toBeTruthy();
          });

          it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
            const docketEntry = new DocketEntry(
              {
                ...A_VALID_DOCKET_ENTRY,
                documentType: 'Notice of Change of Address',
                eventCode: 'NCA',
                filedBy: undefined,
                filers: [],
                isAutoGenerated: false,
              },
              { applicationContext, petitioners: MOCK_PETITIONERS },
            );

            expect(docketEntry.isValid()).toBeFalsy();
          });
        });
      });
    });
  });

  describe('signed property scenarios', () => {
    it('should fail validation when isDraft is false and signedAt is undefined for a document requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          isDraft: false,
          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeFalsy();
    });

    it('should pass validation when isDraft is false and signedAt is undefined for a document not requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Answer',
          eventCode: 'A',
          isDraft: false,
          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should fail validation when isDraft is false and signedJudgeName is undefined for a document requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          isDraft: false,
          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeFalsy();
    });

    it('should pass validation when isDraft is false and signedJudgeName is undefined for a document not requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Answer',
          eventCode: 'A',
          isDraft: false,

          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should pass validation when isDraft is false and signedJudgeName and signedAt are defined for a document requiring signature', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          isDraft: false,
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should pass validation when isDraft is true and signedJudgeName and signedAt are undefined', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          isDraft: true,
          signedAt: undefined,
          signedJudgeName: undefined,
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should fail validation when the document type is Order and "signedJudgeName" is not provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeFalsy();
      expect(docketEntry.signedJudgeName).toBeUndefined();
    });

    it('should pass validation when the document type is Order and a "signedAt" is provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );

      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should pass validation when the document type is Order and "signedJudgeName" and "signedByUserId" are provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('should fail validation when the document type is Order but no "signedAt" is provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeFalsy();
      expect(docketEntry.signedJudgeName).toBeUndefined();
    });

    it('should pass validation when the document type is Order and "signedJudgeName" is provided', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentType: 'Order',
          eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext, petitioners: MOCK_PETITIONERS },
      );
      expect(docketEntry.isValid()).toBeTruthy();
    });
  });

  it('should fail validation when the document type is opinion and judge is not provided', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: OPINION_DOCUMENT_TYPES[0].documentType,
        eventCode: 'MOP',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );
    expect(docketEntry.isValid()).toBeFalsy();
    expect(docketEntry.judge).toBeUndefined();
  });

  it('should fail validation when the document has a servedAt date and servedParties is not defined', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: ORDER_TYPES[0].documentType,
        eventCode: TRANSCRIPT_EVENT_CODE,
        servedAt: '2019-03-01T21:40:46.415Z',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isValid()).toBeFalsy();
    expect(docketEntry.getFormattedValidationErrors()).toMatchObject({
      servedParties: '"servedParties" is required',
    });
  });

  it('should fail validation when the document has servedParties and servedAt is not defined', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        documentType: ORDER_TYPES[0].documentType,
        eventCode: TRANSCRIPT_EVENT_CODE,
        servedParties: 'Test Petitioner',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    expect(docketEntry.isValid()).toBeFalsy();
    expect(docketEntry.getFormattedValidationErrors()).toMatchObject({
      servedAt: '"servedAt" is required',
    });
  });
});
