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
