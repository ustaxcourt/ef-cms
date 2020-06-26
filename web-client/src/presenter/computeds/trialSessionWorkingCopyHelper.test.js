import {
  CASE_STATUS_TYPES,
  STATUS_TYPES,
  TRIAL_STATUS_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from './trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
  applicationContext,
);

const TRIAL_SESSION = {
  city: 'Hartford',
  courtReporter: 'Test Court Reporter',
  irsCalendarAdministrator: 'Test Calendar Admin',
  judge: { name: 'Test Judge' },
  postalCode: '12345',
  startDate: '2019-11-25T15:00:00.000Z',
  startTime: '10:00',
  state: 'CT',
  term: 'Fall',
  termYear: '2019',
  trialClerk: { name: 'Test Trial Clerk' },
  trialLocation: 'Hartford, Connecticut',
};

describe('trial session working copy computed', () => {
  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionWorkingCopyHelper, {
      state: {},
    });
    expect(result.title).toBeDefined();
  });

  describe('sorting', () => {
    it('sorts calendared cases by docket number', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
      ]);
    });

    it('sorts calendared cases by docket number in descending order', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'desc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '102-19' },
        { docketNumber: '101-18' },
        { docketNumber: '5000-17' },
        { docketNumber: '500-17' },
        { docketNumber: '90-07' },
      ]);
    });

    it('sorts calendared cases by pro-se', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              {
                ...MOCK_CASE,
                docketNumber: '102-19',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '5000-17',
                privatePractitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '500-17',
                privatePractitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '90-07',
              },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'practitioner',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
      ]);
      expect(result.casesShownCount).toEqual(5);
    });
  });

  describe('filtering', () => {
    it('no cases are returned if trialSessionWorkingCopy.filters and trialSessionWorkingCopy.caseMetadata are null', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            sort: 'practitioner',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([]);
      expect(result.casesShownCount).toEqual(0);
    });

    it('filters calendared cases by a single trial status when all trial statuses are set', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {
              '90-07': { trialStatus: 'dismissed' },
              '102-19': { trialStatus: 'aBasisReached' },
              '500-17': { trialStatus: 'dismissed' },
              '5000-17': { trialStatus: 'dismissed' },
            },
            filters: { aBasisReached: true },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([{ docketNumber: '102-19' }]);
      expect(result.casesShownCount).toEqual(1);

      result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {
              '90-07': { trialStatus: 'dismissed' },
              '102-19': { trialStatus: 'aBasisReached' },
              '500-17': { trialStatus: 'dismissed' },
              '5000-17': { trialStatus: 'dismissed' },
            },
            filters: { dismissed: true },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
      ]);
      expect(result.casesShownCount).toEqual(3);
    });

    it('filters calendared cases by multiple trial statuses when some trial statuses are not set', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {
              '90-07': { trialStatus: 'dismissed' },
              '102-19': { trialStatus: 'aBasisReached' },
              '5000-17': { trialStatus: 'recall' },
            },
            filters: {
              aBasisReached: true,
              dismissed: true,
              recall: false,
              statusUnassigned: false,
            },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '102-19' },
      ]);
      expect(result.casesShownCount).toEqual(2);
    });

    it('filters calendared cases by statusUnassigned when some trial statuses are not set', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {
              '90-07': { trialStatus: 'dismissed' },
              '102-19': { trialStatus: 'aBasisReached' },
            },
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
      ]);
      expect(result.casesShownCount).toEqual(3);
    });

    it('should not return any sessions if none of the trial statuses are set and statusUnassigned is false', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: false },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([]);
      expect(result.casesShownCount).toEqual(0);
    });

    it('should return all sessions if none of the trial statuses are set and statusUnassigned is true', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
      ]);
      expect(result.casesShownCount).toEqual(5);
    });

    it('should return sessions without an assigned status', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              {
                ...MOCK_CASE,
                docketNumber: '102-19',
                status: CASE_STATUS_TYPES.closed,
              },
              {
                ...MOCK_CASE,
                docketNumber: '5000-17',
                status: CASE_STATUS_TYPES.closed,
              },
              {
                ...MOCK_CASE,
                docketNumber: '500-17',
                status: CASE_STATUS_TYPES.closed,
              },
              {
                ...MOCK_CASE,
                docketNumber: '90-07',
                status: CASE_STATUS_TYPES.closed,
              },
            ],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedCases).toMatchObject([{ docketNumber: '101-18' }]);
      expect(result.casesShownCount).toEqual(1);
    });
  });

  it('return the cases mapped by docket number', () => {
    let result = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        constants: {
          STATUS_TYPES,
          TRIAL_STATUS_TYPES,
        },
        trialSession: {
          ...TRIAL_SESSION,
          calendaredCases: [
            MOCK_CASE,
            { ...MOCK_CASE, docketNumber: '102-19' },
            { ...MOCK_CASE, docketNumber: '5000-17' },
            { ...MOCK_CASE, docketNumber: '500-17' },
            { ...MOCK_CASE, docketNumber: '90-07' },
          ],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
        },
      },
    });
    expect(result.formattedCasesByDocketRecord).toMatchObject({
      '90-07': {},
      '101-18': {},
      '102-19': {},
      '500-17': {},
      '5000-17': {},
    });
    expect(result.casesShownCount).toEqual(5);
  });
});
