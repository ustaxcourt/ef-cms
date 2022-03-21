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
  let user;
  const caseEntity = new Case(MOCK_CASE, { applicationContext });

  const { noticeOfAttachmentsInNatureOfEvidence, orderForFilingFee } =
    SYSTEM_GENERATED_DOCUMENT_TYPES;

  beforeEach(() => {
    user = applicationContext.getCurrentUser();
  });

  it('should increase the docket entries and upload a generated pdf for noticeOfAttachments', async () => {
    const newDocketEntriesFromNewCaseCount =
      caseEntity.docketEntries.length + 1;

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
      user,
    });

    expect(caseEntity.docketEntries.length).toEqual(
      newDocketEntriesFromNewCaseCount,
    );

    expect(applicationContext.getDocumentGenerators().order).toHaveBeenCalled();
    const passedInNoticeTitle =
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data
        .orderTitle;
    expect(passedInNoticeTitle).toEqual(passedInNoticeTitle.toUpperCase()); //asserts that the passed in title was uppercase

    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('should increase the docket entries and upload a generated pdf for orderForFilingFee', async () => {
    const newDocketEntriesFromNewCaseCount =
      caseEntity.docketEntries.length + 1;

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForFilingFee,
      user,
    });

    expect(caseEntity.docketEntries.length).toEqual(
      newDocketEntriesFromNewCaseCount,
    );

    expect(applicationContext.getDocumentGenerators().order).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('should use the provided document when options are provided', async () => {
    const mockClonedSystemDocument = {
      content: 'Something else',
      documentTitle: 'The Trials and Tribulations of Rufio the Jester',
    };

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      options: {
        clonedSystemDocument: mockClonedSystemDocument,
      },
      systemGeneratedDocument: 'Something',
    });

    expect(
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data
        .orderContent,
    ).toEqual(mockClonedSystemDocument.content);
  });
});
