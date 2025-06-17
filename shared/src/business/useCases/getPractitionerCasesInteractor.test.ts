import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { getPractitionerCasesInteractor } from './getPractitionerCasesInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCasesMetadataByDocketNumbers as getCasesMetadataByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesMetadataByDocketNumbers';
import { getDocketNumbersByUser as getDocketNumbersByUserMock } from '@web-api/persistence/postgres/users/cases/getCasesForUser';

describe('getPractitionerCasesInteractor', () => {
  const getCasesMetadataByDocketNumbers =
    getCasesMetadataByDocketNumbersMock as jest.Mock;
  const getDocketNumbersByUser = getDocketNumbersByUserMock as jest.Mock;

  beforeEach(() => {
    getCasesMetadataByDocketNumbers.mockResolvedValue([
      {
        ...MOCK_CASE,
        docketNumber: '108-07',
        status: CASE_STATUS_TYPES.closed,
      },
      {
        ...MOCK_CASE,
        docketNumber: '2001-17',
        status: CASE_STATUS_TYPES.closed,
      },
      {
        ...MOCK_CASE,
        docketNumber: '501-17',
        status: CASE_STATUS_TYPES.closed,
      },
      { ...MOCK_CASE, docketNumber: '201-07' },
      { ...MOCK_CASE, docketNumber: '1002-17' },
      { ...MOCK_CASE, docketNumber: '902-17' },
    ]);

    getDocketNumbersByUser.mockResolvedValue([
      '108-07',
      '2001-17',
      '501-17',
      '201-07',
      '1002-17',
      '902-17',
    ]);
  });

  it('returns an unauthorized error on non internal users', async () => {
    await expect(
      getPractitionerCasesInteractor(
        applicationContext,
        {
          userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns sorted openCases and closedCases with caseTitle', async () => {
    const { closedCases, openCases } = await getPractitionerCasesInteractor(
      applicationContext,
      {
        userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(getCasesMetadataByDocketNumbers).toHaveBeenCalled();

    expect(
      closedCases.map(closedCase => {
        return {
          caseTitle: closedCase.caseTitle,
          docketNumber: closedCase.docketNumber,
        };
      }),
    ).toEqual([
      { caseTitle: 'Test Petitioner', docketNumber: '2001-17' },
      { caseTitle: 'Test Petitioner', docketNumber: '501-17' },
      { caseTitle: 'Test Petitioner', docketNumber: '108-07' },
    ]);

    expect(
      openCases.map(openCase => {
        return {
          caseTitle: openCase.caseTitle,
          docketNumber: openCase.docketNumber,
        };
      }),
    ).toEqual([
      { caseTitle: 'Test Petitioner', docketNumber: '1002-17' },
      { caseTitle: 'Test Petitioner', docketNumber: '902-17' },
      { caseTitle: 'Test Petitioner', docketNumber: '201-07' },
    ]);
  });

  it('returns empty arrays if `getCasesMetadataByDocketNumbers` returns undefined', async () => {
    getCasesMetadataByDocketNumbers.mockResolvedValueOnce(undefined);

    const { closedCases, openCases } = await getPractitionerCasesInteractor(
      applicationContext,
      {
        userId: 'abc',
      },
      mockDocketClerkUser,
    );

    expect(closedCases).toEqual([]);
    expect(openCases).toEqual([]);
  });

  it('handles scenario where getDocketNumbersByUser returns an empty array', async () => {
    getDocketNumbersByUser.mockResolvedValueOnce([]);
    getCasesMetadataByDocketNumbers.mockResolvedValueOnce(undefined);

    const { closedCases, openCases } = await getPractitionerCasesInteractor(
      applicationContext,
      {
        userId: 'someUserId',
      },
      mockDocketClerkUser,
    );

    expect(getCasesMetadataByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: [],
    });
    expect(closedCases).toEqual([]);
    expect(openCases).toEqual([]);
  });
});
