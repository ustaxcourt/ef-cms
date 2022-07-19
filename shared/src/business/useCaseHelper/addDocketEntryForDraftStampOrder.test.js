const {
  addDocketEntryForDraftStampOrder,
} = require('./addDocketEntryForDraftStampOrder');
const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');

const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const caseEntity = new Case(MOCK_CASE, { applicationContext });
const newDocketEntriesFromNewCaseCount = caseEntity.docketEntries.length + 1;

describe('addDocketEntryForDraftStampOrder', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseEntity);
  });

  it('should add a draft docket entry for a stamped order', async () => {
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
    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      orderPdfData: testPdfDoc,
    });

    const draftStampOrder = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'O',
      );

    expect(draftStampOrder).toBeDefined();
  });

  it('should upload a generated pdf for the provided document', async () => {
    await addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      orderPdfData: testPdfDoc,
    });

    expect(applicationContext.getUtilities().uploadToS3).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });
});
