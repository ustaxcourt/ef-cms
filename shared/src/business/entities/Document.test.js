const {
  EXTERNAL_DOCUMENT_TYPES,
  INTERNAL_DOCUMENT_TYPES,
  OPINION_DOCUMENT_TYPES,
  ORDER_TYPES,
  ROLES,
} = require('./EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Document } = require('./Document');
const { Message } = require('./Message');
const { omit } = require('lodash');
const { WorkItem } = require('./WorkItem');

const A_VALID_DOCUMENT = {
  documentType: 'Petition',
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

describe('Document entity', () => {
  describe('isPendingOnCreation', () => {
    beforeAll(() => {
      jest.spyOn(Document, 'isPendingOnCreation');
    });

    afterAll(() => {
      Document.isPendingOnCreation.mockRestore();
    });

    it('respects any defined "pending" value', () => {
      const raw1 = { eventCode: 'FOO', pending: true };
      const doc1 = new Document(raw1, { applicationContext });
      expect(doc1.pending).toBeTruthy();

      const raw2 = { eventCode: 'FOO', pending: false };
      const doc2 = new Document(raw2, { applicationContext });
      expect(doc2.pending).toBeFalsy();

      expect(Document.isPendingOnCreation).not.toHaveBeenCalled();
    });

    it('sets pending to false for non-matching event code and category', () => {
      const raw1 = { category: 'Ice Hockey', eventCode: 'ABC' };
      const doc1 = new Document(raw1, { applicationContext });
      expect(doc1.pending).toBe(false);

      expect(Document.isPendingOnCreation).toHaveBeenCalled();

      const raw2 = { color: 'blue', sport: 'Ice Hockey' };
      const doc2 = new Document(raw2, { applicationContext });
      expect(doc2.pending).toBe(false);

      expect(Document.isPendingOnCreation).toHaveBeenCalled();
    });

    it('sets pending to true for known list of matching events or categories', () => {
      const raw1 = {
        category: 'Motion',
        documentType: 'some kind of motion',
        eventCode: 'FOO',
      };
      const doc1 = new Document(raw1, { applicationContext });
      expect(doc1.pending).toBeTruthy();

      const raw2 = {
        documentType: 'it is a proposed stipulated decision',
        eventCode: 'PSDE',
      };
      const doc2 = new Document(raw2, { applicationContext });
      expect(doc2.pending).toBeTruthy();

      const raw3 = {
        documentType: 'it is an order to show cause',
        eventCode: 'OSC',
      };
      const doc3 = new Document(raw3, { applicationContext });
      expect(doc3.pending).toBeTruthy();

      const raw4 = {
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        eventCode: 'APW',
      };
      const doc4 = new Document(raw4, { applicationContext });
      expect(doc4.pending).toBeTruthy();
    });
  });

  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new Document({}, {})).toThrow();
    });

    it('Creates a valid document', () => {
      const myDoc = new Document(A_VALID_DOCUMENT, { applicationContext });
      myDoc.documentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
      expect(myDoc.isValid()).toBeTruthy();
      expect(myDoc.entityName).toEqual('Document');
    });

    it('Creates an invalid document with no document type', () => {
      const myDoc = new Document(
        {
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
        { applicationContext },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('Creates an invalid document with no userId', () => {
      const myDoc = new Document(
        {
          documentType: 'Petition',
        },
        { applicationContext },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('Creates an invalid document with serviceDate of undefined-undefined-undefined', () => {
      const myDoc = new Document(
        {
          serviceDate: 'undefined-undefined-undefined',
        },
        { applicationContext },
      );
      expect(myDoc.isValid()).toBeFalsy();
    });

    it('addWorkItem', () => {
      const myDoc = new Document(A_VALID_DOCUMENT, { applicationContext });
      const workItem = new WorkItem(
        {
          assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: 'new',
          caseTitle: 'Johnny Joe Jacobson',
          docketNumber: '101-18',
          document: {},
          isQC: true,
          sentBy: 'bob',
        },
        { applicationContext },
      );
      const message = new Message(
        {
          from: 'Test User',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'hello world',
          messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        { applicationContext },
      );
      workItem.addMessage(message);
      myDoc.addWorkItem(new WorkItem({}, { applicationContext }));
      expect(myDoc.isValid()).toBeFalsy();
    });
  });

  describe('validate', () => {
    it('should do nothing if valid', () => {
      let error;
      let document;
      try {
        document = new Document(
          {
            ...A_VALID_DOCUMENT,
            documentContents: 'this is the content of the document',
          },
          { applicationContext },
        );
        document.documentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
        document.validate();
      } catch (err) {
        error = err;
      }

      expect(document.documentContents).not.toBeDefined();
      expect(error).not.toBeDefined();
    });

    it('should throw an error on invalid documents', () => {
      let error;
      try {
        new Document({}, { applicationContext }).validate();
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
    });

    it('should correctly validate with a secondaryDate', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          eventCode: 'TRAN',
          secondaryDate: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isValid()).toBeTruthy();
      expect(document.secondaryDate).toBeDefined();
    });

    describe('handling of sealed legacy documents', () => {
      it('should pass validation when "isLegacySealed", "isLegacy", and "isSealed" are undefined', () => {
        const document = new Document(
          {
            ...A_VALID_DOCUMENT,
            documentId: '777afd4b-1408-4211-a80e-3e897999861a',
            secondaryDate: '2019-03-01T21:40:46.415Z',
          },
          { applicationContext },
        );
        expect(document.isValid()).toBeTruthy();
      });

      it('should fail validation when "isLegacySealed" is true but "isLegacy" and "isSealed" are undefined', () => {
        const document = new Document(
          {
            ...A_VALID_DOCUMENT,
            documentId: '777afd4b-1408-4211-a80e-3e897999861a',
            isLegacySealed: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
          },
          { applicationContext },
        );
        expect(document.isValid()).toBeFalsy();
        expect(document.getFormattedValidationErrors()).toMatchObject({
          isLegacy: '"isLegacy" is required',
          isSealed: '"isSealed" is required',
        });
      });

      it('should pass validation when "isLegacy" is true, "isSealed" and "isLegacy" are true', () => {
        const document = new Document(
          {
            ...A_VALID_DOCUMENT,
            documentId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: ORDER_TYPES[0].documentType,
            draftState: {},
            eventCode: 'O',
            isLegacy: true,
            isLegacySealed: true,
            isOrder: true,
            isSealed: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
          },
          { applicationContext },
        );
        expect(document.isValid()).toBeTruthy();
      });

      it('should pass validation when "isLegacy" is false, "isSealed" and "isLegacy" are undefined', () => {
        const document = new Document(
          {
            ...A_VALID_DOCUMENT,
            documentId: '777afd4b-1408-4211-a80e-3e897999861a',
            documentType: ORDER_TYPES[0].documentType,
            draftState: {},
            eventCode: 'O',
            isLegacySealed: false,
            isOrder: true,
            secondaryDate: '2019-03-01T21:40:46.415Z',
          },
          { applicationContext },
        );
        expect(document.isValid()).toBeTruthy();
      });
    });

    describe('filedBy scenarios', () => {
      let mockDocumentData = {
        ...A_VALID_DOCUMENT,
        documentId: '777afd4b-1408-4211-a80e-3e897999861a',
        draftState: null,
        secondaryDate: '2019-03-01T21:40:46.415Z',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      };

      describe('documentType is not in the list of documents that require filedBy', () => {
        it('should pass validation when filedBy is undefined', () => {
          let internalDocument = new Document(
            { ...mockDocumentData, documentType: 'Petition' },
            { applicationContext },
          );

          expect(internalDocument.isValid()).toBeTruthy();
        });
      });

      describe('documentType is in the list of documents that require filedBy', () => {
        // when documentType
        describe('external filing events', () => {
          describe('that are not autogenerated', () => {
            it('should fail validation when "filedBy" is not provided', () => {
              const document = new Document(
                {
                  ...A_VALID_DOCUMENT,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: EXTERNAL_DOCUMENT_TYPES[0],
                  eventCode: 'TRAN',
                  filedBy: undefined,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );
              expect(document.isValid()).toBeFalsy();
              expect(document.filedBy).toBeUndefined();
            });

            it('should pass validation when "filedBy" is provided', () => {
              const document = new Document(
                {
                  ...A_VALID_DOCUMENT,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: EXTERNAL_DOCUMENT_TYPES[0],
                  eventCode: 'TRAN',
                  filedBy: 'Test Petitioner1',
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.isValid()).toBeTruthy();
            });
          });

          describe('that are autogenerated', () => {
            // is: joi.string().valid('Notice of Change of Address'),
            it('should pass validation when "isAutoGenerated" is true and "filedBy" is undefined', () => {
              // then: joi.when('isAutoGenerated'  is: false,
              const documentWithoutFiledBy = omit(A_VALID_DOCUMENT, 'filedBy');
              const document = new Document(
                {
                  ...documentWithoutFiledBy,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: true,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.filedBy).toBeUndefined();
              expect(document.isValid()).toBeTruthy();
            });

            it('should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined', () => {
              // then: joi.when('isAutoGenerated'  is: false,
              const documentWithoutFiledBy = omit(A_VALID_DOCUMENT, 'filedBy');
              const document = new Document(
                {
                  ...documentWithoutFiledBy,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.filedBy).toBeUndefined();
              expect(document.isValid()).toBeTruthy();
            });

            it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
              // otherwise when('isAutoGenerated'  is: true,
              const documentWithoutFiledBy = omit(A_VALID_DOCUMENT, 'filedBy');
              const document = new Document(
                {
                  ...documentWithoutFiledBy,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: false,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.isValid()).toBeFalsy();
            });
          });
        });

        describe('internal filing events', () => {
          describe('that are not autogenerated', () => {
            it('should fail validation when "filedBy" is not provided', () => {
              const document = new Document(
                {
                  ...A_VALID_DOCUMENT,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: INTERNAL_DOCUMENT_TYPES[0],
                  eventCode: 'TRAN',
                  filedBy: undefined,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );
              expect(document.isValid()).toBeFalsy();
              expect(document.filedBy).toBeUndefined();
            });

            it('should pass validation when "filedBy" is provided', () => {
              const document = new Document(
                {
                  ...A_VALID_DOCUMENT,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: INTERNAL_DOCUMENT_TYPES[0],
                  eventCode: 'TRAN',
                  filedBy: 'Test Petitioner1',
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.isValid()).toBeTruthy();
            });
          });

          describe('that are autogenerated', () => {
            // is: joi.string().valid('Notice of Change of Address'),
            it('should pass validation when "isAutoGenerated" is true and "filedBy" is undefined', () => {
              // then: joi.when('isAutoGenerated'  is: false,
              const documentWithoutFiledBy = omit(A_VALID_DOCUMENT, 'filedBy');
              const document = new Document(
                {
                  ...documentWithoutFiledBy,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: true,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.filedBy).toBeUndefined();
              expect(document.isValid()).toBeTruthy();
            });

            it('should pass validation when "isAutoGenerated" is undefined and "filedBy" is undefined', () => {
              // then: joi.when('isAutoGenerated'  is: false,
              const documentWithoutFiledBy = omit(A_VALID_DOCUMENT, 'filedBy');
              const document = new Document(
                {
                  ...documentWithoutFiledBy,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.filedBy).toBeUndefined();
              expect(document.isValid()).toBeTruthy();
            });

            it('should fail validation when "isAutoGenerated" is false and "filedBy" is undefined', () => {
              // otherwise when('isAutoGenerated'  is: true,
              const documentWithoutFiledBy = omit(A_VALID_DOCUMENT, 'filedBy');
              const document = new Document(
                {
                  ...documentWithoutFiledBy,
                  documentId: '777afd4b-1408-4211-a80e-3e897999861a',
                  documentType: 'Notice of Change of Address',
                  eventCode: 'NCA',
                  isAutoGenerated: false,
                  isOrder: true,
                  secondaryDate: '2019-03-01T21:40:46.415Z',
                },
                { applicationContext },
              );

              expect(document.isValid()).toBeFalsy();
            });
          });
        });
      });
    });

    it('should fail validation when the document type is Order and "signedJudgeName" is not provided', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isValid()).toBeFalsy();
      expect(document.signedJudgeName).toBeUndefined();
    });

    it('should fail validation when the document type is opinion and judge is not provided', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: OPINION_DOCUMENT_TYPES[0].documentType,
          eventCode: 'MOP',
          secondaryDate: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isValid()).toBeFalsy();
      expect(document.judge).toBeUndefined();
    });

    it('should pass validation when the document type is Order and a "signedAt" is provided', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          draftState: null,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext },
      );

      expect(document.isValid()).toBeTruthy();
    });

    it('should pass validation when the document type is Order and "signedJudgeName" and "signedByUserId" are provided', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext },
      );
      expect(document.isValid()).toBeTruthy();
    });

    it('should fail validation when the document type is Order but no "signedAt" is provided', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isValid()).toBeFalsy();
      expect(document.signedJudgeName).toBeUndefined();
    });

    it('should pass validation when the document type is Order and "signedJudgeName" is provided', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext },
      );
      expect(document.isValid()).toBeTruthy();
    });

    it('should fail validation when the document has a servedAt date and servedParties is not defined', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
          servedAt: '2019-03-01T21:40:46.415Z',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext },
      );

      expect(document.isValid()).toBeFalsy();
      expect(document.getFormattedValidationErrors()).toMatchObject({
        servedParties: '"servedParties" is required',
      });
    });

    it('should fail validation when the document has servedParties and servedAt is not defined', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          documentType: ORDER_TYPES[0].documentType,
          eventCode: 'TRAN',
          isOrder: true,
          secondaryDate: '2019-03-01T21:40:46.415Z',
          servedParties: 'Test Petitioner',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
        { applicationContext },
      );

      expect(document.isValid()).toBeFalsy();
      expect(document.getFormattedValidationErrors()).toMatchObject({
        servedAt: '"servedAt" is required',
      });
    });
  });

  describe('generate filed by string', () => {
    it('should generate correct filedBy string for partyPrimary', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          createdAt: '2019-04-19T17:29:13.120Z',
          documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: 'No',
          partyPrimary: true,
          relationship: 'primaryDocument',
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Petr. Bob');
    });

    it('should generate correct filedBy string for only partySecondary', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          createdAt: '2019-04-19T17:29:13.120Z',
          documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: 'No',
          partyPrimary: false,
          partySecondary: true,
          relationship: 'primaryDocument',
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Petr. Bill');
    });

    it('should generate correct filedBy string for partyPrimary and partyIrsPractitioner', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
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
          relationship: 'primaryDocument',
          scenario: 'Nonstandard F',
          supportingDocument: 'Brief in Support',
          supportingDocumentFreeText: null,
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail, true);
      expect(document.filedBy).toEqual('Resp. & Petr. Bob');
    });

    it('should generate correct filedBy string for partyPrimary and partyIrsPractitioner only once', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          partyIrsPractitioner: true,
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
      document.generateFiledBy(caseDetail);

      expect(document.filedBy).toEqual('Resp.');

      document.partyPrimary = true;
      document.generateFiledBy(caseDetail);

      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyPrimary and partyIrsPractitioner more than once with force = true', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
          documentTitle:
            'First Amended Unsworn Declaration under Penalty of Perjury in Support',
          documentType: 'Amended',
          eventCode: 'ADED',
          exhibits: true,
          hasSupportingDocuments: true,
          ordinalValue: 'First',
          partyIrsPractitioner: true,
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
      document.generateFiledBy(caseDetail);

      expect(document.filedBy).toEqual('Resp.');

      document.partyPrimary = true;
      document.generateFiledBy(caseDetail, true);

      expect(document.filedBy).toEqual('Resp. & Petr. Bob');
    });

    it('should generate correct filedBy string for partyPrimary and partySecondary', () => {
      const document = new Document(
        {
          attachments: true,
          category: 'Motion',
          certificateOfService: true,
          certificateOfServiceDate: '2018-06-07',
          certificateOfServiceDay: '7',
          certificateOfServiceMonth: '6',
          certificateOfServiceYear: '2018',
          createdAt: '2019-04-19T17:39:10.476Z',
          documentId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
          documentTitle:
            'Motion for Leave to File Computation for Entry of Decision',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          exhibits: true,
          hasSecondarySupportingDocuments: false,
          hasSupportingDocuments: true,
          objections: 'Yes',
          partyPrimary: true,
          partySecondary: true,
          relationship: 'primaryDocument',
          scenario: 'Nonstandard H',
          secondarySupportingDocument: null,
          secondarySupportingDocumentFreeText: null,
          supportingDocument: 'Declaration in Support',
          supportingDocumentFreeText: 'Rachael',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Petrs. Bob & Bill');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner (as an object, legacy data)', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp. & Counsel Test Practitioner');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual(
        'Resp. & Counsel Test Practitioner & Counsel Test Practitioner1',
      );
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners with one set to false', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp. & Counsel Test Practitioner1');
    });

    it('should generate correct filedBy string for partyPrimary in the constructor when called with a contactPrimary property', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          contactPrimary: caseDetail.contactPrimary,
          createdAt: '2019-04-19T17:29:13.120Z',
          documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: 'No',
          partyPrimary: true,
          relationship: 'primaryDocument',
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Petr. Bob');
    });

    it('should generate correct filedBy string for partySecondary in the constructor when called with a contactSecondary property', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Petition',
          certificateOfService: false,
          contactSecondary: caseDetail.contactSecondary,
          createdAt: '2019-04-19T17:29:13.120Z',
          documentId: '88cd2c25-b8fa-4dc0-bfb6-57245c86bb0d',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          exhibits: false,
          hasSupportingDocuments: true,
          objections: 'No',
          partyPrimary: false,
          partySecondary: true,
          relationship: 'primaryDocument',
          scenario: 'Standard',
          supportingDocument:
            'Unsworn Declaration under Penalty of Perjury in Support',
          supportingDocumentFreeText: 'Test',
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Petr. Bill');
    });

    it('should generate correct filedBy string for partyPrimary and partyIrsPractitioner in the constructor when values are present', () => {
      const document = new Document(
        {
          attachments: false,
          category: 'Miscellaneous',
          certificateOfService: false,
          createdAt: '2019-04-19T18:24:09.515Z',
          documentId: 'c501a558-7632-497e-87c1-0c5f39f66718',
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
          relationship: 'primaryDocument',
          scenario: 'Nonstandard F',
          supportingDocument: 'Brief in Support',
          supportingDocumentFreeText: null,
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Resp. & Petr. Bob');
    });

    it('should generate correct filedBy string for partyPrimary and partySecondary in the constructor when values are present', () => {
      const document = new Document(
        {
          attachments: true,
          category: 'Motion',
          certificateOfService: true,
          certificateOfServiceDate: '2018-06-07',
          certificateOfServiceDay: '7',
          certificateOfServiceMonth: '6',
          certificateOfServiceYear: '2018',
          createdAt: '2019-04-19T17:39:10.476Z',
          documentId: '362baeaf-7692-4b04-878b-2946dcfa26ee',
          documentTitle:
            'Motion for Leave to File Computation for Entry of Decision',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          exhibits: true,
          hasSecondarySupportingDocuments: false,
          hasSupportingDocuments: true,
          objections: 'Yes',
          partyPrimary: true,
          partySecondary: true,
          relationship: 'primaryDocument',
          scenario: 'Nonstandard H',
          secondarySupportingDocument: null,
          secondarySupportingDocumentFreeText: null,
          supportingDocument: 'Declaration in Support',
          supportingDocumentFreeText: 'Rachael',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Petrs. Bob & Bill');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner in the constructor when values are present', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Resp. & Counsel Test Practitioner');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and partyPrivatePractitioner set to false in the constructor when values are present', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners in the constructor when values are present', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual(
        'Resp. & Counsel Test Practitioner & Counsel Test Practitioner1',
      );
    });

    it('should generate correct filedBy string for partyIrsPractitioner and multiple partyPrivatePractitioners with one set to false in the constructor when values are present', () => {
      const document = new Document(
        {
          category: 'Supporting Document',
          createdAt: '2019-04-19T17:29:13.122Z',
          documentId: '3ac23dd8-b0c4-4538-86e1-52b715f54838',
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
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Resp. & Counsel Test Practitioner1');
    });
  });

  describe('unsignDocument', () => {
    it('signs and unsigns the document', () => {
      const document = new Document(A_VALID_DOCUMENT, { applicationContext });
      document.setSigned('abc-123', 'Joe Exotic');

      expect(document.signedByUserId).toEqual('abc-123');
      expect(document.signedJudgeName).toEqual('Joe Exotic');
      expect(document.signedAt).toBeDefined();

      document.unsignDocument();

      expect(document.signedByUserId).toEqual(null);
      expect(document.signedJudgeName).toEqual(null);
      expect(document.signedAt).toEqual(null);
    });
  });

  describe('setQCed', () => {
    it('updates the document QC information with user name, id, and date', () => {
      const document = new Document(A_VALID_DOCUMENT, { applicationContext });
      const user = {
        name: 'Jean Luc',
        userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      };
      document.setQCed(user);
      expect(document.qcByUser.name).toEqual('Jean Luc');
      expect(document.qcByUser.userId).toEqual(
        '02323349-87fe-4d29-91fe-8dd6916d2fda',
      );
      expect(document.qcAt).toBeDefined();
    });
  });

  describe('getQCWorkItem', () => {
    it('returns the first workItem with isQC = true', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          workItems: [
            {
              assigneeId: '49b4789b-3c90-4940-946c-95a700d5a501',
              assigneeName: 'bill',
              caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              caseStatus: 'new',
              caseTitle: 'Johnny Joe Jacobson',
              docketNumber: '101-18',
              document: {},
              isQC: false,
              messages: [
                {
                  from: 'Test User',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'hello world',
                  messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
                },
              ],
              sentBy: 'bill',
              workItemId: 'dda4acce-7b0f-40e2-b5a7-261b5c0dee28',
            },
            {
              assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
              assigneeName: 'bob',
              caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              caseStatus: 'new',
              caseTitle: 'Johnny Joe Jacobson',
              docketNumber: '101-18',
              document: {},
              isQC: true,
              messages: [
                {
                  from: 'Test User',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'hello world',
                  messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
                },
              ],
              sentBy: 'bob',
              workItemId: '062d334b-7589-4b28-9dcf-72989574b7a7',
            },
          ],
        },
        { applicationContext },
      );

      expect(document.getQCWorkItem()).toMatchObject({
        workItemId: '062d334b-7589-4b28-9dcf-72989574b7a7',
      });
    });

    it('returns undefined if there is no QC work item', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          workItems: [
            {
              assigneeId: '49b4789b-3c90-4940-946c-95a700d5a501',
              assigneeName: 'bill',
              caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              caseStatus: 'new',
              caseTitle: 'Johnny Joe Jacobson',
              docketNumber: '101-18',
              document: {},
              isQC: false,
              messages: [
                {
                  from: 'Test User',
                  fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'hello world',
                  messageId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
                },
              ],
              sentBy: 'bill',
              workItemId: 'dda4acce-7b0f-40e2-b5a7-261b5c0dee28',
            },
          ],
        },
        { applicationContext },
      );

      expect(document.getQCWorkItem()).toBeUndefined();
    });
  });

  describe('isAutoServed', () => {
    it('should return true if the documentType is an external document and the documentTitle does not contain Simultaneous', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentTitle: 'Answer to Second Amendment to Petition',
          documentType: 'Answer to Second Amendment to Petition',
        },
        { applicationContext },
      );
      expect(document.isAutoServed()).toBeTruthy();
    });

    it('should return true if the documentType is a practitioner association document and the documentTitle does not contain Simultaneous', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentTitle: 'Entry of Appearance',
          documentType: 'Entry of Appearance',
        },
        { applicationContext },
      );
      expect(document.isAutoServed()).toBeTruthy();
    });

    it('should return false if the documentType is an external document and the documentTitle contains Simultaneous', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentTitle: 'Amended Simultaneous Memoranda of Law',
          documentType: 'Amended Simultaneous Memoranda of Law',
        },
        { applicationContext },
      );
      expect(document.isAutoServed()).toBeFalsy();
    });

    it('should return false if the documentType is an internally-filed document', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentTitle: 'Application for Examination Pursuant to Rule 73',
          documentType: 'Application for Examination Pursuant to Rule 73',
        },
        { applicationContext },
      );
      expect(document.isAutoServed()).toBeFalsy();
    });
  });

  describe('setAsServed', () => {
    it('sets the Document as served', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          draftState: {
            documentContents: 'Yee to the haw',
          },
        },
        { applicationContext },
      );
      document.setAsServed();

      expect(document.servedAt).toBeDefined();
      expect(document.draftState).toEqual(null);
    });

    it('sets the Document as served with served parties', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          draftState: {
            documentContents: 'Yee to the haw',
          },
        },
        { applicationContext },
      );

      document.setAsServed([
        {
          name: 'Served Party',
        },
      ]);

      expect(document.servedAt).toBeDefined();
      expect(document.draftState).toEqual(null);
      expect(document.servedParties).toMatchObject([{ name: 'Served Party' }]);
    });
  });

  describe('getFormattedType', () => {
    it('strips out the dash and returns the verbiage after it', () => {
      expect(Document.getFormattedType('T.C. Opinion')).toEqual('T.C. Opinion');
    });

    it("returns the verbiage if there's no dash", () => {
      expect(Document.getFormattedType('Summary Opinion')).toEqual(
        'Summary Opinion',
      );
    });
  });

  describe('secondaryDocument validation', () => {
    it('should not be valid if secondaryDocument is present and the scenario is not Nonstandard H', () => {
      const createdDocument = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          scenario: 'Standard',
          secondaryDocument: {},
        },
        { applicationContext },
      );

      expect(createdDocument.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocument.getFormattedValidationErrors()),
      ).toEqual(['secondaryDocument']);
    });

    it('should be valid if secondaryDocument is undefined and the scenario is not Nonstandard H', () => {
      const createdDocument = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          scenario: 'Standard',
          secondaryDocument: undefined,
        },
        { applicationContext },
      );

      expect(createdDocument.isValid()).toEqual(true);
    });

    it('should be valid if secondaryDocument is not present and the scenario is Nonstandard H', () => {
      const createdDocument = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          scenario: 'Nonstandard H',
          secondaryDocument: undefined,
        },
        { applicationContext },
      );

      expect(createdDocument.isValid()).toEqual(true);
    });

    it('should be valid if secondaryDocument is present and its contents are valid and the scenario is Nonstandard H', () => {
      const createdDocument = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          scenario: 'Nonstandard H',
          secondaryDocument: {
            documentTitle: 'Petition',
            documentType: 'Petition',
            eventCode: 'P',
          },
        },
        { applicationContext },
      );

      expect(createdDocument.isValid()).toEqual(true);
    });

    it('should not be valid if secondaryDocument is present and it is missing fields and the scenario is Nonstandard H', () => {
      const createdDocument = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentId: '777afd4b-1408-4211-a80e-3e897999861a',
          scenario: 'Nonstandard H',
          secondaryDocument: {},
        },
        { applicationContext },
      );

      expect(createdDocument.isValid()).toEqual(false);
      expect(
        Object.keys(createdDocument.getFormattedValidationErrors()),
      ).toEqual(['documentType', 'eventCode']);
    });
  });
});
