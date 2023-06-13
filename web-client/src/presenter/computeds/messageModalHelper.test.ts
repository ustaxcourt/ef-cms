import {
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SERVICES_SUPERVISOR_SECTION,
  SECTIONS,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from './messageModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('messageModalHelper', () => {
  const mockConstants = {
    CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
    CASE_SERVICES_SUPERVISOR_SECTION,
    SECTIONS,
  };
  const mockDocketEntryIdOnDocketRecord = '123';
  const mockDocketEntryIdAlsoOnDocketRecord = '234';
  const JUDGES_CHAMBERS = applicationContext
    .getPersistenceGateway()
    .getJudgesChambers();

  const mockDocketEntryWithFileAttachedOnDocketRecord = {
    descriptionDisplay: 'Hello with additional info',
    documentId: mockDocketEntryIdOnDocketRecord,
    documentType: 'Petition',
    index: 1,
    isFileAttached: true,
    isOnDocketRecord: true,
  };

  const mockDocketEntryWithFileAttachedOnDocketRecordAndNoDescription = {
    documentId: mockDocketEntryIdAlsoOnDocketRecord,
    documentTitle: 'Some Document',
    index: 2,
    isFileAttached: true,
    isOnDocketRecord: true,
  };

  const mockDocketEntries = [
    mockDocketEntryWithFileAttachedOnDocketRecord,
    mockDocketEntryWithFileAttachedOnDocketRecordAndNoDescription,
    { index: 3, isOnDocketRecord: true },
  ];

  const mockDraftDocketEntry = {
    documentId: '345',
    documentTitle: 'Order to do something',
    documentType: 'Order',
    isDraft: true,
  };

  const mockDraftDocketEntryNoTitle = {
    documentType: 'Hello documentType',
    isDraft: true,
  };

  const mockDraftDocuments = [
    mockDraftDocketEntry,
    mockDraftDocketEntryNoTitle,
  ];

  const mockCorrespondences = [
    {
      correspondenceId: '986',
      documentTitle: 'Test Correspondence',
    },
  ];

  const baseState = {
    caseDetail: {},
    modal: {
      form: {
        attachments: [],
      },
    },
    screenMetadata: {},
  };

  const messageModalHelper = withAppContextDecorator(
    messageModalHelperComputed,
    applicationContext,
  );

  describe('correspondence', () => {
    it('should be set to the list of correspondences from formattedCaseDetail', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: mockCorrespondences,
        draftDocuments: [],
        formattedDocketEntries: [],
      });

      const { correspondence } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(correspondence).toBe(mockCorrespondences);
    });

    it('should set a title on each entry from the documentTitle or documentType', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        draftDocuments: mockDraftDocuments,
        formattedDocketEntries: [],
      });

      const { draftDocuments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(draftDocuments).toMatchObject([
        {
          title: mockDraftDocketEntry.documentTitle,
        },
        {
          title: mockDraftDocketEntryNoTitle.documentType,
        },
      ]);
    });
  });

  describe('documents', () => {
    it('should include only documents that are on the docket record', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: [],
        formattedDocketEntries: mockDocketEntries,
      });

      const { documents } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(documents).toMatchObject([
        { documentId: mockDocketEntryIdOnDocketRecord },
        { documentId: mockDocketEntryIdAlsoOnDocketRecord },
      ]);
      expect(documents.length).toEqual(2);
    });

    it('should set a title on each entry from either the descriptionDisplay or documentType', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        draftDocuments: [],
        formattedDocketEntries: mockDocketEntries,
      });

      const { documents } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(documents[0].title).toEqual(
        mockDocketEntryWithFileAttachedOnDocketRecord.descriptionDisplay,
      );
      expect(documents[1].title).toEqual(
        mockDocketEntryWithFileAttachedOnDocketRecordAndNoDescription.documentType,
      );
    });
  });

  describe('draftDocuments', () => {
    it('should be set to the list of draftDocuments from formattedCaseDetail', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: mockDraftDocuments,
        formattedDocketEntries: [],
      });

      const { draftDocuments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(draftDocuments).toBe(mockDraftDocuments);
    });
  });

  describe('hasCorrespondence', () => {
    it('should be true when there is at least one correspondence document on the case', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: mockCorrespondences,
        draftDocuments: [],
        formattedDocketEntries: [],
      });

      const { hasCorrespondence } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(hasCorrespondence).toEqual(true);
    });

    it('should be false when there are NO correspondence documents on the case', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: [],
        formattedDocketEntries: [],
      });

      const { hasCorrespondence } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(hasCorrespondence).toEqual(false);
    });
  });

  describe('hasDocuments', () => {
    it('should be true when there is at least one docketEntry on the docket record with file attached on the case', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: [],
        formattedDocketEntries: [mockDocketEntryWithFileAttachedOnDocketRecord],
      });

      const { hasDocuments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(hasDocuments).toEqual(true);
    });

    it('should be false when there are NO docketEntries on the case', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: [],
        formattedDocketEntries: [],
      });

      const { hasDocuments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(hasDocuments).toEqual(false);
    });
  });

  describe('hasDraftDocuments', () => {
    it('should be true when there is at least one draft documents on the case', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: [mockDraftDocketEntry],
        formattedDocketEntries: [],
      });

      const { hasDraftDocuments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(hasDraftDocuments).toEqual(true);
    });

    it('should be false when there are NO draft documents on the case', () => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: [],
        draftDocuments: [],
        formattedDocketEntries: [],
      });

      const { hasDraftDocuments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(hasDraftDocuments).toEqual(false);
    });
  });

  describe('showAddDocumentForm', () => {
    it("should be true when the message doesn't have any attachments", () => {
      const { showAddDocumentForm } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(showAddDocumentForm).toEqual(true);
    });

    it('should be true when screenMetadata.showAddDocumentForm is true and the maximum number of attachments has not been met', () => {
      applicationContext.getConstants.mockReturnValue({
        ...mockConstants,
        CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT: 2,
      });

      const { showAddDocumentForm } = runCompute(messageModalHelper, {
        state: {
          caseDetail: {},
          modal: {
            form: {
              attachments: [{}], // 1/2 documents attached
            },
          },
          screenMetadata: {
            showAddDocumentForm: true,
          },
        },
      });

      expect(showAddDocumentForm).toEqual(true);
    });

    it('should be false when screenMetadata.showAddDocumentForm is false and the maximum number of attachments has not been met', () => {
      applicationContext.getConstants.mockReturnValue({
        ...mockConstants,
        CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT: 2,
      });

      const { showAddDocumentForm } = runCompute(messageModalHelper, {
        state: {
          caseDetail: {},
          modal: {
            form: {
              attachments: [{}], // 1/2 documents attached
            },
          },
          screenMetadata: {
            showAddDocumentForm: false,
          },
        },
      });

      expect(showAddDocumentForm).toEqual(false);
    });

    it('should be false when screenMetadata.showAddDocumentForm is true and maximum number of attachments have been reached', () => {
      applicationContext.getConstants.mockReturnValue({
        ...mockConstants,
        CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT: 2,
      });

      const { showAddDocumentForm } = runCompute(messageModalHelper, {
        state: {
          caseDetail: {},
          modal: {
            form: {
              attachments: [{}, {}], // 2/2 documents attached
            },
          },
          screenMetadata: {
            showAddDocumentForm: true,
          },
        },
      });

      expect(showAddDocumentForm).toEqual(false);
    });
  });

  describe('showAddMoreDocumentsButton', () => {
    it('should be true when there is at least one attachment already but the maximum number of attachments have not been reached', () => {
      applicationContext.getConstants.mockReturnValue({
        ...mockConstants,
        CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT: 2,
      });

      const { showAddMoreDocumentsButton } = runCompute(messageModalHelper, {
        state: {
          caseDetail: {},
          modal: {
            form: {
              attachments: [{}], // 1/2 documents attached
            },
          },
          screenMetadata: {},
        },
      });

      expect(showAddMoreDocumentsButton).toEqual(true);
    });

    it('should be false when the maximum number of attachments have been reached', () => {
      applicationContext.getConstants.mockReturnValue({
        ...mockConstants,
        CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT: 2,
      });

      const { showAddMoreDocumentsButton } = runCompute(messageModalHelper, {
        state: {
          caseDetail: {},
          modal: {
            form: {
              attachments: [{}, {}], // 2/2 documents attached
            },
          },
          screenMetadata: {},
        },
      });

      expect(showAddMoreDocumentsButton).toEqual(false);
    });
  });

  describe('showMessageAttachments', () => {
    beforeEach(() => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: mockCorrespondences,
        draftDocuments: [],
        formattedDocketEntries: [],
      });
    });

    it('should be true when there is at least one attachment on the message', () => {
      const { showMessageAttachments } = runCompute(messageModalHelper, {
        state: {
          caseDetail: {},
          modal: {
            form: {
              attachments: [{}],
            },
          },
          screenMetadata: {},
        },
      });

      expect(showMessageAttachments).toEqual(true);
    });

    it('should be false when message does not have any attachments', () => {
      const { showMessageAttachments } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(showMessageAttachments).toEqual(false);
    });
  });

  describe('section display', () => {
    beforeEach(() => {
      applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
        correspondence: mockCorrespondences,
        draftDocuments: [],
        formattedDocketEntries: [],
      });
    });

    it('should display the associated section', () => {
      const { chambersDisplay, sectionDisplay } = runCompute(
        messageModalHelper,
        {
          state: {
            caseDetail: {},
            modal: {
              form: {
                attachments: [{}, {}], // 2/2 documents attached
              },
            },
            screenMetadata: {},
          },
        },
      );

      expect(
        sectionDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section),
      ).toBe(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label);
      expect(
        chambersDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section),
      ).toBe(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label);
    });

    it('returns the chambers display for section display if the section is a chambers', () => {
      const { chambersDisplay, sectionDisplay } = runCompute(
        messageModalHelper,
        {
          state: {
            ...baseState,
            modal: {
              form: {
                attachments: [{}],
              },
            },
            screenMetadata: {},
          },
        },
      );

      expect(
        sectionDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section),
      ).toBe(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label);
      expect(
        chambersDisplay(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.section),
      ).toBe(JUDGES_CHAMBERS.URDAS_CHAMBERS_SECTION.label);
    });

    it('returns undefined for sectionDisplay if the section is not a regular section or a chambers', () => {
      const { sectionDisplay } = runCompute(messageModalHelper, {
        state: baseState,
      });

      expect(sectionDisplay('something')).toBeUndefined();
    });
  });

  it('should return the sectionListWithoutSupervisorRole as SECTIONS without the CASE_SERVICES_SUPERVISOR_SECTION', () => {
    applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
      correspondence: [],
      draftDocuments: [],
      formattedDocketEntries: [mockDocketEntryWithFileAttachedOnDocketRecord],
    });

    const { sectionListWithoutSupervisorRole } = runCompute(
      messageModalHelper,
      {
        state: baseState,
      },
    );

    expect(sectionListWithoutSupervisorRole).not.toContain(
      CASE_SERVICES_SUPERVISOR_SECTION,
    );
  });
});
