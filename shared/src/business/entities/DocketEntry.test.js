const {
  CASE_STATUS_TYPES,
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_DOCUMENT_TYPES,
  ORDER_TYPES,
  PETITIONS_SECTION,
  ROLES,
  TRANSCRIPT_EVENT_CODE,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');
const { omit } = require('lodash');
const { WorkItem } = require('./WorkItem');

describe('DocketEntry entity', () => {
  const A_VALID_DOCKET_ENTRY = {
    documentType: 'Petition',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    role: ROLES.petitioner,
    userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
  };
  const caseDetail = {
    contactPrimary: {
      name: 'Bob',
    },
    contactSecondary: {
      name: 'Bill',
    },
  };
  const mockUserId = applicationContext.getUniqueId();

  describe('isPendingOnCreation', () => {
    beforeAll(() => {
      jest.spyOn(DocketEntry, 'isPendingOnCreation');
    });

    afterAll(() => {
      DocketEntry.isPendingOnCreation.mockRestore();
    });

    it('respects any defined "pending" value', () => {
      const raw1 = { eventCode: 'FOO', pending: true };
      const doc1 = new DocketEntry(raw1, { applicationContext });
      expect(doc1.pending).toBeTruthy();

      const raw2 = { eventCode: 'FOO', pending: false };
      const doc2 = new DocketEntry(raw2, { applicationContext });
      expect(doc2.pending).toBeFalsy();

      expect(DocketEntry.isPendingOnCreation).not.toHaveBeenCalled();
    });

    it('sets pending to false for non-matching event code and category', () => {
      const raw1 = { category: 'Ice Hockey', eventCode: 'ABC' };
      const doc1 = new DocketEntry(raw1, { applicationContext });
      expect(doc1.pending).toBe(false);

      expect(DocketEntry.isPendingOnCreation).toHaveBeenCalled();

      const raw2 = { color: 'blue', sport: 'Ice Hockey' };
      const doc2 = new DocketEntry(raw2, { applicationContext });
      expect(doc2.pending).toBe(false);

      expect(DocketEntry.isPendingOnCreation).toHaveBeenCalled();
    });

    it('sets pending to true for known list of matching events or categories', () => {
      const raw1 = {
        category: 'Motion',
        documentType: 'some kind of motion',
        eventCode: 'FOO',
      };
      const doc1 = new DocketEntry(raw1, { applicationContext });
      expect(doc1.pending).toBeTruthy();

      const raw2 = {
        documentType: 'it is a proposed stipulated decision',
        eventCode: 'PSDE',
      };
      const doc2 = new DocketEntry(raw2, { applicationContext });
      expect(doc2.pending).toBeTruthy();

      const raw3 = {
        documentType: 'it is an order to show cause',
        eventCode: 'OSC',
      };
      const doc3 = new DocketEntry(raw3, { applicationContext });
      expect(doc3.pending).toBeTruthy();

      const raw4 = {
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        eventCode: 'APW',
      };
      const doc4 = new DocketEntry(raw4, { applicationContext });
      expect(doc4.pending).toBeTruthy();
    });
  });

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
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          eventCode: 'NOT',
          signedAt: null,
        },
        { applicationContext },
      );

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

    it('setWorkItem', () => {
      const myDoc = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: '68584a2f-52d8-4876-8e44-0920f5061428',
        },
        { applicationContext },
      );
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseStatus: CASE_STATUS_TYPES.NEW,
          caseTitle: 'Johnny Joe Jacobson',
          docketEntry: {},
          docketNumber: '101-18',
          section: PETITIONS_SECTION,
          sentBy: 'bob',
        },
        { applicationContext },
      );
      myDoc.setWorkItem(workItem);
      expect(myDoc.isValid()).toBeTruthy();
      myDoc.setWorkItem(new WorkItem({}, { applicationContext }));
      expect(myDoc.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      let docketEntry;
      try {
        docketEntry = new DocketEntry(
          {
            ...A_VALID_DOCKET_ENTRY,
            documentContents: 'this is the content of the document',
          },
          { applicationContext },
        );
        docketEntry.docketEntryId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
        docketEntry.validate();
      } catch (err) {
        error = err;
      }

      expect(docketEntry.documentContents).not.toBeDefined();
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid docket entries', () => {
      let error;
      try {
        new DocketEntry({}, { applicationContext }).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });

    it('should not throw an error on valid docket entries', () => {
      let error;
      try {
        new DocketEntry(
          {
            createdAt: '2019-03-27T00:00:00.000-04:00',
            docketEntryId: '0ed63e9d-8fb5-4a55-b268-a7cd10d7cbcd',
            documentTitle:
              'ORDER THAT PETR. BY 4/18/19 FILE, UNDER SEAL, A RESPONSE TO THIS ORDER AS STATED HEREIN.',
            documentType: 'Order',
            entityName: 'Document',
            eventCode: 'O',
            filedBy: null,
            filingDate: '2019-03-27T00:00:00.000-04:00',
            isDraft: false,
            isFileAttached: true,
            isLegacy: true,
            isLegacySealed: false,
            isSealed: false,
            judge: 'Mock Judge',
            pending: false,
            processingStatus: 'pending',
            receivedAt: '2020-08-21T20:07:44.018Z',
            servedAt: '2019-03-28T00:00:00.000-04:00',
            servedParties: [
              {
                name: 'Bernard Lowe',
              },
              {
                name: 'IRS',
                role: 'irsSuperuser',
              },
            ],
            signedAt: 'Not in Blackstone',
            signedByUserId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
            signedJudgeName: 'Mock Signed Judge',
            userId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
          },
          { applicationContext },
        ).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeUndefined();

      try {
        new DocketEntry(
          {
            createdAt: '2019-03-27T00:00:00.000-04:00',
            docketEntryId: '0ed63e9d-8fb5-4a55-b268-a7cd10d7cbcd',
            documentTitle:
              'ORDER THAT PETR. BY 4/18/19 FILE, UNDER SEAL, A RESPONSE TO THIS ORDER AS STATED HEREIN.',
            documentType: 'Order',
            entityName: 'Document',
            eventCode: 'O',
            filedBy: '',
            filingDate: '2019-03-27T00:00:00.000-04:00',
            isDraft: false,
            isFileAttached: true,
            isLegacy: true,
            isLegacySealed: false,
            isSealed: false,
            judge: 'Mock Judge',
            pending: false,
            processingStatus: 'pending',
            receivedAt: '2020-08-21T20:07:44.018Z',
            servedAt: '2019-03-28T00:00:00.000-04:00',
            servedParties: [
              {
                name: 'Bernard Lowe',
              },
              {
                name: 'IRS',
                role: 'irsSuperuser',
              },
            ],
            signedAt: 'Not in Blackstone',
            signedByUserId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
            signedJudgeName: 'Mock Signed Judge',
            userId: 'a11077ed-c01d-4add-ab1e-da7aba5eda7a',
          },
          { applicationContext },
        ).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeUndefined();
    });

    it('should correctly validate with a secondaryDate', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
          eventCode: TRANSCRIPT_EVENT_CODE,
          secondaryDate: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(docketEntry.isValid()).toBeTruthy();
      expect(docketEntry.secondaryDate).toBeDefined();
    });

    describe('handling of sealed legacy documents', () => {
      it('should pass validation when "isLegacySealed", "isLegacy", and "isSealed" are undefined', () => {
        const docketEntry = new DocketEntry(
          {
            ...A_VALID_DOCKET_ENTRY,
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            secondaryDate: '2019-03-01T21:40:46.415Z',
          },
          { applicationContext },
        );
        expect(docketEntry.isValid()).toBeTruthy();
      });

      it('should fail validation when "isLegacySealed" is true but "isLegacy" and "isSealed" are undefined', () => {
        const docketEntry = new DocketEntry(
          {
            ...A_VALID_DOCKET_ENTRY,
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            isLegacySealed: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: ORDER_TYPES[0].documentType,
            eventCode: 'O',
            isLegacy: true,
            isLegacySealed: true,
            isSealed: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: ORDER_TYPES[0].documentType,
            eventCode: 'O',
            isLegacySealed: false,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
      let mockDocumentData = {
        ...A_VALID_DOCKET_ENTRY,
        docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
        secondaryDate: '2019-03-01T21:40:46.415Z',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      };

      describe('documentType is not in the list of documents that require filedBy', () => {
        it('should pass validation when filedBy is undefined', () => {
          let internalDocketEntry = new DocketEntry(
            { ...mockDocumentData, documentType: 'Petition' },
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
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: EXTERNAL_DOCUMENT_TYPES[0],
                  eventCode: TRANSCRIPT_EVENT_CODE,
                  filedBy: undefined,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
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
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: EXTERNAL_DOCUMENT_TYPES[0],
                  eventCode: TRANSCRIPT_EVENT_CODE,
                  filedBy: 'Test Petitioner1',
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(docketEntry.isValid()).toBeTruthy();
            });
          });

          describe('that are autogenerated', () => {
            it('should pass validation when "isAutoGenerated" is true and "filedBy" is undefined', () => {
              const documentWithoutFiledBy = omit(
                A_VALID_DOCKET_ENTRY,
                'filedBy',
              );
              const docketEntry = new DocketEntry(
                {
                  ...documentWithoutFiledBy,
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: true,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(docketEntry.filedBy).toBeUndefined();
              expect(docketEntry.isValid()).toBeTruthy();
            });

            it('should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined', () => {
              const documentWithoutFiledBy = omit(
                A_VALID_DOCKET_ENTRY,
                'filedBy',
              );
              const docketEntry = new DocketEntry(
                {
                  ...documentWithoutFiledBy,
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(docketEntry.filedBy).toBeUndefined();
              expect(docketEntry.isValid()).toBeTruthy();
            });

            it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
              const documentWithoutFiledBy = omit(
                A_VALID_DOCKET_ENTRY,
                'filedBy',
              );
              const docketEntry = new DocketEntry(
                {
                  ...documentWithoutFiledBy,
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: false,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
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
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: INTERNAL_DOCUMENT_TYPES[0],
                  eventCode: TRANSCRIPT_EVENT_CODE,
                  filedBy: undefined,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
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
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: INTERNAL_DOCUMENT_TYPES[0],
                  eventCode: TRANSCRIPT_EVENT_CODE,
                  filedBy: 'Test Petitioner1',
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(docketEntry.isValid()).toBeTruthy();
            });
          });

          describe('that are autogenerated', () => {
            it('should pass validation when "isAutoGenerated" is true and "filedBy" is undefined', () => {
              const documentWithoutFiledBy = omit(
                A_VALID_DOCKET_ENTRY,
                'filedBy',
              );
              const docketEntry = new DocketEntry(
                {
                  ...documentWithoutFiledBy,
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: true,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(docketEntry.filedBy).toBeUndefined();
              expect(docketEntry.isValid()).toBeTruthy();
            });

            it('should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined', () => {
              const documentWithoutFiledBy = omit(
                A_VALID_DOCKET_ENTRY,
                'filedBy',
              );
              const docketEntry = new DocketEntry(
                {
                  ...documentWithoutFiledBy,
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(docketEntry.filedBy).toBeUndefined();
              expect(docketEntry.isValid()).toBeTruthy();
            });

            it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
              const documentWithoutFiledBy = omit(
                A_VALID_DOCKET_ENTRY,
                'filedBy',
              );
              const docketEntry = new DocketEntry(
                {
                  ...documentWithoutFiledBy,
                  docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: false,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isDraft: false,
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Answer',
            eventCode: 'A',
            isDraft: false,
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isDraft: false,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Answer',
            eventCode: 'A',
            isDraft: false,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isDraft: false,
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isDraft: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
            docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: 'Order',
            eventCode: EVENT_CODES_REQUIRING_SIGNATURE[0],
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
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
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: OPINION_DOCUMENT_TYPES[0].documentType,
          eventCode: 'MOP',
          secondaryDate: '2019-03-01T21:40:46.415Z',
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
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: TRANSCRIPT_EVENT_CODE,
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
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
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: TRANSCRIPT_EVENT_CODE,
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
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

  describe('generate filed by string', () => {
    it('should generate correct filedBy string for partyPrimary', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          createdAt: '2019-04-19T17:29:13.120Z',
          docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          partyPrimary: true,
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petr. Bob');
    });

    it('should generate correct filedBy string for partyPrimary and otherFilingParty', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          createdAt: '2019-04-19T17:29:13.120Z',
          docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          otherFilingParty: 'Bob Barker',
          partyPrimary: true,
          relationship: 'primaryDocument',
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petr. Bob, Bob Barker');
    });

    it('should generate correct filedBy string for only partySecondary', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          createdAt: '2019-04-19T17:29:13.120Z',
          docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          partyPrimary: false,
          partySecondary: true,
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petr. Bill');
    });

    it('should generate correct filedBy string for partyPrimary and partyIrsPractitioner', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          docketEntryId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          partyIrsPractitioner: true,
          partyPrimary: true,
          previousDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Nonstandard F',
          supportingDocument: 'Brief in Support',
          supportingDocumentFreeText: null,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob');
    });

    it('should generate correct filedBy string for partyPrimary, partyIrsPractitioner, and otherFilingParty', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          docketEntryId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          otherFilingParty: 'Bob Barker',
          partyIrsPractitioner: true,
          partyPrimary: true,
          previousDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          relationship: 'primaryDocument',
          scenario: 'Nonstandard F',
          supportingDocument: 'Brief in Support',
          supportingDocumentFreeText: null,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob, Bob Barker');
    });

    it('should generate correct filedBy string for only otherFilingParty', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          docketEntryId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          otherFilingParty: 'Bob Barker',
          partyIrsPractitioner: false,
          partyPrimary: false,
          previousDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          relationship: 'primaryDocument',
          scenario: 'Nonstandard F',
          supportingDocument: 'Brief in Support',
          supportingDocumentFreeText: null,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Bob Barker');
    });

    it('should generate correct filedBy string for partyPrimary and partySecondary', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: true,
          category: 'Motion',
          certificateOfService: true,
          certificateOfServiceDate: '2018-06-07',
          certificateOfServiceDay: '7',
          certificateOfServiceMonth: '6',
          certificateOfServiceYear: '2018',
          createdAt: '2019-04-19T17:39:10.476Z',
          docketEntryId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
          documentTitle:
            'Motion for Leave to File Computation for Entry of Decision',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          exhibits: true,
          hasSecondarySupportingDocuments: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.YES,
          partyPrimary: true,
          partySecondary: true,
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Nonstandard H',
          secondarySupportingDocument: null,
          secondarySupportingDocumentFreeText: null,
          supportingDocument: 'Declaration in Support',
          supportingDocumentFreeText: 'Rachael',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petrs. Bob & Bill');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner (as an object, legacy data)', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: {
            name: 'Test Practitioner',
          },
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: true,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: false,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: true,
            },
            {
              name: 'Test Practitioner1',
              partyPrivatePractitioner: true,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual(
        'Resp. & Counsel Test Practitioner & Counsel Test Practitioner1',
      );
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners with one set to false', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: false,
            },
            {
              name: 'Test Practitioner1',
              partyPrivatePractitioner: true,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner1');
    });

    it('should generate correct filedBy string for partyPrimary in the constructor when called with a contactPrimary property', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          contactPrimary: caseDetail.contactPrimary,
          createdAt: '2019-04-19T17:29:13.120Z',
          docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          partyPrimary: true,
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petr. Bob');
    });

    it('should generate correct filedBy string for partySecondary in the constructor when called with a contactSecondary property', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          contactSecondary: caseDetail.contactSecondary,
          createdAt: '2019-04-19T17:29:13.120Z',
          docketEntryId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          partyPrimary: false,
          partySecondary: true,
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petr. Bill');
    });

    it('should generate correct filedBy string for partyPrimary and partyIrsPractitioner in the constructor when values are present', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          docketEntryId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          partyIrsPractitioner: true,
          partyPrimary: true,
          previousDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Nonstandard F',
          supportingDocument: 'Brief in Support',
          supportingDocumentFreeText: null,
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Petr. Bob');
    });

    it('should generate correct filedBy string for partyPrimary and partySecondary in the constructor when values are present', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          attachments: true,
          category: 'Motion',
          certificateOfService: true,
          certificateOfServiceDate: '2018-06-07',
          certificateOfServiceDay: '7',
          certificateOfServiceMonth: '6',
          certificateOfServiceYear: '2018',
          createdAt: '2019-04-19T17:39:10.476Z',
          docketEntryId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
          documentTitle:
            'Motion for Leave to File Computation for Entry of Decision',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          exhibits: true,
          hasSecondarySupportingDocuments: false,
          hasSupportingDocuments: true,
          objections: OBJECTIONS_OPTIONS_MAP.YES,
          partyPrimary: true,
          partySecondary: true,
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
          scenario: 'Nonstandard H',
          secondarySupportingDocument: null,
          secondarySupportingDocumentFreeText: null,
          supportingDocument: 'Declaration in Support',
          supportingDocumentFreeText: 'Rachael',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Petrs. Bob & Bill');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner in the constructor when values are present', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: true,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false in the constructor when values are present', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: false,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners in the constructor when values are present', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: true,
            },
            {
              name: 'Test Practitioner1',
              partyPrivatePractitioner: true,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual(
        'Resp. & Counsel Test Practitioner & Counsel Test Practitioner1',
      );
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners with one set to false in the constructor when values are present', () => {
      const docketEntry = new DocketEntry(
        {
          ...caseDetail,
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          docketEntryId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
          documentTitle:
            'Unsworn Declaration of Test under Penalty of Perjury in Support of Amended Petition',
          documentType:
            'Unsworn Declaration under Penalty of Perjury in Support',
          eventCode: 'USDL',
          freeText: 'Test',
          lodged: true,
          partyIrsPractitioner: true,
          partyPrivatePractitioner: true,
          previousDocument: 'Amended Petition',
          privatePractitioners: [
            {
              name: 'Test Practitioner',
              partyPrivatePractitioner: false,
            },
            {
              name: 'Test Practitioner1',
              partyPrivatePractitioner: true,
            },
          ],
          relationship: DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(docketEntry.filedBy).toEqual('Resp. & Counsel Test Practitioner1');
    });
  });

  describe('unsignDocument', () => {
    it('signs and unsigns the document', () => {
      const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
        applicationContext,
      });
      docketEntry.setSigned('abc-123', 'Joe Exotic');

      expect(docketEntry.signedByUserId).toEqual('abc-123');
      expect(docketEntry.signedJudgeName).toEqual('Joe Exotic');
      expect(docketEntry.signedAt).toBeDefined();

      docketEntry.unsignDocument();

      expect(docketEntry.signedByUserId).toEqual(null);
      expect(docketEntry.signedJudgeName).toEqual(null);
      expect(docketEntry.signedAt).toEqual(null);
    });
  });

  describe('setQCed', () => {
    it('updates the document QC information with user name, id, and date', () => {
      const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
        applicationContext,
      });
      const user = {
        name: 'Jean Luc',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };
      docketEntry.setQCed(user);
      expect(docketEntry.qcByUserId).toEqual(
        '02323349-87fe-4d29-91fe-8dd6916d2fda',
      );
      expect(docketEntry.qcAt).toBeDefined();
    });
  });

  describe('isAutoServed', () => {
    it('should return true if the documentType is an external document and the documentTitle does not contain Simultaneous', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentTitle: 'Answer to Second Amendment to Petition',
          documentType: 'Answer to Second Amendment to Petition',
        },
        { applicationContext },
      );
      expect(docketEntry.isAutoServed()).toBeTruthy();
    });

    it('should return true if the documentType is a practitioner association document and the documentTitle does not contain Simultaneous', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentTitle: 'Entry of Appearance',
          documentType: 'Entry of Appearance',
        },
        { applicationContext },
      );
      expect(docketEntry.isAutoServed()).toBeTruthy();
    });

    it('should return true if the documentType is a practitioner association document and the documentTitle does not contain Simultaneous', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentTitle: 'Notice of Election to Participate',
          documentType: 'Notice of Election to Participate',
        },
        { applicationContext },
      );
      expect(docketEntry.isAutoServed()).toBeTruthy();

      docketEntry.documentTitle = 'Notice of Election to Intervene';
      docketEntry.documentType = 'Notice of Election to Intervene';
      expect(docketEntry.isAutoServed()).toBeTruthy();

      docketEntry.documentTitle = 'Notice of Election to Participate';
      docketEntry.documentType = 'Notice of Election to Participate';
      expect(docketEntry.isAutoServed()).toBeTruthy();

      docketEntry.documentTitle = 'Notice of Intervention';
      docketEntry.documentType = 'Notice of Intervention';
      expect(docketEntry.isAutoServed()).toBeTruthy();
    });

    it('should return false if the documentType is an external document and the documentTitle contains Simultaneous', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentTitle: 'Amended Simultaneous Memoranda of Law',
          documentType: 'Amended Simultaneous Memoranda of Law',
        },
        { applicationContext },
      );
      expect(docketEntry.isAutoServed()).toBeFalsy();
    });

    it('should return false if the documentType is an internally-filed document', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          documentTitle: 'Application for Examination Pursuant to Rule 73',
          documentType: 'Application for Examination Pursuant to Rule 73',
        },
        { applicationContext },
      );
      expect(docketEntry.isAutoServed()).toBeFalsy();
    });
  });

  describe('setAsServed', () => {
    it('sets the Document as served', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          draftOrderState: {
            documentContents: 'Yee to the haw',
          },
        },
        { applicationContext },
      );
      docketEntry.setAsServed();

      expect(docketEntry.servedAt).toBeDefined();
      expect(docketEntry.draftOrderState).toEqual(null);
    });

    it('sets the Document as served with served parties', () => {
      const docketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
        },
        { applicationContext },
      );

      docketEntry.setAsServed([
        {
          name: 'Served Party',
        },
      ]);
      expect(docketEntry.servedAt).toBeDefined();
      expect(docketEntry.servedParties).toMatchObject([
        { name: 'Served Party' },
      ]);
    });
  });

  describe('secondaryDocument validation', () => {
    it('should not be valid if secondaryDocument is present and the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
          scenario: 'Standard',
          secondaryDocument: {},
        },
        { applicationContext },
      );
      expect(createdDocketEntry.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocketEntry.getFormattedValidationErrors()),
      ).toEqual([DOCUMENT_RELATIONSHIPS.SECONDARY]);
    });

    it('should be valid if secondaryDocument is undefined and the scenario is not Nonstandard H', () => {
      const createdDocketEntry = new DocketEntry(
        {
          ...A_VALID_DOCKET_ENTRY,
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
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
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
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
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
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
          docketEntryId: '777afd4b-1408-4211-a80e-3e897999861a',
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
          servedAt: Date.now(),
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
          servedAt: Date.now(),
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

  describe('setNumberOfPages', () => {
    it('sets the number of pages', () => {
      const docketEntry = new DocketEntry(
        {
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filingDate: new Date('9000-01-01').toISOString(),
          index: 1,
        },
        { applicationContext },
      );
      docketEntry.setNumberOfPages(13);
      expect(docketEntry.numberOfPages).toEqual(13);
    });
  });

  describe('strikeEntry', () => {
    it('strikes a document if isOnDocketRecord is true', () => {
      const docketEntry = new DocketEntry(
        {
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filingDate: new Date('9000-01-01').toISOString(),
          index: 1,
          isOnDocketRecord: true,
        },
        { applicationContext },
      );
      docketEntry.strikeEntry({
        name: 'Test User',
        userId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
      });
      expect(docketEntry).toMatchObject({
        isStricken: true,
        strickenAt: expect.anything(),
        strickenBy: 'Test User',
        strickenByUserId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
      });
    });

    it('throws an error if isOnDocketRecord is false', () => {
      const docketEntry = new DocketEntry(
        {
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filingDate: new Date('9000-01-01').toISOString(),
          index: 1,
          isOnDocketRecord: false,
        },
        { applicationContext },
      );
      let error;
      try {
        docketEntry.strikeEntry({
          name: 'Test User',
          userId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
        });
      } catch (e) {
        error = e;
      }
      expect(error).toEqual(
        new Error('Cannot strike a document that is not on the docket record.'),
      );
      expect(docketEntry).toMatchObject({
        isStricken: false,
        strickenAt: undefined,
        strickenBy: undefined,
        strickenByUserId: undefined,
      });
    });
  });
});
