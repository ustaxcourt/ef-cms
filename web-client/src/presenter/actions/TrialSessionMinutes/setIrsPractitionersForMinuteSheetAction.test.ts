import { presenter } from '@web-client/presenter/presenter';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setIrsPractitionersForMinuteSheetAction } from './setIrsPractitionersForMinuteSheetAction';

describe('setIrsPractitionersForMinuteSheetAction', () => {
  it('should filter and transform IRS practitioners correctly', async () => {
    const mockIrsPractitioners = [
      {
        admissionsStatus: 'Active',
        name: 'John Doe',
        practiceType: 'IRS',
      },
      {
        admissionsStatus: 'Inactive',
        name: 'Jane Smith',
        practiceType: 'IRS',
      },
      {
        admissionsStatus: 'Active',
        name: 'Bob Wilson',
        practiceType: 'Private',
      },
      {
        admissionsStatus: 'Active',
        name: 'Alice Brown',
        practiceType: 'IRS',
      },
    ];

    const { state } = await runAction(setIrsPractitionersForMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {
        irsPractitioners: mockIrsPractitioners,
      },
      state: {
        minuteSheetForm: {
          options: {
            irsPractitionerOptions: [],
          },
        },
      },
    });

    expect(state.minuteSheetForm.options.irsPractitionerOptions).toEqual([
      {
        label: 'John Doe',
        value: 'John Doe',
      },
      {
        label: 'Alice Brown',
        value: 'Alice Brown',
      },
    ]);
  });

  it('should handle empty practitioners array', async () => {
    const { state } = await runAction(setIrsPractitionersForMinuteSheetAction, {
      modules: {
        presenter,
      },
      props: {
        irsPractitioners: [],
      },
      state: {
        minuteSheetForm: {
          options: {
            irsPractitionerOptions: [],
          },
        },
      },
    });

    expect(state.minuteSheetForm.options.irsPractitionerOptions).toEqual([]);
  });
});
