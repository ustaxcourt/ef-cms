const {
  addDocketEntryForSystemGeneratedOrder,
} = require('./addDocketEntryForSystemGeneratedOrder');
const {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../entities/EntityConstants');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');

describe('addDocketEntryForSystemGeneratedOrder', () => {
  const caseEntity = new Case(MOCK_CASE, { applicationContext });

  const {
    noticeOfAttachmentsInNatureOfEvidence,
    orderForAmendedPetition,
    orderForFilingFee,
  } = SYSTEM_GENERATED_DOCUMENT_TYPES;

  it('should add a draft docket entry for a system generated order', async () => {
    const newDocketEntriesFromNewCaseCount =
      caseEntity.docketEntries.length + 1;

    await addDocketEntryForSystemGeneratedOrder({
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
    await addDocketEntryForSystemGeneratedOrder({
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

    await addDocketEntryForSystemGeneratedOrder({
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
    await addDocketEntryForSystemGeneratedOrder({
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
    await addDocketEntryForSystemGeneratedOrder({
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

    await addDocketEntryForSystemGeneratedOrder({
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

  it('should append aditional pdf form data when additionalPdfRequired is true', async () => {
    await addDocketEntryForSystemGeneratedOrder({
      additionalPdfRequired: true,
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForAmendedPetition,
    });

    expect(
      applicationContext.getUtilities().appendAmendedPetitionFormToOrder,
    ).toHaveBeenCalled();
  });
});
