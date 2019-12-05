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
  let applicationContext;

  beforeAll(() => {
    applicationContext = {
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
  });

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
        eventCode: 'PSDEC',
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
      try {
        const document = new Document(A_VALID_DOCUMENT, { applicationContext });
        document.documentId = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
        document.validate();
      } catch (err) {
        error = err;
      }
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

    it('should generate correct filedBy string for partyPrimary and partyRespondent', () => {
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
          partyPrimary: true,
          partyRespondent: true,
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

    it('should generate correct filedBy string for partyPrimary and partyRespondent only once', () => {
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
          partyPrimary: false,
          partyRespondent: true,
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

    it('should generate correct filedBy string for partyPrimary and partyRespondent more than once with force = true', () => {
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
          partyPrimary: false,
          partyRespondent: true,
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

    it('should generate correct filedBy string for partyRespondent and partyPractitioner (as an object, legacy data)', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: {
            name: 'Test Practitioner',
          },
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyRespondent and partyPractitioner', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: true,
            },
          ],
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp. & Counsel Test Practitioner');
    });

    it('should generate correct filedBy string for partyRespondent and partyPractitioner set to false', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: false,
            },
          ],
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
        },
        { applicationContext },
      );
      document.generateFiledBy(caseDetail);
      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyRespondent and multiple partyPractitioners', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: true,
            },
            {
              name: 'Test Practitioner1',
              partyPractitioner: true,
            },
          ],
          previousDocument: 'Amended Petition',
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

    it('should generate correct filedBy string for partyRespondent and multiple partyPractitioners with one set to false', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: false,
            },
            {
              name: 'Test Practitioner1',
              partyPractitioner: true,
            },
          ],
          previousDocument: 'Amended Petition',
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

    it('should generate correct filedBy string for partyPrimary and partyRespondent in the constructor when values are present', () => {
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
          partyPrimary: true,
          partyRespondent: true,
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

    it('should generate correct filedBy string for partyRespondent and partyPractitioner in the constructor when values are present', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: true,
            },
          ],
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Resp. & Counsel Test Practitioner');
    });

    it('should generate correct filedBy string for partyRespondent and partyPractitioner set to false in the constructor when values are present', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: false,
            },
          ],
          previousDocument: 'Amended Petition',
          relationship: 'primarySupportingDocument',
          scenario: 'Nonstandard C',
          ...caseDetail,
        },
        { applicationContext },
      );
      expect(document.filedBy).toEqual('Resp.');
    });

    it('should generate correct filedBy string for partyRespondent and multiple partyPractitioners in the constructor when values are present', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: true,
            },
            {
              name: 'Test Practitioner1',
              partyPractitioner: true,
            },
          ],
          previousDocument: 'Amended Petition',
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

    it('should generate correct filedBy string for partyRespondent and multiple partyPractitioners with one set to false in the constructor when values are present', () => {
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
          partyPractitioner: true,
          partyRespondent: true,
          practitioner: [
            {
              name: 'Test Practitioner',
              partyPractitioner: false,
            },
            {
              name: 'Test Practitioner1',
              partyPractitioner: true,
            },
          ],
          previousDocument: 'Amended Petition',
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
      document.setSigned('abc-123');

      expect(document.signedByUserId).toEqual('abc-123');
      expect(document.signedAt).toBeDefined();

      document.unsignDocument();

      expect(document.signedByUserId).toEqual(null);
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

  describe('isPublicAccessible', () => {
    it('should be public accessible if it is a served Stipulated Decision document', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentType: 'Stipulated Decision',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isPublicAccessible()).toBeTruthy();
    });

    it('should be public accessible if it is a served Order document', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentType: 'Order',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isPublicAccessible()).toBeTruthy();
    });

    it('should be public accessible if it is a served court-issued order document', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentType: 'O - Order',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isPublicAccessible()).toBeTruthy();
    });

    it('should not be public accessible if it is an unserved court-issued document', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentType: 'Stipulated Decision',
        },
        { applicationContext },
      );
      expect(document.isPublicAccessible()).toBeFalsy();
    });

    it('should not be public accessible if it is a served non-court-issued document', () => {
      const document = new Document(
        {
          ...A_VALID_DOCUMENT,
          documentType: 'Petition',
          servedAt: '2019-03-01T21:40:46.415Z',
        },
        { applicationContext },
      );
      expect(document.isPublicAccessible()).toBeFalsy();
    });
  });
});
