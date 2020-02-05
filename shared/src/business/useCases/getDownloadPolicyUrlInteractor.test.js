const {
  getDownloadPolicyUrlInteractor,
} = require('./getDownloadPolicyUrlInteractor');
const { cloneDeep } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('getDownloadPolicyUrlInteractor', () => {
  let applicationContext;
  let user;
  let verifyCaseForUserMock;
  let getCaseByCaseIdMock;

  beforeEach(() => {
    getCaseByCaseIdMock = jest.fn().mockReturnValue(MOCK_CASE);

    applicationContext = {
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdMock,
        getDownloadPolicyUrl: () => 'localhost',
        verifyCaseForUser: verifyCaseForUserMock,
      }),
    };
  });

  it('throw unauthorized error on invalid role', async () => {
    user = {
      role: 'admin',
      userId: 'petitioner',
    };

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throw unauthorized error if user is not associated with case', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
    verifyCaseForUserMock = jest.fn().mockReturnValue(false);

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('throw unauthorized error if user is associated with the case but the document is not available for viewing at this time', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
    verifyCaseForUserMock = jest.fn().mockReturnValue(true);

    const duplicatedMockCase = cloneDeep(MOCK_CASE);
    duplicatedMockCase.documents.push({
      createdAt: '2018-01-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: '4028c310-d65d-497a-8a5d-1d0c4ccb4813',
      documentTitle: 'Transcript of [anything] on [date]',
      documentType: 'TRAN - Transcript',
      eventCode: 'TRAN',
      processingStatus: 'pending',
      secondaryDate: '2200-01-21T20:49:28.192Z',
      userId: 'petitioner',
      workItems: [],
    });
    getCaseByCaseIdMock = jest.fn().mockReturnValue(duplicatedMockCase);

    await expect(
      getDownloadPolicyUrlInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        documentId: '4028c310-d65d-497a-8a5d-1d0c4ccb4813',
      }),
    ).rejects.toThrow('Unauthorized to view document at this time');
  });

  it('returns the expected policy url for a petitioner who is associated with the case and viewing an available document', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
    verifyCaseForUserMock = jest.fn().mockReturnValue(true);

    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(url).toEqual('localhost');
  });

  it('returns the url for an internal user role even if verifyCaseForUser returns false', async () => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    };
    verifyCaseForUserMock = jest.fn().mockReturnValue(false);

    const url = await getDownloadPolicyUrlInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(url).toEqual('localhost');
  });
});
