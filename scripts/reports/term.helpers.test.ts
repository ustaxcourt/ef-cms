jest.mock('@web-api/persistence/postgres/trialSessions/getTrialSessions');
jest.mock('@web-api/persistence/postgres/cases/getCasesByDocketNumbers');
jest.mock('../helpers/generate-csv');

import {
  SESSION_TERMS_DICT,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  type RawTrialSession,
  type TCaseOrder,
} from '@shared/business/entities/trialSessions/TrialSession';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getTrialSessions as getTrialSessionsMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { generateCsv as generateCsvMock } from '../helpers/generate-csv';
import {
  getTermRowsByLocation,
  normalizeTerm,
  termReport,
} from './term.helpers';

const getTrialSessions = jest.mocked(getTrialSessionsMock);
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const generateCsv = jest.mocked(generateCsvMock);

const createCase = (overrides: Partial<TCaseOrder> = {}): TCaseOrder => ({
  docketNumber: '123-45',
  isHearing: false,
  isManuallyAdded: false,
  removedFromTrial: false,
  ...overrides,
});

const createSession = (
  overrides: Partial<RawTrialSession> = {},
): RawTrialSession => ({
  ...MOCK_TRIAL_REGULAR,
  caseOrder: [],
  isCalendared: true,
  judge: { name: 'Judge Alpha', userId: 'judge-id' },
  sessionType: SESSION_TYPES.regular,
  term: SESSION_TERMS_DICT.SPRING,
  termYear: '2026',
  trialLocation: 'Denver, Colorado',
  ...overrides,
});

