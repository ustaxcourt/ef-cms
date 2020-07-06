const {
  getDownloadPolicyUrlInteractor,
} = require('./getDownloadPolicyUrlInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('getDownloadPolicyUrlInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue('localhost');
  });

  it('throw unauthorized error on invalid role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.admin,
      userId: 'petitioner',
    });

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throw unauthorized error if user is not associated with case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throw unauthorized error if user is associated with the case but the document is not available for viewing at this time', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    const duplicatedMockCase = cloneDeep(MOCK_CASE);
    duplicatedMockCase.documents.push({
      createdAt: '2018-01-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: '4028c310-d65d-497a-8a5d-1d0c4ccb4813',
      documentTitle: 'Transcript of [anything] on [date]',
      documentType: 'Transcript',
      eventCode: 'TRAN',
      processingStatus: 'pending',
      secondaryDate: '2200-01-21T20:49:28.192Z',
      userId: 'petitioner',
      workItems: [],
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(duplicatedMockCase);

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: '4028c310-d65d-497a-8a5d-1d0c4ccb4813',
      }),
    ).rejects.toThrow('Unauthorized to view document at this time');
  });

  it('returns the expected policy url for a petitioner who is associated with the case and viewing an available document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(url).toEqual('localhost');
  });

  it('returns the expected policy url for a petitioner who is associated with the case and viewing a case confirmation pdf', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: 'case-101-18-confirmation.pdf',
    });
    expect(url).toEqual('localhost');
  });

  it('throws an Unauthorized error for a petitioner attempting to access an case confirmation pdf for a different case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId, //docket number is 101-18
        documentId: 'case-101-20-confirmation.pdf',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns the url for an internal user role even if verifyCaseForUser returns false', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(url).toEqual('localhost');
  });

  it('throws an error if the user role is irsSuperuser and the petition document on the case is not served', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsSuperuser,
      userId: 'irsSuperuser',
    });

    MOCK_CASE.documents = [
      {
        documentType: 'Petition',
      },
    ];
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized to view case documents at this time');
  });

  it('returns the url if the user role is irsSuperuser and the petition document on the case is served', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.irsSuperuser,
      userId: 'irsSuperuser',
    });

    MOCK_CASE.documents = [
      {
        documentType: 'Petition',
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    ];
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);

    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(url).toEqual('localhost');
  });
});
