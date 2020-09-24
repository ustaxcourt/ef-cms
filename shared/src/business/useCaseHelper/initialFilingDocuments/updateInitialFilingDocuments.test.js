const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  PARTY_TYPES,
  ROLES,
} = require('../../../business/entities/EntityConstants');
const {
  updateInitialFilingDocuments,
} = require('./updateInitialFilingDocuments');
const { Case } = require('../../../business/entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('addNewInitialFilingToCase', () => {
  const mockRQT = {
    docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
    filedBy: 'Test Petitioner',
    userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
  };

  let mockOriginalCase;
  let mockCaseToUpdate;

  const petitionsClerkUser = {
    name: 'petitions clerk',
    role: ROLES.petitionsClerk,
    userId: '54cddcd9-d012-4874-b74f-73732c95d42b',
  };

  beforeAll(() => {});

  it('should add a new initial filing document to the case when the document does not exist on the original case', async () => {
    mockOriginalCase = new Case(
      { ...MOCK_CASE, docketEntries: [] },
      { applicationContext },
    );

    mockCaseToUpdate = {
      ...MOCK_CASE,
      docketEntries: [...MOCK_CASE.docketEntries, mockRQT],
    };

    await updateInitialFilingDocuments({
      applicationContext,
      authorizedUser: petitionsClerkUser,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const rqtFile = mockOriginalCase.docketEntries.find(
      d => d.docketEntryId === mockRQT.docketEntryId,
    );
    expect(rqtFile).toBeDefined();
  });

  it('should set isFileAttached and isPaper to true', async () => {
    mockOriginalCase = new Case(
      { ...MOCK_CASE, docketEntries: [] },
      { applicationContext },
    );

    mockCaseToUpdate = {
      ...MOCK_CASE,
      docketEntries: [...MOCK_CASE.docketEntries, mockRQT],
    };

    await updateInitialFilingDocuments({
      applicationContext,
      authorizedUser: petitionsClerkUser,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const filedDocument = mockOriginalCase.docketEntries.find(
      d => d.docketEntryId === mockRQT.docketEntryId,
    );
    expect(filedDocument.isFileAttached).toBeTruthy();
    expect(filedDocument.isPaper).toBeTruthy();
  });

  it('should set partyPrimary and partySecondary to true if there is a contactSecondary', async () => {
    mockOriginalCase = new Case(
      {
        ...MOCK_CASE,
        contactSecondary: {
          address1: '123 Main St',
          city: 'Somewhere',
          name: 'Test Petitioner',
          postalCode: '12345',
          state: 'TX',
        },
        docketEntries: [],
        partyType: PARTY_TYPES.petitionerSpouse,
      },
      { applicationContext },
    );

    mockCaseToUpdate = {
      ...MOCK_CASE,
      contactSecondary: {
        address1: '123 Main St',
        city: 'Somewhere',
        name: 'Test Petitioner',
        postalCode: '12345',
        state: 'TX',
      },
      docketEntries: [...MOCK_CASE.docketEntries, mockRQT],
      partyType: PARTY_TYPES.petitionerSpouse,
    };

    await updateInitialFilingDocuments({
      applicationContext,
      authorizedUser: petitionsClerkUser,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const filedDocument = mockOriginalCase.docketEntries.find(
      d => d.docketEntryId === mockRQT.docketEntryId,
    );
    expect(filedDocument.partyPrimary).toBeTruthy();
    expect(filedDocument.partySecondary).toBeTruthy();
  });

  it('should remove a new initial filing document from the case when the document does not exist on the case from the form', async () => {
    mockCaseToUpdate = { ...MOCK_CASE, docketEntries: [] };
    mockOriginalCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [...MOCK_CASE.docketEntries, mockRQT],
      },
      { applicationContext },
    );

    await updateInitialFilingDocuments({
      applicationContext,
      authorizedUser: petitionsClerkUser,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const rqtFile = mockOriginalCase.docketEntries.find(
      d => d.docketEntryId === mockRQT.docketEntryId,
    );
    expect(rqtFile).toBeUndefined();
  });

  it('should remove the original document and add the new one to the case when the document has been re-added', async () => {
    mockOriginalCase = new Case(
      { ...MOCK_CASE, docketEntries: [...MOCK_CASE.docketEntries, mockRQT] },
      { applicationContext },
    );

    const mockNewRQT = {
      ...mockRQT,
      docketEntryId: applicationContext.getUniqueId(),
    };
    mockCaseToUpdate = {
      ...MOCK_CASE,
      docketEntries: [...MOCK_CASE.docketEntries, mockNewRQT],
    };

    await updateInitialFilingDocuments({
      applicationContext,
      authorizedUser: petitionsClerkUser,
      caseEntity: mockOriginalCase,
      caseToUpdate: mockCaseToUpdate,
    });

    const oldRqtFile = mockOriginalCase.docketEntries.find(
      d => d.docketEntryId === mockRQT.docketEntryId,
    );
    expect(oldRqtFile).toBeUndefined();
    const newRqtFile = mockOriginalCase.docketEntries.find(
      d => d.docketEntryId === mockNewRQT.docketEntryId,
    );
    expect(newRqtFile).toBeDefined();
  });
});
