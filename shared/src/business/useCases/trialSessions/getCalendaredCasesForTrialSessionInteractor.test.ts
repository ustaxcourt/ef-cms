import { MOCK_CASE } from '../../../test/mockCase';
import { PARTY_TYPES, ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCalendaredCasesForTrialSessionInteractor } from './getCalendaredCasesForTrialSessionInteractor';

const mockJudge = {
  role: ROLES.judge,
  section: 'judgechambers',
  userId: '123',
};

let user;

describe('getCalendaredCasesForTrialSessionInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([MOCK_CASE]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(mockJudge);
  });

  it('throws an exception when the user is unauthorized', async () => {
    user = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await expect(
      getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should find the cases for a trial session successfully', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await expect(
      getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });

  it('should only return unstricken PMT docket entry on cases', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([
        {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...MOCK_CASE.docketEntries[0],
              eventCode: 'PMT',
              isStricken: false,
            },
            {
              ...MOCK_CASE.docketEntries[0],
              eventCode: 'PMT',
              isStricken: true,
            },
          ],
        },
      ]);

    const cases = await getCalendaredCasesForTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );

    expect(cases[0].docketEntries.length).toEqual(1);
    expect(cases[0].docketEntries[0].eventCode).toEqual('PMT');
    expect(cases[0].docketEntries[0].isStricken).toEqual(false);
  });
});