describe('term.helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCasesByDocketNumbers.mockResolvedValue([]);
  });

  describe('normalizeTerm', () => {
    it('normalizes a supported term name', () => {
      expect(normalizeTerm('spring')).toBe('Spring');
    });

    it('rejects unsupported term names', () => {
      expect(() => normalizeTerm('Summer')).toThrow(
        'Invalid term "Summer". Expected Winter, Spring, Fall',
      );
    });
  });

  describe('getTermRowsByLocation', () => {
    it('includes every case linked to a matching session', () => {
      const matchingSession = createSession({
        caseOrder: [
          createCase({ disposition: 'Settled' }),
          createCase({
            docketNumber: '123-46',
            isHearing: true,
            disposition: 'Hearing',
          }),
          createCase({
            docketNumber: '123-47',
            removedFromTrial: true,
            disposition: 'Removed',
          }),
          createCase({
            docketNumber: '123-48',
            disposition: undefined,
          }),
        ],
      });

      const rowsByLocation = getTermRowsByLocation({
        sessions: [
          matchingSession,
          createSession({ isCalendared: false }),
          createSession({ sessionType: SESSION_TYPES.special }),
          createSession({ term: SESSION_TERMS_DICT.WINTER }),
          createSession({ termYear: '2025' }),
        ],
        term: 'Spring',
        termYear: '2026',
      });

      expect(rowsByLocation).toEqual({
        'Denver, Colorado': [
          { disposition: '', docketNumber: '123-48', judge: 'Alpha' },
          { disposition: 'Hearing', docketNumber: '123-46', judge: 'Alpha' },
          { disposition: 'Removed', docketNumber: '123-47', judge: 'Alpha' },
          { disposition: 'Settled', docketNumber: '123-45', judge: 'Alpha' },
        ],
      });
    });

    it('uses a blank judge when the session has no judge', () => {
      const rowsByLocation = getTermRowsByLocation({
        sessions: [
          createSession({
            caseOrder: [createCase()],
            judge: undefined,
          }),
        ],
        term: 'Spring',
        termYear: '2026',
      });

      expect(rowsByLocation).toEqual({
        'Denver, Colorado': [
          { disposition: '', docketNumber: '123-45', judge: '' },
        ],
      });
    });

    it('combines sessions by location and sorts by disposition', () => {
      const rowsByLocation = getTermRowsByLocation({
        sessions: [
          createSession({
            caseOrder: [createCase({ disposition: 'Z' })],
            trialLocation: 'Denver, Colorado',
          }),
          createSession({
            caseOrder: [
              createCase({ docketNumber: '123-46', disposition: 'A' }),
            ],
            judge: { name: 'Judge Beta', userId: 'judge-beta-id' },
            trialLocation: 'Denver, Colorado',
          }),
          createSession({
            caseOrder: [
              createCase({ docketNumber: '123-47', disposition: 'M' }),
            ],
            trialLocation: undefined,
          }),
        ],
        term: 'Spring',
        termYear: '2026',
      });

      expect(rowsByLocation).toEqual({
        'Denver, Colorado': [
          { disposition: 'A', docketNumber: '123-46', judge: 'Beta' },
          { disposition: 'Z', docketNumber: '123-45', judge: 'Alpha' },
        ],
        Unknown: [{ disposition: 'M', docketNumber: '123-47', judge: 'Alpha' }],
      });
    });

    it('uses the first matching session when a consolidated group spans sessions', () => {
      const rowsByLocation = getTermRowsByLocation({
        sessions: [
          createSession({
            caseOrder: [
              createCase({
                docketNumber: '102-20',
                disposition: 'Settled',
              }),
              createCase({
                docketNumber: '101-20',
                disposition: 'Decided',
              }),
              createCase({
                docketNumber: '104-20',
                disposition: 'Settled',
              }),
            ],
            trialLocation: 'Denver, Colorado',
          }),
          createSession({
            caseOrder: [
              createCase({
                docketNumber: '104-20',
                disposition: 'Dismissed',
              }),
            ],
            judge: { name: 'Judge Beta', userId: 'judge-beta-id' },
            trialLocation: 'St. Louis, Missouri',
          }),
        ],
        term: 'Spring',
        termYear: '2026',
        cases: [
          { docketNumber: '101-20', leadDocketNumber: '101-20' },
          { docketNumber: '102-20', leadDocketNumber: '101-20' },
          { docketNumber: '104-20', leadDocketNumber: '101-20' },
        ],
      });

      expect(rowsByLocation).toEqual({
        'Denver, Colorado': [
          { disposition: 'Decided', docketNumber: '101-20', judge: 'Alpha' },
        ],
      });
    });

    it('returns no locations when no sessions match', () => {
      expect(
        getTermRowsByLocation({
          sessions: [createSession({ termYear: '2025' })],
          term: 'Spring',
          termYear: '2026',
        }),
      ).toEqual({});
    });
  });

  describe('termReport', () => {
    it('writes one CSV per location', async () => {
      getTrialSessions.mockResolvedValue([
        createSession({
          caseOrder: [createCase({ disposition: 'Settled' })],
          trialLocation: 'Denver, Colorado',
        }),
        createSession({
          caseOrder: [
            createCase({
              docketNumber: '123-46',
              disposition: 'Dismissed',
            }),
          ],
          trialLocation: 'St. Louis, Missouri',
        }),
      ]);

      await termReport({
        outputDir: '/tmp/Documents',
        term: 'spring',
        termYear: '2026',
      });

      expect(generateCsv).toHaveBeenCalledTimes(2);
      expect(getCasesByDocketNumbers).toHaveBeenCalledWith({
        docketNumbers: ['123-45', '123-46'],
        excludeFields: [
          'docketEntries',
          'privatePractitioners',
          'irsPractitioners',
          'correspondence',
          'hearings',
        ],
      });
      expect(generateCsv).toHaveBeenCalledWith({
        columns: [
          { header: 'Judge', key: 'judge' },
          { header: 'Docket Number', key: 'docketNumber' },
          { header: 'Disposition', key: 'disposition' },
        ],
        filename: '/tmp/Documents/term-spring-2026-denver-colorado.csv',
        rows: [
          { disposition: 'Settled', docketNumber: '123-45', judge: 'Alpha' },
        ],
      });
      expect(generateCsv).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: '/tmp/Documents/term-spring-2026-st-louis-missouri.csv',
        }),
      );
    });

    it('does not write files when matching sessions have no linked cases', async () => {
      getTrialSessions.mockResolvedValue([
        createSession({
          caseOrder: [],
          judge: undefined,
          trialLocation: undefined,
        }),
      ]);

      await termReport({
        outputDir: '/tmp/Documents',
        term: 'Spring',
        termYear: '2026',
      });

      expect(generateCsv).not.toHaveBeenCalled();
      expect(getCasesByDocketNumbers).not.toHaveBeenCalled();
    });
  });
});
