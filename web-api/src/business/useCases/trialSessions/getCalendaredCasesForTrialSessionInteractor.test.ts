import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { PARTIES_CODES } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCalendaredCasesForTrialSessionInteractor } from './getCalendaredCasesForTrialSessionInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';

describe('getCalendaredCasesForTrialSessionInteractor', () => {
  const getCalendaredCasesForTrialSession = jest.mocked(getCalendaredCasesForTrialSessionMock);

  const MOCK_CASE_WITH_CASE_ORDER: Omit<RawCase, 'consolidatedCases'> & TCaseOrder = {
    ...MOCK_CASE,
    addedToSessionAt: '2100-12-01T00:00:00.000Z',
    isHearing: true,
    isManuallyAdded: true,
    removedFromTrial: false
  }

  beforeAll(() => {
    getCalendaredCasesForTrialSession.mockResolvedValue([MOCK_CASE_WITH_CASE_ORDER]);
  });

  it('throws an exception when the user is unauthorized', async () => {
    await expect(
      getCalendaredCasesForTrialSessionInteractor(
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
        {
          trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
        mockDocketClerkUser,
      ),
    ).resolves.not.toThrow();

    expect(getCalendaredCasesForTrialSession).toHaveBeenCalledWith({
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      excludeFields: ['correspondence', 'hearings'],
    });
  });

  it('should return a PMTServedPartiesCode when a case contains an unstricken PMT', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValueOnce([
        {
          ...MOCK_CASE_WITH_CASE_ORDER,
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
        } as any,
      ]);

    const cases = await getCalendaredCasesForTrialSessionInteractor(
      {
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      },
      mockDocketClerkUser,
    );

    expect(cases[0].PMTServedPartiesCode).toEqual(PARTIES_CODES.PETITIONER);
  });

  it('should only return case fields contained in the CalendaredCase type', async () => {
    getCalendaredCasesForTrialSession.mockResolvedValue([MOCK_CASE_WITH_CASE_ORDER]);

    const cases = await getCalendaredCasesForTrialSessionInteractor(
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
