const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CONTACT_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  updateInitialFilingDocuments,
} = require('./updateInitialFilingDocuments');
const { Case, getContactPrimary } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('addNewInitialFilingToCase', () => {
  const mockRQT = {
    docketEntryId: 'b6b81f4d-1e47-423a-8caf-6d2fdc3d3850',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
    filedBy: 'Test Petitioner',
    isOnDocketRecord: true,
    userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
  };
  const mockPetition = MOCK_DOCUMENTS.find(
    mockDocument =>
      mockDocument.documentType ===
      INITIAL_DOCUMENT_TYPES.petition.documentType,
  );

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
      { ...MOCK_CASE, docketEntries: [mockPetition] },
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
    expect(rqtFile.index).toBeDefined();
  });

  it('should set isFileAttached and isPaper to true', async () => {
    mockOriginalCase = new Case(
      { ...MOCK_CASE, docketEntries: [mockPetition] },
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

  it('should set filers to [contactPrimaryId, contactSecondaryId] if there is a contactSecondary', async () => {
    const mockSecondaryId = 'b30dc487-e83b-4ec6-8f40-8e0d792e8bbe';
    mockOriginalCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [mockPetition],
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            ...MOCK_CASE.petitioners[0],
            contactId: mockSecondaryId,
            contactType: CONTACT_TYPES.secondary,
          },
        ],
      },
      { applicationContext },
    );

    mockCaseToUpdate = {
      ...MOCK_CASE,
      docketEntries: [...MOCK_CASE.docketEntries, mockRQT],
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        ...MOCK_CASE.petitioners,
        {
          ...MOCK_CASE.petitioners[0],
          contactId: mockSecondaryId,
          contactType: CONTACT_TYPES.secondary,
        },
      ],
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
    expect(filedDocument.filers).toEqual([
      getContactPrimary(mockCaseToUpdate).contactId,
      mockSecondaryId,
    ]);
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
    expect(newRqtFile.index).toBeDefined();
  });
});
