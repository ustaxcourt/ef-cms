const {
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OPINION_DOCUMENT_TYPES,
  ORDER_TYPES,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

export const A_VALID_DOCKET_ENTRY = {
  createdAt: '2020-07-17T19:28:29.675Z',
  docketEntryId: '0f5e035c-efa8-49e4-ba69-daf8a166a98f',
  docketNumber: '101-21',
  documentType: 'Petition',
  eventCode: 'A',
  filedBy: 'Test Petitioner',
  receivedAt: '2020-07-17T19:28:29.675Z',
  role: ROLES.petitioner,
  userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
};

describe('DocketEntry entity', () => {
  const mockUserId = applicationContext.getUniqueId();

  describe('signedAt', () => {
    it('should implicitly set a signedAt for Notice event codes', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'NOT',
          signedAt: null,
        },
        { applicationContext },
      );

      expect(myDoc.signedAt).toBeTruthy();
    });

    it('should NOT implicitly set a signedAt for non Notice event codes', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'O',
          signedAt: null,
        },
        { applicationContext },
      );

      expect(myDoc.signedAt).toEqual(null);
    });
  });

  describe('isDraft', () => {
    it('should default to false when no isDraft value is provided', () => {
      const myDoc = new DocketEntry(A_VALID_DOCKET_ENTRY, {
        applicationContext,
      });

      expect(myDoc.isDraft).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new DocketEntry({}, {})).toThrow();
    });

    it('Creates a valid docket entry', () => {
      const myDoc = new DocketEntry(A_VALID_DOCKET_ENTRY, {
        applicationContext,
      });
      myDoc.docketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
      expect(myDoc.isValid()).toBeTruthy();
      expect(myDoc.entityName).toEqual('DocketEntry');
    });

    it('Creates an invalid docket entry with no document type', () => {
      const myDoc = new DocketEntry(
        {
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
        { applicationContext },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('Creates an invalid docket entry with no userId', () => {
      const myDoc = new DocketEntry(
        {
          documentType: 'Petition',
        },
        { applicationContext },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('Creates an invalid docket entry with serviceDate of undefined-undefined-undefined', () => {
      const myDoc = new DocketEntry(
        {
          serviceDate: 'undefined-undefined-undefined',
        },
        { applicationContext },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentContents: 'this is the content of the document',
        },
        { applicationContext },
      );
      docketEntry.docketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
      docketEntry.validate();

      expect(docketEntry.documentContents).not.toBeDefined();
      expect(docketEntry.isValid()).toBeTruthy();
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
        { applicationContext },
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
        { applicationContext },
      ).validate();
      expect(docketEntry.isValid()).toBeTruthy();
    });

    describe('handling of sealed legacy documents', () => {
      it('should pass validation when "isLegacySealed", "isLegacy", and "isSealed" are undefined', () => {
        const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
          applicationContext,
        });
        expect(docketEntry.isValid()).toBeTruthy();
      });

      it('should fail validation when "isLegacySealed" is true but "isLegacy" and "isSealed" are undefined', () => {
        const docketEntry = new DocketEntry(
          {
            ...A_VALID_DOCKET_ENTRY,
            isLegacySealed: true,
          },
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
        );
        expect(docketEntry.isValid()).toBeTruthy();
      });
    });

    describe('filedBy scenarios', () => {
      describe('documentType is not in the list of documents that require filedBy', () => {
        it('should pass validation when filedBy is undefined', () => {
          const internalDocketEntry = new DocketEntry(
            { ...A_VALID_DOCKET_ENTRY, documentType: 'Petition' },
            { applicationContext },
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
                },
                { applicationContext },
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
                { applicationContext },
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
                  isAutoGenerated: true,
                },
                { applicationContext },
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
                },
                { applicationContext },
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
                  isAutoGenerated: false,
                },
                { applicationContext },
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
                },
                { applicationContext },
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
                },
                { applicationContext },
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
                  isAutoGenerated: true,
                },
                { applicationContext },
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
                },
                { applicationContext },
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
                  isAutoGenerated: false,
                },
                { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
          { applicationContext },
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
        { applicationContext },
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
        { applicationContext },
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
        { applicationContext },
      );

      expect(docketEntry.isValid()).toBeFalsy();
      expect(docketEntry.getFormattedValidationErrors()).toMatchObject({
        servedAt: '"servedAt" is required',
      });
    });
  });

  describe('secondaryDocument validation', () => {
    it('should not set value of secondaryDocument if the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Standard',
          secondaryDocument: {},
        },
        { applicationContext },
      );
      expect(createdDocketEntry.secondaryDocument).toBeUndefined();
      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should not be valid if secondaryDocument is present and the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Standard',
        },
        { applicationContext },
      );
      createdDocketEntry.secondaryDocument = {
        secondaryDocumentInfo: 'was set by accessor rather than init',
      };
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocketEntry.getFormattedValidationErrors()),
      ).toEqual([DOCUMENT_RELATIONSHIPS.SECONDARY]);
    });

    it('should be valid if secondaryDocument is undefined and the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Standard',
          secondaryDocument: undefined,
        },
        { applicationContext },
      );
      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should be valid if secondaryDocument is not present and the scenario is Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Nonstandard H',
          secondaryDocument: undefined,
        },
        { applicationContext },
      );

      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should be valid if secondaryDocument is present and its contents are valid and the scenario is Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Nonstandard H',
          secondaryDocument: {
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
          },
        },
        { applicationContext },
      );
      expect(createdDocketEntry.isValid()).toEqual(true);
    });

    it('should not be valid if secondaryDocument is present and it is missing fields and the scenario is Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          scenario: 'Nonstandard H',
          secondaryDocument: {},
        },
        { applicationContext },
      );
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocketEntry.getFormattedValidationErrors()),
      ).toEqual(['documentType', 'eventCode']);
    });

    it('should filter out unnecessary values from servedParties', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: applicationContext.getUniqueId(),
          servedAt: applicationContext.getUtilities().createISODateString(),
          servedParties: [
            {
              email: 'me@example.com',
              extra: 'extra',
              name: 'me',
              role: 'irsSuperuser',
            },
          ],
        },
        { applicationContext },
      );
      expect(createdDocketEntry.isValid()).toEqual(true);
      expect(createdDocketEntry.servedParties).toEqual([
        {
          email: 'me@example.com',
          name: 'me',
          role: 'irsSuperuser',
        },
      ]);
    });

    it('should return an error when servedParties is not an array', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: applicationContext.getUniqueId(),
          servedAt: applicationContext.getUtilities().createISODateString(),
          servedParties: {
            email: 'me@example.com',
            extra: 'extra',
            name: 'me',
            role: 'irsSuperuser',
          },
        },
        { applicationContext },
      );
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(createdDocketEntry.getFormattedValidationErrors()).toEqual({
        servedParties: '"servedParties" must be an array',
      });
    });
  });

  describe('minute entries', () => {
    it('creates minute entry', () => {
      const docketEntry = new DocketEntry(
        {
          docketNumber: '101-21',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
        { applicationContext },
      );

      expect(docketEntry.isValid()).toBe(true);
      expect(docketEntry.isMinuteEntry).toBe(true);
    });
  });

  describe('judgeUserId', () => {
    it('sets the judgeUserId property when a value is passed in', () => {
      const mockJudgeUserId = 'f5aa0760-9fee-4a58-9658-d043b01f2fb0';
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          judgeUserId: mockJudgeUserId,
        },
        { applicationContext },
      );

      expect(docketEntry).toMatchObject({
        judgeUserId: mockJudgeUserId,
      });
      expect(docketEntry.isValid()).toBeTruthy();
    });

    it('does not fail validation without a judgeUserId', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          judgeUserId: undefined,
        },
        { applicationContext },
      );
      expect(docketEntry.judgeUserId).toBeUndefined();
      expect(docketEntry.isValid()).toBeTruthy();
    });
  });
});
