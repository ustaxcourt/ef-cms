const {
  addDraftStampOrderDocketEntryInteractor,
} = require('./addDraftStampOrderDocketEntryInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const { ORDER_TYPES } = require('../entities/EntityConstants');

describe('addDraftStampOrderDocketEntryInteractor', () => {
  const mockSigningName = 'Guy Fieri';
  const mockSignedDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3858';
  const mockOriginalDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should add a draft order docket entry to the case', async () => {
    await addDraftStampOrderDocketEntryInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      formattedDraftDocumentTitle:
        'some title with disposition and custom text',
      originalDocketEntryId: mockOriginalDocketEntryId,
      signedDocketEntryId: mockSignedDocketEntryId,
      stampData: { nameForSigning: mockSigningName },
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.docketEntries.length).toEqual(
      MOCK_DOCUMENTS.length + 1,
    );
    const draftOrder = caseToUpdate.docketEntries.find(
      e => e.documentType === ORDER_TYPES[0].documentType,
    );
    expect(draftOrder.docketNumber).toEqual(caseToUpdate.docketNumber);

    const draftDocketEntryEntity = caseToUpdate.docketEntries.find(
      doc =>
        doc.documentType === ORDER_TYPES[0].documentType &&
        doc.docketEntryId === mockSignedDocketEntryId,
    );

    expect(draftDocketEntryEntity.docketEntryId).toEqual(
      mockSignedDocketEntryId,
    );
    expect(draftDocketEntryEntity.isDraft).toEqual(true);
    const motionDocumentType = MOCK_CASE.docketEntries.find(
      e => e.docketEntryId === mockOriginalDocketEntryId,
    ).documentType;
    expect(draftDocketEntryEntity.freeText).toEqual(
      `${motionDocumentType} some title with disposition and custom text`,
    );
    expect(draftDocketEntryEntity.signedJudgeName).toEqual(mockSigningName);
    expect(draftDocketEntryEntity.documentType).toEqual(
      ORDER_TYPES[0].documentType,
    );
  });
});
