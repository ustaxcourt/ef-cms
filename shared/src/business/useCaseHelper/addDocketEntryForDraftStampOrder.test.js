const {
  addDocketEntryForDraftStampOrder,
} = require('./addDocketEntryForDraftStampOrder');
const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');

const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');

//todo: update these
describe('addDocketEntryForDraftStampOrder', () => {
  const caseEntity = new Case(MOCK_CASE, { applicationContext });

  it.only('should add a draft docket entry for a stamped order', async () => {
    const newDocketEntriesFromNewCaseCount =
      caseEntity.docketEntries.length + 1;

    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      orderPdfData: testPdfDoc,
    });

    expect(caseEntity.docketEntries.length).toEqual(
      newDocketEntriesFromNewCaseCount,
    );

    const stampOrderDraftDocketEntry = caseEntity.docketEntries.find(
      entry => entry.eventCode === 'O',
    );
    expect(stampOrderDraftDocketEntry.isDraft).toEqual(true);
    expect(stampOrderDraftDocketEntry.documentTitle).toEqual('Order');
  });

  it('should update the case to contain the draft order docket entry', async () => {
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

  it('should upload a generated pdf for the provided document', async () => {
    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();
  });
});
