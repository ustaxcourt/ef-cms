import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { TrialSessionWorkingCopy } from '../../../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy';
import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from './trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
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
  trialClerk: 'Test Trial Clerk',
  trialLocation: 'Hartford, Connecticut',
};

describe('trial session working copy computed', () => {
  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        constants: {
          TRIAL_STATUS_TYPES: TrialSessionWorkingCopy.TRIAL_STATUS_TYPES,
        },
      },
    });
    expect(result.title).toBeDefined();
  });

  describe('sorting', () => {
    it('sorts calendared cases by docket number', () => {
      let result = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          constants: {
            TRIAL_STATUS_TYPES: TrialSessionWorkingCopy.TRIAL_STATUS_TYPES,
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
            sort: 'docket',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedSessions).toMatchObject([
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
          constants: {
            TRIAL_STATUS_TYPES: TrialSessionWorkingCopy.TRIAL_STATUS_TYPES,
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
            sort: 'docket',
            sortOrder: 'desc',
          },
        },
      });
      expect(result.formattedSessions).toMatchObject([
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
          constants: {
            TRIAL_STATUS_TYPES: TrialSessionWorkingCopy.TRIAL_STATUS_TYPES,
          },
          trialSession: {
            ...TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19', practitioners: [] },
              {
                ...MOCK_CASE,
                docketNumber: '5000-17',
                practitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '500-17',
                practitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '90-07',
              },
            ],
          },
          trialSessionWorkingCopy: {
            sort: 'practitioner',
            sortOrder: 'asc',
          },
        },
      });
      expect(result.formattedSessions).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
      ]);
    });
  });
});
