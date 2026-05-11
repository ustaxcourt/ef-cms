import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { MOCK_CASE } from '../../test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateQcCompleteForTrialInteractor } from './updateQcCompleteForTrialInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';

describe('updateQcCompleteForTrialInteractor', () => {
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const upsertCases = jest.mocked(upsertCasesMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should throw an error if the user is unauthorized to update a trial session', async () => {
    await expect(
      updateQcCompleteForTrialInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          qcCompleteForTrial: true,
          trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for trial session QC complete');
  });

  it('should call updateCase with the updated qcCompleteForTrial value', async () => {
    await updateQcCompleteForTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      },
      mockPetitionsClerkUser,
    );

    expect(upsertCases).toHaveBeenCalled();
    const casePassedToUpdate = upsertCases.mock.calls[0][0][0];
    expect(casePassedToUpdate.qcCompleteForTrial).toEqual({
      '10aa100f-0330-442b-8423-b01690c76e3f': true,
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      updateQcCompleteForTrialInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          qcCompleteForTrial: true,
          trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await updateQcCompleteForTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
