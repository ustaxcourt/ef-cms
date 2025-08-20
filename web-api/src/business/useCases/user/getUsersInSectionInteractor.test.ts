jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ACCOUNT_STATUS,
  CASE_SERVICES_SUPERVISOR_SECTION,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { getUsersInSectionInteractor } from './getUsersInSectionInteractor';
import {
  mockDocketClerkUser,
  mockJudgeUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('Get users in section', () => {
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);
  const MOCK_SECTION = [
    { ...mockPetitionerUser, accountStatus: ACCOUNT_STATUS.active } as DbUser,
    {
      ...mockPetitionerUser,
      name: 'Tax Payer 2',
      userId: 'a79d2fac-aa2c-4183-9877-01ab1cdff127',
      accountStatus: ACCOUNT_STATUS.active,
    } as DbUser,
  ];

  const MOCK_JUDGE_SECTION = [
    {
      ...mockJudgeUser,
      isSeniorJudge: false,
      judgeFullName: 'Test Judge 1',
      judgeTitle: 'Judge',
      name: 'Test Judge 1',
      accountStatus: ACCOUNT_STATUS.active,
    } as DbUser,
    {
      ...mockJudgeUser,
      isSeniorJudge: false,
      judgeFullName: 'Test Judge 2',
      judgeTitle: 'Judge',
      name: 'Test Judge 2',
      userId: 'ea83cea2-5ce9-451d-b3d6-1e7c0e51d311',
      accountStatus: ACCOUNT_STATUS.active,
    } as DbUser,
  ];

  it('retrieves the users in the petitions section', async () => {
    getUsersInSections.mockResolvedValue(MOCK_SECTION);
    const sectionToGet = { section: PETITIONS_SECTION };

    const section = await getUsersInSectionInteractor(
      sectionToGet,
      mockPetitionsClerkUser,
    );

    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Tax Payer');
  });

  it('returns notfounderror when section not found', async () => {
    getUsersInSections.mockResolvedValue(MOCK_SECTION);
    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor(sectionToGet, mockPetitionsClerkUser);
    } catch (e) {
      if (e instanceof NotFoundError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorizederror when user not authorized', async () => {
    getUsersInSections.mockResolvedValue(MOCK_SECTION);

    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor(sectionToGet, mockPetitionerUser);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('retrieves the users in the judge section when the current user has the appropriate permissions', async () => {
    getUsersInSections.mockResolvedValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    const section = await getUsersInSectionInteractor(
      sectionToGet,
      mockDocketClerkUser,
    );
    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Test Judge 1');
  });

  it('returns unauthorizedError when the desired section is judge and current user does not have appropriate permissions', async () => {
    getUsersInSections.mockResolvedValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    await expect(
      getUsersInSectionInteractor(sectionToGet, mockPetitionerUser),
    ).rejects.toThrow('Unauthorized');
  });

  it('should look for users in CASE_SERVICES_SUPERVISOR_SECTION when searching for docket section or petitions section', async () => {
    getUsersInSections.mockResolvedValue(MOCK_SECTION);
    const sectionToGet = { section: PETITIONS_SECTION };

    const section = await getUsersInSectionInteractor(
      sectionToGet,
      mockPetitionsClerkUser,
    );

    expect(getUsersInSections).toHaveBeenCalledWith({
      accountStatus: ACCOUNT_STATUS.active,
      sections: [PETITIONS_SECTION, CASE_SERVICES_SUPERVISOR_SECTION],
    });
    expect(section.length).toEqual(2);
    expect(section[0].name).toEqual('Tax Payer');
  });
});
