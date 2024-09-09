import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { PARTIES_CODES } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCalendaredCasesForTrialSessionInteractor } from './getCalendaredCasesForTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('getCalendaredCasesForTrialSessionInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([MOCK_CASE]);
  });

  it('throws an exception when the user is unauthorized', async () => {
    await expect(
      getCalendaredCasesForTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should find the cases for a trial session successfully', async () => {
    await expect(
      getCalendaredCasesForTrialSessionInteractor(
        applicationContext,
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        mockDocketClerkUser,
      ),
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
      mockDocketClerkUser,
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
      mockDocketClerkUser,
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
