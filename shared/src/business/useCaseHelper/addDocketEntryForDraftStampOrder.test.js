const {
  addDocketEntryForDraftStampOrder,
} = require('./addDocketEntryForDraftStampOrder');
const {
  AMENDED_PETITION_FORM_NAME,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');

//todo: update these
describe('addDocketEntryForDraftStampOrder', () => {
  const caseEntity = new Case(MOCK_CASE, { applicationContext });

  const {
    noticeOfAttachmentsInNatureOfEvidence,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
  } = SYSTEM_GENERATED_DOCUMENT_TYPES;

  it('should add a draft docket entry for a system generated order', async () => {
    const newDocketEntriesFromNewCaseCount =
      caseEntity.docketEntries.length + 1;

    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    expect(caseEntity.docketEntries.length).toEqual(
      newDocketEntriesFromNewCaseCount,
    );

    const naneDocketEntry = caseEntity.docketEntries.find(
      entry => entry.eventCode === 'NOT',
    );
    expect(naneDocketEntry.isDraft).toEqual(true);

    const passedInNoticeTitle =
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data
        .orderTitle;

    expect(passedInNoticeTitle).toEqual(passedInNoticeTitle.toUpperCase());
  });

  it('should only add freeText to notices', async () => {
    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    const mostRecentDocketEntry =
      caseEntity.docketEntries[caseEntity.docketEntries.length - 1];

    expect('freeText' in mostRecentDocketEntry).toEqual(true);
    expect('freeText' in mostRecentDocketEntry.draftOrderState).toEqual(true);
  });

  it('should apply a signature for notices', async () => {
    applicationContext.getClerkOfCourtNameForSigning.mockReturnValue(
      'Antonia Lafaso',
    );

    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    const mockSignatureText =
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data
        .signatureText;

    expect(mockSignatureText.length).toBeGreaterThan(0);
  });

  it('should not apply a signature for orders', async () => {
    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForFilingFee,
    });

    const mockSignatureText =
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data
        .signatureText;

    expect(mockSignatureText.length).toEqual(0);
  });

  it('should upload a generated pdf for the provided document', async () => {
    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();
  });

  it('should save documentContents and richText for editing the order', async () => {
    const mockClonedSystemDocument = {
      content: 'Something else',
      documentTitle: 'The Trials and Tribulations of Rufio the Jester',
    };

    const contentToStore = {
      documentContents: 'Something else',
      richText: 'Something else',
    };

    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: mockClonedSystemDocument,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document,
    ).toEqual(Buffer.from(JSON.stringify(contentToStore)));
  });

  it('should append additional pdf form data when the document is an orderForAmendedPetition', async () => {
    const mockAmendedPetitionFormData = 'Elmo the Third';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: jest.fn().mockReturnValue({
        promise: () => ({ Body: mockAmendedPetitionFormData }),
      }),
    });

    const mockCombinedPdfsReturnVal = 'Antonia Lafaso';
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(mockCombinedPdfsReturnVal);

    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForAmendedPetition,
    });

    expect(
      applicationContext.getStorageClient().getObject.mock.calls[0][0].Key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);

    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0]
        .secondPdf,
    ).toEqual(mockAmendedPetitionFormData);
  });

  it('should append additional pdf form data when the document is an orderForAmendedPetitionAndFilingFee', async () => {
    const mockAmendedPetitionFormData = 'Elmo the Third';

    applicationContext.getStorageClient.mockReturnValue({
      getObject: jest.fn().mockReturnValue({
        promise: () => ({ Body: mockAmendedPetitionFormData }),
      }),
    });

    const mockCombinedPdfsReturnVal = 'Antonia Lafaso';
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(mockCombinedPdfsReturnVal);

    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForAmendedPetitionAndFilingFee,
    });

    expect(
      applicationContext.getStorageClient().getObject.mock.calls[0][0].Key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);

    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0]
        .secondPdf,
    ).toEqual(mockAmendedPetitionFormData);
  });
});
