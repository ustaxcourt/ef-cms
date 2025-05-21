import { mockMinuteSheet } from '@shared/test/mockMinuteSheet';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '@web-client/presenter/presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateMinuteSheetInteractor } from '@shared/proxies/trialSessionMinutes/updateMinuteSheetProxy';
import hash from 'object-hash';
import {
  autosaveTrialSessionMinuteSheetAction,
  transformFormStateToMinuteSheet,
} from '@web-client/presenter/actions/TrialSessionMinutes/autosaveTrialSessionMinuteSheetAction';
import { CalendarEvent } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

jest.mock('@shared/proxies/trialSessionMinutes/updateMinuteSheetProxy');

describe('trialSessionMinutesAutosaveAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not autosave when form has not changed', async () => {
    const mockSnapshot = hash(mockMinuteSheetFormState);

    await runAction(autosaveTrialSessionMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: { docketNumber: '123-45' },
        minuteSheetForm: mockMinuteSheetFormState,
        minuteSheetFormSnapshot: mockSnapshot,
        trialSession: { trialSessionId: 'trial-123' },
      },
    });

    expect(updateMinuteSheetInteractor).not.toHaveBeenCalled();
  });

  it('should autosave when form has changed', async () => {
    const mockUpdateResponse = { updated: true };
    (updateMinuteSheetInteractor as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    );

    const { state } = await runAction(autosaveTrialSessionMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: { docketNumber: '123-45' },
        minuteSheetForm: mockMinuteSheetFormState,
        minuteSheetFormSnapshot: 'different-hash',
        trialSession: { trialSessionId: 'trial-123' },
      },
    });

    expect(updateMinuteSheetInteractor).toHaveBeenCalledWith({
      docketNumber: '123-45',
      minuteSheet: mockMinuteSheet,
      trialSessionId: 'trial-123',
    });
    expect(state.minuteSheetFormSnapshot).toBe(mockUpdateResponse);
  });

  it('should autosave when forceAutosave is true regardless of changes', async () => {
    const mockSnapshot = '123abc';
    const mockUpdateResponse = { updated: true };
    (updateMinuteSheetInteractor as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    );

    const { state } = await runAction(autosaveTrialSessionMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {
        forceAutosave: true,
      },
      state: {
        caseDetail: { docketNumber: '123-45' },
        minuteSheetForm: mockMinuteSheetFormState,
        minuteSheetFormSnapshot: mockSnapshot,
        trialSession: { trialSessionId: 'trial-123' },
      },
    });

    expect(updateMinuteSheetInteractor).toHaveBeenCalledWith({
      docketNumber: '123-45',
      minuteSheet: mockMinuteSheet,
      trialSessionId: 'trial-123',
    });
    expect(state.minuteSheetFormSnapshot).toBe(mockUpdateResponse);
  });
});

