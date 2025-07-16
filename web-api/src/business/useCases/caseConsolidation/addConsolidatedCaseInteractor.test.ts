import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addConsolidatedCaseInteractor } from './addConsolidatedCaseInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('addConsolidatedCaseInteractor', () => {
  let mockCases;

  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getConsolidatedCases = jest.mocked(getConsolidatedCasesMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    mockCases = {
      '119-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '119-19',
        leadDocketNumber: '119-19',
      },
      '219-19': {
        ...MOCK_CASE,
        createdAt: '2019-02-19T17:29:13.120Z',
        docketNumber: '219-19',
      },
      '319-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '319-19',
        leadDocketNumber: '319-19',
      },
      '320-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '320-19',
      },
      '419-19': {
        ...MOCK_CASE,
        createdAt: '2019-04-19T17:29:13.120Z',
        docketNumber: '419-19',
        leadDocketNumber: '319-19',
      },
      '519-19': {
        ...MOCK_CASE,
        createdAt: '2019-05-19T17:29:13.120Z',
        docketNumber: '519-19',
      },
      '619-19': {
        ...MOCK_CASE,
        createdAt: '2019-03-19T17:29:13.120Z',
        docketNumber: '619-19',
        leadDocketNumber: '119-19',
      },
    };

    getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
      return Promise.resolve(mockCases[docketNumber]);
    });
    getConsolidatedCases.mockImplementation(({ leadDocketNumber }) => {
      return Promise.resolve(
        Object.keys(mockCases)
          .map(key => mockCases[key])
          .filter(mockCase => mockCase.leadDocketNumber === leadDocketNumber),
      );
    });
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('Should return an Unauthorized error if the user does not have the CONSOLIDATE_CASES permission', async () => {
    await expect(
      addConsolidatedCaseInteractor(
        applicationContext,
        {
          docketNumber: '519-19',
          docketNumberToConsolidateWith: '319-19',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for case consolidation');
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      addConsolidatedCaseInteractor(
        applicationContext,
        {
          docketNumber: '519-19',
          docketNumberToConsolidateWith: '319-19',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the cases', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '319-19',
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledTimes(1);

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: ['case|519-19', 'case|319-19'],
      }),
    );
  });

  it('Should try to get the case by its docketNumber', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '319-19',
      },
      mockDocketClerkUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
  });

  it('Should return a Not Found error if the case to update can not be found', async () => {
    await expect(
      addConsolidatedCaseInteractor(
        applicationContext,
        {
          docketNumber: '111-11',
          docketNumberToConsolidateWith: '319-19',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Case 111-11 was not found.');
  });

  it('Should return a Not Found error if the case to consolidate with cannot be found', async () => {
    await expect(
      addConsolidatedCaseInteractor(
        applicationContext,
        {
          docketNumber: '519-19',
          docketNumberToConsolidateWith: '111-11',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Case to consolidate with (111-11) was not found.');
  });

  it('Should update the case to consolidate with if it does not already have the leadDocketNumber', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '320-19',
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(2);
  });

  it('Should NOT update the case to consolidate with if it already has the leadDocketNumber and is the lead case', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '319-19',
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(1);
  });

  it('Should update both cases with the leadDocketNumber if neither have one', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '519-19',
        docketNumberToConsolidateWith: '319-19',
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.leadDocketNumber,
    ).toEqual('319-19');
  });

  it('Should update all leadDocketNumber fields if the new case has the lower docket number', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '219-19',
        docketNumberToConsolidateWith: '319-19',
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(3);
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.leadDocketNumber,
    ).toEqual('219-19');
  });

  it('Should combine all cases when both the case and case to consolidate with are in separate consolidated sets', async () => {
    await addConsolidatedCaseInteractor(
      applicationContext,
      {
        docketNumber: '119-19',
        docketNumberToConsolidateWith: '419-19',
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations.mock.calls.length).toEqual(2);
    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.leadDocketNumber,
    ).toEqual('119-19');
  });
});
