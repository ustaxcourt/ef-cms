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

describe('trial session working copy computed', () => {
  const trialSessionWorkingCopyHelper = withAppContextDecorator(
    trialSessionWorkingCopyHelperComputed,
    applicationContext,
  );

  const MOCK_TRIAL_SESSION = {
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

  describe('sorting', () => {
    it('should sort cases by docket number ascending when sort is set to "docket" and sortOrder is "asc"', () => {
      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
      ]);
    });

    it('should sort cases by docket number descending when sort is set to "docket" and sortOrder is "desc"', () => {
      const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              MOCK_CASE,
              { ...MOCK_CASE, docketNumber: '102-19' },
              { ...MOCK_CASE, docketNumber: '5000-17' },
              { ...MOCK_CASE, docketNumber: '500-17' },
              { ...MOCK_CASE, docketNumber: '90-07' },
            ],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'desc',
            userNotes: {},
          },
        },
      });

      expect(formattedCases).toMatchObject([
        { docketNumber: '102-19' },
        { docketNumber: '101-18' },
        { docketNumber: '5000-17' },
        { docketNumber: '500-17' },
        { docketNumber: '90-07' },
      ]);
    });

    it('should sort cases by private practitioner count ascending when sort is set to "practitioner" and sortOrder is "asc"', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
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
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'practitioner',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
      ]);
      expect(casesShownCount).toEqual(5);
    });
  });

  describe('filtering', () => {
    it('should only return cases with "A Basis Reached" status when that filter is the only one selected and every case has a status', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                { ...MOCK_CASE, docketNumber: '102-19' },
                { ...MOCK_CASE, docketNumber: '5000-17' },
                { ...MOCK_CASE, docketNumber: '500-17' },
                { ...MOCK_CASE, docketNumber: '90-07' },
              ],
              caseOrder: [],
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
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([{ docketNumber: '102-19' }]);
      expect(casesShownCount).toEqual(1);
    });

    it('should only return cases with "Dismissed" status when that filter is the only one selected and every case has a status', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                { ...MOCK_CASE, docketNumber: '102-19' },
                { ...MOCK_CASE, docketNumber: '5000-17' },
                { ...MOCK_CASE, docketNumber: '500-17' },
                { ...MOCK_CASE, docketNumber: '90-07' },
              ],
              caseOrder: [],
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
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
      ]);
      expect(casesShownCount).toEqual(3);
    });

    it('should only return cases that match the filters selected when some cases do not have statuses set', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                { ...MOCK_CASE, docketNumber: '102-19' },
                { ...MOCK_CASE, docketNumber: '5000-17' },
                { ...MOCK_CASE, docketNumber: '500-17' },
                { ...MOCK_CASE, docketNumber: '90-07' },
              ],
              caseOrder: [],
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
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '102-19' },
      ]);
      expect(casesShownCount).toEqual(2);
    });

    it('should only return cases that do not have a status when the statusUnassigned filter is selected', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                { ...MOCK_CASE, docketNumber: '102-19' },
                { ...MOCK_CASE, docketNumber: '5000-17' },
                { ...MOCK_CASE, docketNumber: '500-17' },
                { ...MOCK_CASE, docketNumber: '90-07' },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {
                '90-07': { trialStatus: 'dismissed' },
                '102-19': { trialStatus: 'aBasisReached' },
              },
              filters: { statusUnassigned: true },
              sort: 'docket',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
      ]);
      expect(casesShownCount).toEqual(3);
    });

    it('should not return any cases when none of the cases on the trial session have a status set and the statusUnassigned filter is not selected', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                { ...MOCK_CASE, docketNumber: '102-19' },
                { ...MOCK_CASE, docketNumber: '5000-17' },
                { ...MOCK_CASE, docketNumber: '500-17' },
                { ...MOCK_CASE, docketNumber: '90-07' },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: false },
              sort: 'docket',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([]);
      expect(casesShownCount).toEqual(0);
    });

    it('should return all sessions if none of the cases on the trial session have statuses set and statusUnassigned filter is true', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
              calendaredCases: [
                MOCK_CASE,
                { ...MOCK_CASE, docketNumber: '102-19' },
                { ...MOCK_CASE, docketNumber: '5000-17' },
                { ...MOCK_CASE, docketNumber: '500-17' },
                { ...MOCK_CASE, docketNumber: '90-07' },
              ],
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'docket',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([
        { docketNumber: '90-07' },
        { docketNumber: '500-17' },
        { docketNumber: '5000-17' },
        { docketNumber: '101-18' },
        { docketNumber: '102-19' },
      ]);
      expect(casesShownCount).toEqual(5);
    });

    it('should only return cases without an assigned status when the statusUnassigned filter is true', () => {
      const { casesShownCount, formattedCases } = runCompute(
        trialSessionWorkingCopyHelper,
        {
          state: {
            trialSession: {
              ...MOCK_TRIAL_SESSION,
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
              caseOrder: [],
            },
            trialSessionWorkingCopy: {
              caseMetadata: {},
              filters: { statusUnassigned: true },
              sort: 'docket',
              sortOrder: 'asc',
              userNotes: {},
            },
          },
        },
      );

      expect(formattedCases).toMatchObject([{ docketNumber: '101-18' }]);
      expect(casesShownCount).toEqual(1);
    });
  });

  it('should set calendarNotes on cases that have them', () => {
    const mockCaseWithCalendarNotes = '102-19';
    const mockCaseWithoutCalendarNotes = '5000-17';
    const mockCaseWithCalendarNotesNotInSelectedTrialSession = '999-99';
    const mockCalendarNote = 'this is a test note';

    const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        constants: {
          STATUS_TYPES,
          TRIAL_STATUS_TYPES,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [
            MOCK_CASE,
            { ...MOCK_CASE, docketNumber: mockCaseWithCalendarNotes },
            { ...MOCK_CASE, docketNumber: mockCaseWithoutCalendarNotes },
          ],
          caseOrder: [
            {
              calendarNotes: mockCalendarNote,
              docketNumber: mockCaseWithCalendarNotes,
            },
            {
              calendarNotes: mockCalendarNote,
              docketNumber: mockCaseWithCalendarNotesNotInSelectedTrialSession,
            },
          ],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
          userNotes: {},
        },
      },
    });

    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithCalendarNotes,
      ).calendarNotes,
    ).toEqual(mockCalendarNote);
    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithoutCalendarNotes,
      ).calendarNotes,
    ).toBeUndefined();
  });

  it('should set userNotes on cases that are calendared on the trial session when they have them', () => {
    const mockCaseWithUserNotes = '102-19';
    const mockCaseWithoutUserNotes = '90-07';
    const mockCaseWithUserNotesNotInSelectedTrialSession = '999-99';
    const mockUserNote = 'this is a test note';

    const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        constants: {
          STATUS_TYPES,
          TRIAL_STATUS_TYPES,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [
            { ...MOCK_CASE, docketNumber: mockCaseWithUserNotes },
            { ...MOCK_CASE, docketNumber: mockCaseWithoutUserNotes },
          ],
          caseOrder: [
            {
              docketNumber: mockCaseWithUserNotes,
            },
          ],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
          userNotes: {
            [mockCaseWithUserNotes]: { notes: mockUserNote },
            [mockCaseWithUserNotesNotInSelectedTrialSession]: { notes: 'blah' },
          },
        },
      },
    });

    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithUserNotes,
      ).userNotes,
    ).toEqual(mockUserNote);
    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithoutUserNotes,
      ).userNotes,
    ).toBeUndefined();
  });
});
