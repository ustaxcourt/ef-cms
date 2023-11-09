import { MOCK_CASE } from '../../../test/mockCase';
import {
  PARTIES_CODES,
  PARTY_TYPES,
  ROLES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCalendaredCasesForTrialSessionInteractor } from './getCalendaredCasesForTrialSessionInteractor';

const user = new User({
  name: 'Docket Clerk',
  role: ROLES.docketClerk,
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
});

describe('getCalendaredCasesForTrialSessionInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(user);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([MOCK_CASE]);
  });

  it('throws an exception when the user is unauthorized', async () => {
    const unAuthedUser = new User({
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValueOnce(unAuthedUser);

    await expect(
      getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      getCalendaredCasesForTrialSessionInteractor(applicationContext, {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });

  it('should return a PMTServedPartiesCode when a case contains an unstricken PMT', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValueOnce([
        {
          ...MOCK_CASE,
          docketEntries: [
            {
              ...MOCK_CASE.docketEntries[0],
              eventCode: 'PMT',
              filers: [MOCK_CASE.petitioners[0].contactId],
              isStricken: false,
            },
            {
              ...MOCK_CASE.docketEntries[0],
              eventCode: 'PMT',
              filers: [MOCK_CASE.petitioners[0].contactId],
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

    expect(cases[0].PMTServedPartiesCode).toEqual(PARTIES_CODES.PETITIONER);
  });

  it('should only return case fields contained in the CalendaredCase type', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([MOCK_CASE]);

    const cases = await getCalendaredCasesForTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
    );

    removedFields.forEach(field => {
      expect(cases[0][field]).toBeUndefined();
    });
  });
});

const removedFields = [
  'docketEntries',
  'consolidatedCases',
  'petitioners',
  'associatedJudge',
  'automaticBlocked',
  'caseStatusHistory',
  'qcCompleteForTrial',
  'noticeOfAttachments',
  'orderDesignatingPlaceOfTrial',
  'orderForAmendedPetition',
  'orderForAmendedPetitionAndFilingFee',
  'orderForFilingFee',
  'orderForCds',
  'archivedDocketEntries',
  'statistics',
  'correspondence',
  'archivedCorrespondences',
  'hearings',
  'isSealed',
  'createdAt',
  'filingType',
  'hasVerifiedIrsNotice',
  'irsNoticeDate',
  'isPaper',
  'partyType',
  'petitionPaymentDate',
  'petitionPaymentMethod',
  'petitionPaymentStatus',
  'petitionPaymentWaivedDate',
  'preferredTrialCity',
  'receivedAt',
  'trialDate',
  'trialLocation',
  'trialSessionId',
  'trialTime',
  'initialDocketNumberSuffix',
  'initialCaption',
  'hasPendingItems',
  'initialDocketNumberSuffix',
];
