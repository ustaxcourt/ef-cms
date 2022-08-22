import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import {
  STATUS_TYPES,
  TRIAL_STATUS_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
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

    it('should sort only lead and unconsolidated cases, but return the total number of cases as casesShownCount', () => {
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
                  leadDocketNumber: '500-17',
                  privatePractitioners: [],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '5000-17',
                  leadDocketNumber: '500-17',
                  privatePractitioners: [{}, {}],
                },
                {
                  ...MOCK_CASE,
                  docketNumber: '500-17',
                  leadDocketNumber: '500-17',
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
        { docketNumber: '500-17' },
      ]);
      expect(casesShownCount).toEqual(5);
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

  it('should return lead and unconsolidated cases, and sort consolidated cases within a lead case in ascending order', () => {
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
                leadDocketNumber: '500-17',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '5000-17',
                leadDocketNumber: '500-17',
                privatePractitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '500-17',
                leadDocketNumber: '500-17',
                privatePractitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '90-18',
                leadDocketNumber: '500-17',
              },
              {
                ...MOCK_CASE,
                docketNumber: '101-21',
                leadDocketNumber: '500-17',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '115-20',
                privatePractitioners: [],
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

    expect(formattedCases).toMatchObject([
      { docketNumber: '500-17' },
      { docketNumber: '101-18' },
      { docketNumber: '115-20' },
    ]);
    expect(formattedCases[0].consolidatedCases).toMatchObject([
      { docketNumber: '5000-17' },
      { docketNumber: '90-18' },
      { docketNumber: '102-19' },
      { docketNumber: '101-21' },
    ]);
    expect(casesShownCount).toEqual(7);
  });

  it('should assign consolidated member cases to the correct lead case and sort them correctly', () => {
    const { casesShownCount, formattedCases } = runCompute(
      trialSessionWorkingCopyHelper,
      {
        state: {
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [
              {
                ...MOCK_CASE,
                docketNumber: '102-19',
                leadDocketNumber: '90-18',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '5000-17',
                leadDocketNumber: '500-17',
                privatePractitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '500-17',
                leadDocketNumber: '500-17',
                privatePractitioners: [{}, {}],
              },
              {
                ...MOCK_CASE,
                docketNumber: '90-18',
                leadDocketNumber: '90-18',
              },
              {
                ...MOCK_CASE,
                docketNumber: '101-21',
                leadDocketNumber: '116-20',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '116-20',
                leadDocketNumber: '116-20',
                privatePractitioners: [],
              },
              {
                ...MOCK_CASE,
                docketNumber: '111-22',
                leadDocketNumber: '500-17',
                privatePractitioners: [],
              },
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
      },
    );

    expect(formattedCases).toMatchObject([
      { docketNumber: '116-20' },
      { docketNumber: '90-18' },
      { docketNumber: '500-17' },
    ]);
    expect(formattedCases[0].consolidatedCases).toMatchObject([
      { docketNumber: '101-21' },
    ]);
    expect(formattedCases[1].consolidatedCases).toMatchObject([
      { docketNumber: '102-19' },
    ]);
    expect(formattedCases[2].consolidatedCases).toMatchObject([
      { docketNumber: '5000-17' },
      { docketNumber: '111-22' },
    ]);
    expect(casesShownCount).toEqual(7);
  });
});
