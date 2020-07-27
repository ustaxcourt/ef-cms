const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  removeConsolidatedCasesInteractor,
} = require('./removeConsolidatedCasesInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

let mockCases;

describe('removeConsolidatedCasesInteractor', () => {
  beforeEach(() => {
    mockCases = {
      'aaaba5a9-b37b-479d-9201-067ec6e33aaa': {
        ...MOCK_CASE,
        caseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '101-19',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'cccca5a9-b37b-479d-9201-067ec6e33ccc': {
        ...MOCK_CASE,
        caseId: 'cccca5a9-b37b-479d-9201-067ec6e33ccc',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '102-19',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'da210494-c410-428f-9d0a-a3fc24405f8d': {
        ...MOCK_CASE,
        caseId: 'da210494-c410-428f-9d0a-a3fc24405f8d',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '103-19',
        leadCaseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'eaaba5a9-b37b-479d-9201-067ec6e33aaa': {
        ...MOCK_CASE,
        caseId: 'eaaba5a9-b37b-479d-9201-067ec6e33aaa',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '104-19',
        leadCaseId: 'eaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
      'fccca5a9-b37b-479d-9201-067ec6e33ccc': {
        ...MOCK_CASE,
        caseId: 'fccca5a9-b37b-479d-9201-067ec6e33ccc',
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '105-19',
        leadCaseId: 'eaaba5a9-b37b-479d-9201-067ec6e33aaa',
      },
    };

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(({ caseId }) => {
        return mockCases[caseId];
      });
    const mockCasesArray = Object.values(mockCases);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        return mockCasesArray.find(c => c.docketNumber === docketNumber);
      });
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId.mockImplementation(({ leadCaseId }) => {
        return Object.keys(mockCases)
          .map(key => mockCases[key])
          .filter(mockCase => mockCase.leadCaseId === leadCaseId);
      });
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) => caseToUpdate);
  });

  it('Should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(
      removeConsolidatedCasesInteractor({
        applicationContext,
        caseIdsToRemove: ['aaaba5a9-b37b-479d-9201-067ec6e33aaa'], // docketNumber: '101-19'
        docketNumber: '102-19',
      }),
    ).rejects.toThrow('Unauthorized for case consolidation');
  });

  it('Should try to get the case by its caseId', async () => {
    await removeConsolidatedCasesInteractor({
      applicationContext,
      caseIdsToRemove: ['aaaba5a9-b37b-479d-9201-067ec6e33aaa'], // docketNumber: '101-19'
      docketNumber: '102-19',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    await expect(
      removeConsolidatedCasesInteractor({
        applicationContext,
        caseIdsToRemove: ['aaaba5a9-b37b-479d-9201-067ec6e33aaa'], // docketNumber: '101-19'
        docketNumber: '111-11',
      }),
    ).rejects.toThrow('Case 111-11 was not found.');
  });

  it('Should return a Not Found error if the case to remove cannot be found', async () => {
    await expect(
      removeConsolidatedCasesInteractor({
        applicationContext,
        caseIdsToRemove: ['xxxba5a9-b37b-479d-9201-067ec6e33xxx'],
        docketNumber: '102-19',
      }),
    ).rejects.toThrow(
      'Case to consolidate with (xxxba5a9-b37b-479d-9201-067ec6e33xxx) was not found.',
    );
  });

  it('Should only update the removed case if the case to remove is not the lead case', async () => {
    await removeConsolidatedCasesInteractor({
      applicationContext,
      caseIdsToRemove: ['cccca5a9-b37b-479d-9201-067ec6e33ccc'], // docketNumber: '102-19'
      docketNumber: '101-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'cccca5a9-b37b-479d-9201-067ec6e33ccc',
      leadCaseId: undefined,
    });
  });

  it('Should update the removed case and all other currently consolidated cases if the case to remove is the lead case', async () => {
    await removeConsolidatedCasesInteractor({
      applicationContext,
      caseIdsToRemove: ['aaaba5a9-b37b-479d-9201-067ec6e33aaa'], // docketNumber: '101-19'
      docketNumber: '102-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(3);
    // first updates cases with new lead case id
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'cccca5a9-b37b-479d-9201-067ec6e33ccc',
      leadCaseId: 'cccca5a9-b37b-479d-9201-067ec6e33ccc',
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'da210494-c410-428f-9d0a-a3fc24405f8d',
      leadCaseId: 'cccca5a9-b37b-479d-9201-067ec6e33ccc',
    });
    // then removes leadCaseId from case to remove
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[2][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'aaaba5a9-b37b-479d-9201-067ec6e33aaa',
      leadCaseId: undefined,
    });
  });

  it('Should update the removed case and remove consolidation from the original lead case if there is only one case remaining after removal', async () => {
    await removeConsolidatedCasesInteractor({
      applicationContext,
      caseIdsToRemove: ['fccca5a9-b37b-479d-9201-067ec6e33ccc'], // docketNumber: '105-19'
      docketNumber: '104-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
    // first removes leadCaseId from original case
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'eaaba5a9-b37b-479d-9201-067ec6e33aaa',
      leadCaseId: undefined,
    });
    // then removes leadCaseId from case to remove
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'fccca5a9-b37b-479d-9201-067ec6e33ccc',
      leadCaseId: undefined,
    });
  });

  it('Should update the removed case and remove consolidation from the original non-lead case if there is only one case remaining after removal', async () => {
    await removeConsolidatedCasesInteractor({
      applicationContext,
      caseIdsToRemove: ['eaaba5a9-b37b-479d-9201-067ec6e33aaa'], // docketNumber: '104-19'
      docketNumber: '105-19',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
    // first removes leadCaseId from original case
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'fccca5a9-b37b-479d-9201-067ec6e33ccc',
      leadCaseId: undefined,
    });
    // then removes leadCaseId from case to remove
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
        .caseToUpdate,
    ).toMatchObject({
      caseId: 'eaaba5a9-b37b-479d-9201-067ec6e33aaa',
      leadCaseId: undefined,
    });
  });
});