describe('transformFormStateToMinuteSheet', () => {
  it('should transform form state with all fields populated', () => {
    const transformed = transformFormStateToMinuteSheet(
      mockMinuteSheetFormState,
      'trial-123',
      '123-45',
    );

    expect(transformed).toEqual(mockMinuteSheet);
  });

  it('should transform form state with minimal required fields', () => {
    const minimalFormState = {
      ...mockMinuteSheetFormState,
      trialSessionMetadataSection: {
        ...mockMinuteSheetFormState.trialSessionMetadataSection,
        judge: { fullName: 'Judge Smith', title: 'Judge', userId: '123' },
        trialClerk: 'Clerk Johnson',
        courtReporter: 'Reporter Brown',
        remoteSession: false,
      },
    };

    const transformed = transformFormStateToMinuteSheet(
      minimalFormState,
      'trial-123',
      '123-45',
    );

    expect(transformed).toEqual({
      ...mockMinuteSheet,
      trialSession: {
        id: 'trial-123',
        judge: { fullName: 'Judge Smith', title: 'Judge', userId: '123' },
        trialClerk: 'Clerk Johnson',
        courtReporter: 'Reporter Brown',
        isRemote: false,
      },
    });
  });

  it('should transform form state with optional date fields', () => {
    const formStateWithDates = {
      ...mockMinuteSheetFormState,
      trialBriefSection: {
        ...mockMinuteSheetFormState.trialBriefSection,
        dateSubmitted: '2023-01-01',
        dateBenchOpinionRendered: '2023-01-15',
      },
    };

    const transformed = transformFormStateToMinuteSheet(
      formStateWithDates,
      'trial-123',
      '123-45',
    );

    expect(transformed).toEqual({
      ...mockMinuteSheet,
      brief: {
        ...mockMinuteSheet.brief,
        dateSubmitted: '2023-01-01',
        benchOpinionDate: '2023-01-15',
      },
    });
  });

  it('should transform form state with calendar call and trial hearing data', () => {
    const formStateWithHearings = {
      ...mockMinuteSheetFormState,
      caseMetadataSection: {
        ...mockMinuteSheetFormState.caseMetadataSection,
        called: {
          date: '2023-02-01',
          note: 'Called for trial',
          transcriptOrdered: true,
        } as CalendarEvent,
        notCalled: {
          date: '2023-02-02',
          note: 'Not called - weather delay',
        } as CalendarEvent,
        recalled: {
          'key-1': {
            date: '2023-02-03',
            note: 'First recall',
            renderKey: 'key-1',
            transcriptOrdered: false,
          },
          'key-2': {
            date: '2023-02-04',
            note: 'Second recall',
            renderKey: 'key-2',
            transcriptOrdered: true,
          },
        },
        pretrialConference: {
          date: '2023-02-10',
          note: 'Pretrial conference held',
          transcriptOrdered: true,
        } as CalendarEvent,
        trialHearing: {
          date: '2023-02-15',
          note: 'Trial commenced',
          transcriptOrdered: true,
          trialHearingType: 'hearing',
        } as CalendarEvent,
      },
    };

    const transformed = transformFormStateToMinuteSheet(
      formStateWithHearings,
      'trial-123',
      '123-45',
    );

    expect(transformed).toEqual({
      ...mockMinuteSheet,
      caseRecord: {
        docketNumber: '123-45',
        calendarCall: {
          date: '2023-02-01',
          note: 'Called for trial',
          transcriptOrdered: true,
        },
        notCalled: {
          date: '2023-02-02',
          note: 'Not called - weather delay',
        },
        recalls: [
          {
            date: '2023-02-03',
            note: 'First recall',
            transcriptOrdered: false,
          },
          {
            date: '2023-02-04',
            note: 'Second recall',
            transcriptOrdered: true,
          },
        ],
        pretrialConference: {
          date: '2023-02-10',
          note: 'Pretrial conference held',
          transcriptOrdered: true,
        },
        trialHearing: {
          date: '2023-02-15',
          note: 'Trial commenced',
          transcriptOrdered: true,
          trialHearingType: 'hearing',
        },
      },
    });
  });

  const testCases = [
    {
      subSection: 'called',
      transformedSubSection: 'calendarCall',
      propertyToFillOut: 'date',
      value: '2020-10-02',
      expectedOutputForSection: {
        date: '2020-10-02',
        note: '',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'called',
      transformedSubSection: 'calendarCall',
      propertyToFillOut: 'note',
      value: 'test note',
      expectedOutputForSection: {
        date: '',
        note: 'test note',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'called',
      transformedSubSection: 'calendarCall',
      propertyToFillOut: 'transcriptOrdered',
      value: true,
      expectedOutputForSection: { date: '', note: '', transcriptOrdered: true },
    },
    {
      subSection: 'notCalled',
      transformedSubSection: 'notCalled',
      propertyToFillOut: 'date',
      value: '2020-10-02',
      expectedOutputForSection: { date: '2020-10-02', note: '' },
    },
    {
      subSection: 'notCalled',
      transformedSubSection: 'notCalled',
      propertyToFillOut: 'note',
      value: 'test note',
      expectedOutputForSection: { date: '', note: 'test note' },
    },
    {
      subSection: 'pretrialConference',
      transformedSubSection: 'pretrialConference',
      propertyToFillOut: 'date',
      value: '2020-10-02',
      expectedOutputForSection: {
        date: '2020-10-02',
        note: '',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'pretrialConference',
      transformedSubSection: 'pretrialConference',
      propertyToFillOut: 'note',
      value: 'test note',
      expectedOutputForSection: {
        date: '',
        note: 'test note',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'pretrialConference',
      transformedSubSection: 'pretrialConference',
      propertyToFillOut: 'transcriptOrdered',
      value: true,
      expectedOutputForSection: { date: '', note: '', transcriptOrdered: true },
    },
    {
      subSection: 'trialHearing',
      transformedSubSection: 'trialHearing',
      propertyToFillOut: 'date',
      value: '2020-10-02',
      expectedOutputForSection: {
        date: '2020-10-02',
        note: '',
        trialHearingType: '',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'trialHearing',
      transformedSubSection: 'trialHearing',
      propertyToFillOut: 'note',
      value: 'test note',
      expectedOutputForSection: {
        date: '',
        note: 'test note',
        trialHearingType: '',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'trialHearing',
      transformedSubSection: 'trialHearing',
      propertyToFillOut: 'trialHearingType',
      value: 'hearing',
      expectedOutputForSection: {
        date: '',
        note: '',
        trialHearingType: 'hearing',
        transcriptOrdered: false,
      },
    },
    {
      subSection: 'trialHearing',
      transformedSubSection: 'trialHearing',
      propertyToFillOut: 'transcriptOrdered',
      value: true,
      expectedOutputForSection: {
        date: '',
        note: '',
        trialHearingType: '',
        transcriptOrdered: true,
      },
    },
  ];
  it.each(testCases)(
    'should include updated $propertyToFillOut in $subSection when it is the only property with a value',
    ({
      subSection,
      transformedSubSection,
      propertyToFillOut,
      value,
      expectedOutputForSection,
    }) => {
      const stateToTransform = {
        ...mockMinuteSheetFormState,
        caseMetadataSection: {
          ...mockMinuteSheetFormState.caseMetadataSection,
          [subSection]: {
            ...mockMinuteSheetFormState.caseMetadataSection[subSection],
            [propertyToFillOut]: value,
          },
        },
      };

      const transformed = transformFormStateToMinuteSheet(
        stateToTransform,
        'trial-123',
        '123-45',
      );

      expect(transformed.caseRecord[transformedSubSection]).toMatchObject(
        expectedOutputForSection,
      );
    },
  );

  it('should handle empty arrays in recordToArray fields', () => {
    const formStateWithEmptyArrays = {
      ...mockMinuteSheetFormState,
      caseMetadataSection: {
        ...mockMinuteSheetFormState.caseMetadataSection,
        recalled: {},
      },
      motionsSection: {
        motions: {},
      },
      witnessesSection: {
        petitionerWitnesses: {},
        respondentWitnesses: {},
      },
      exhibitsSection: {
        exhibits: {},
      },
    };

    const transformed = transformFormStateToMinuteSheet(
      formStateWithEmptyArrays,
      'trial-123',
      '123-45',
    );

    expect(transformed).toEqual({
      ...mockMinuteSheet,
      caseRecord: {
        ...mockMinuteSheet.caseRecord,
        recalls: [],
      },
      proceedings: {
        ...mockMinuteSheet.proceedings,
        motions: [],
      },
      evidence: {
        ...mockMinuteSheet.evidence,
        petitionerWitnesses: [],
        respondentWitnesses: [],
        exhibits: [],
      },
    });
  });
});
