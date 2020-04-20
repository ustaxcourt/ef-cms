const { applicationContext } = require('../test/createTestApplicationContext');
const { Document } = require('./Document');
const { Message } = require('./Message');
const { User } = require('./User');
const { WorkItem } = require('./WorkItem');

const A_VALID_DOCUMENT = {
  documentType: 'Petition',
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};
const caseDetail = {
  contactPrimary: {
    name: 'Bob',
  },
  contactSecondary: {
    name: 'Bill',
  },
};

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
    });

    it('Creates an invalid document with no document type', () => {
      const myDoc = new Document(
        {
          userId: '123',
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
          assigneeId: 'bob',
          assigneeName: 'bob',
          caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          caseStatus: 'new',
          caseTitle: 'testing',
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

      expect(document.documentContents).toBeDefined();
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
      const user = { name: 'Jean Luc', userId: 'ncc-1701-c' };
      document.setQCed(user);
      expect(document.qcByUser.name).toEqual('Jean Luc');
      expect(document.qcByUser.userId).toEqual('ncc-1701-c');
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
              assigneeId: 'bill',
              assigneeName: 'bill',
              caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              caseStatus: 'new',
              caseTitle: 'testing',
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
              assigneeId: 'bob',
              assigneeName: 'bob',
              caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              caseStatus: 'new',
              caseTitle: 'testing',
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
              assigneeId: 'bill',
              assigneeName: 'bill',
              caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
              caseStatus: 'new',
              caseTitle: 'testing',
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

      expect(document.status).toEqual('served');
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

      expect(document.status).toEqual('served');
      expect(document.servedAt).toBeDefined();
      expect(document.draftState).toEqual(null);
      expect(document.servedParties).toMatchObject([{ name: 'Served Party' }]);
    });
  });
});
