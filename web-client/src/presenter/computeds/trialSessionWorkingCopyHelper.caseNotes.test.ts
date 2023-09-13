import {
  CASE_STATUS_TYPES,
  TRIAL_STATUS_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

  const mockCaseWithNotes = '102-19';
  const mockCaseWithNotesNotInSelectedTrialSession = '999-99';
  const mockNote = 'this is a test note';
  const mockCaseWithoutNotes = '5000-17';

  it('should set calendarNotes on cases that have them', () => {
    const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        constants: {
          CASE_STATUS_TYPES,
          TRIAL_STATUS_TYPES,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [
            MOCK_CASE,
            { ...MOCK_CASE, docketNumber: mockCaseWithNotes },
            { ...MOCK_CASE, docketNumber: mockCaseWithoutNotes },
          ],
          caseOrder: [
            {
              calendarNotes: mockNote,
              docketNumber: mockCaseWithNotes,
            },
            {
              calendarNotes: mockNote,
              docketNumber: mockCaseWithNotesNotInSelectedTrialSession,
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
        ({ docketNumber }) => docketNumber === mockCaseWithNotes,
      ).calendarNotes,
    ).toEqual(mockNote);
    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithoutNotes,
      ).calendarNotes,
    ).toEqual('');
  });

  it('should set userNotes on cases that are calendared on the trial session when they have them', () => {
    const { formattedCases } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        constants: {
          CASE_STATUS_TYPES,
          TRIAL_STATUS_TYPES,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [
            { ...MOCK_CASE, docketNumber: mockCaseWithNotes },
            { ...MOCK_CASE, docketNumber: mockCaseWithoutNotes },
          ],
          caseOrder: [
            {
              docketNumber: mockCaseWithNotes,
            },
          ],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
          userNotes: {
            [mockCaseWithNotes]: { notes: mockNote },
            [mockCaseWithNotesNotInSelectedTrialSession]: { notes: 'blah' },
          },
        },
      },
    });

    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithNotes,
      ).userNotes,
    ).toEqual(mockNote);
    expect(
      formattedCases.find(
        ({ docketNumber }) => docketNumber === mockCaseWithoutNotes,
      ).userNotes,
    ).toEqual('');
  });
});
