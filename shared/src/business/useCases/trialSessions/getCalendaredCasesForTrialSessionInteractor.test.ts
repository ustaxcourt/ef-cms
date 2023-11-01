import { MOCK_CASE } from '../../../test/mockCase';
import {
  PARTIES_CODES,
  PARTY_TYPES,
  ROLES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';
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

    expect(cases[0].consolidatedCases).toBeUndefined();
    expect(cases[0].docketEntries).toBeUndefined();
    expect(cases[0].petitioners).toBeUndefined();
    expect(cases[0].associatedJudge).toBeUndefined();
    expect(cases[0].automaticBlocked).toBeUndefined();
    expect(cases[0].caseStatusHistory).toBeUndefined();
    expect(cases[0].qcCompleteForTrial).toBeUndefined();
    expect(cases[0].noticeOfAttachments).toBeUndefined();
    expect(cases[0].orderDesignatingPlaceOfTrial).toBeUndefined();
    expect(cases[0].orderForAmendedPetition).toBeUndefined();
    expect(cases[0].orderForAmendedPetitionAndFilingFee).toBeUndefined();
    expect(cases[0].orderForFilingFee).toBeUndefined();
    expect(cases[0].orderForCds).toBeUndefined();
    expect(cases[0].archivedDocketEntries).toBeUndefined();
    expect(cases[0].statistics).toBeUndefined();
    expect(cases[0].correspondence).toBeUndefined();
    expect(cases[0].archivedCorrespondences).toBeUndefined();
    expect(cases[0].isSealed).toBeUndefined();
    expect(cases[0].hearings).toBeUndefined();
    expect(cases[0].createdAt).toBeUndefined();
    expect(cases[0].filingType).toBeUndefined();
    expect(cases[0].hasVerifiedIrsNotice).toBeUndefined();
    expect(cases[0].irsNoticeDate).toBeUndefined();
    expect(cases[0].isPaper).toBeUndefined();
    expect(cases[0].partyType).toBeUndefined();
    expect(cases[0].petitionPaymentDate).toBeUndefined();
    expect(cases[0].petitionPaymentMethod).toBeUndefined();
    expect(cases[0].petitionPaymentStatus).toBeUndefined();
    expect(cases[0].petitionPaymentWaivedDate).toBeUndefined();
    expect(cases[0].preferredTrialCity).toBeUndefined();
    expect(cases[0].receivedAt).toBeUndefined();
    expect(cases[0].status).toBeUndefined();
    expect(cases[0].trialDate).toBeUndefined();
    expect(cases[0].trialLocation).toBeUndefined();
    expect(cases[0].trialSessionId).toBeUndefined();
    expect(cases[0].trialTime).toBeUndefined();
    expect(cases[0].initialDocketNumberSuffix).toBeUndefined();
    expect(cases[0].initialCaption).toBeUndefined();
    expect(cases[0].hasPendingItems).toBeUndefined();
    expect(cases[0].initialDocketNumberSuffix).toBeUndefined();
  });
});
