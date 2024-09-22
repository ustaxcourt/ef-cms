import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { PETITIONS_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUsersInSectionInteractor } from './getUsersInSectionInteractor';
import {
  mockDocketClerkUser,
  mockJudgeUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('Get users in section', () => {
  const MOCK_SECTION = [
    mockPetitionerUser,
    {
      ...mockPetitionerUser,
      name: 'Tax Payer 2',
      userId: 'a79d2fac-aa2c-4183-9877-01ab1cdff127',
    },
  ];

  const MOCK_JUDGE_SECTION = [
    {
      ...mockJudgeUser,
      isSeniorJudge: false,
      judgeFullName: 'Test Judge 1',
      judgeTitle: 'Judge',
      name: 'Test Judge 1',
    },
    {
      ...mockJudgeUser,
      isSeniorJudge: false,
      judgeFullName: 'Test Judge 2',
      judgeTitle: 'Judge',
      name: 'Test Judge 2',
      userId: 'ea83cea2-5ce9-451d-b3d6-1e7c0e51d311',
    },
  ];

  it('retrieves the users in the petitions section', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);
    const sectionToGet = { section: PETITIONS_SECTION };

    const section = await getUsersInSectionInteractor(
      applicationContext,
      sectionToGet,
      mockPetitionsClerkUser,
    );

    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Tax Payer');
  });

  it('returns notfounderror when section not found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);
    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor(
        applicationContext,
        sectionToGet,
        mockPetitionsClerkUser,
      );
    } catch (e) {
      if (e instanceof NotFoundError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorizederror when user not authorized', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);

    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor(
        applicationContext,
        sectionToGet,
        mockPetitionerUser,
      );
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('retrieves the users in the judge section when the current user has the appropriate permissions', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    const section = await getUsersInSectionInteractor(
      applicationContext,
      sectionToGet,
      mockDocketClerkUser,
    );
    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Test Judge 1');
  });

  it('returns unauthorizedError when the desired section is judge and current user does not have appropriate permissions', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    await expect(
      getUsersInSectionInteractor(
        applicationContext,
        sectionToGet,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });
});
