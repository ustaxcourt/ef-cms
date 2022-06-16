const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  PARTY_TYPES,
} = require('../entities/EntityConstants');
const { addCoversheetInteractor } = require('./addCoversheetInteractor');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');

describe('addCoversheetInteractor', () => {
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;

  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.pending,
      },
    ],
  };

  const optionalTestingCaseData = {
    ...testingCaseData,
    docketEntries: [
      {
        ...testingCaseData.docketEntries[0],
        addToCoversheet: true,
        additionalInfo: 'Additional Info Something',
        certificateOfService: true,
        certificateOfServiceDate: '2019-04-20T05:00:00.000Z',
        docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
        docketNumber: '102-19',
        documentType:
          'Motion for Entry of Order that Undenied Allegations be Deemed Admitted Pursuant to Rule 37(c)',
        eventCode: 'M008',
        filedBy: 'Test Petitioner1',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
        lodged: true,
      },
    ],
    docketNumber: '102-19',
    partyType: PARTY_TYPES.petitionerSpouse,
    petitioners: [
      {
        contactType: CONTACT_TYPES.primary,
        name: 'Janie Petitioner',
      },
      {
        contactType: CONTACT_TYPES.secondary,
        name: 'Janie Petitioner',
      },
    ],
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(testingCaseData);

    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue({
        current: true,
      });

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('adds a cover page to a pdf document', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('replaces the cover page on a document', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      replaceCoversheet: true,
    });

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it("updates the docket entry's page numbers", async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry,
    ).toHaveBeenCalled();
  });

  it('adds a cover page to a pdf document with optional data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(optionalTestingCaseData);

    await addCoversheetInteractor(applicationContext, {
      docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3858',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it('returns the updated docket entry entity', async () => {
    const updatedDocketEntryEntity = await addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
      },
    );

    expect(updatedDocketEntryEntity).toMatchObject({
      numberOfPages: 2,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });
  });

  it('throws an error when unable to get the pdfData from s3', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => Promise.reject(new Error('error')),
    });

    await expect(
      addCoversheetInteractor(applicationContext, {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        replaceCoversheet: true,
      }),
    ).rejects.toThrow('error');
  });

  it('should call getCaseByDocketNumber to retrieve case entity if it is not passed in', async () => {
    await addCoversheetInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toBe(MOCK_CASE.docketNumber);
  });

  it('should not call getCaseByDocketNumber if case entity is passed in', async () => {
    await addCoversheetInteractor(applicationContext, {
      caseEntity: new Case(testingCaseData, { applicationContext }),
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });
});
