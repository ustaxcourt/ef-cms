import { updateQcCompleteForTrialInteractor } from './updateQcCompleteForTrialInteractor';
import { applicationContext } from '../test/createTestApplicationContext';
import { MOCK_CASE } from '../../test/mockCase';
import { ROLES } from '../entities/EntityConstants';

describe('updateQcCompleteForTrialInteractor', () => {
  let user;

  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(({ caseToUpdate }) =>
        Promise.resolve(caseToUpdate),
      );
  });

  it('should throw an error if the user is unauthorized to update a trial session', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      updateQcCompleteForTrialInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      }),
    ).rejects.toThrow('Unauthorized for trial session QC complete');
  });

  it('should call updateCase with the updated qcCompleteForTrial value and return the updated case', async () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    };

    const result = await updateQcCompleteForTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        qcCompleteForTrial: true,
        trialSessionId: '10aa100f-0330-442b-8423-b01690c76e3f',
      },
    );
    expect(result.qcCompleteForTrial).toEqual({
      '10aa100f-0330-442b-8423-b01690c76e3f': true,
    });
  });
});
