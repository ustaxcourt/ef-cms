import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionMinutesFormOptionsHelper } from './trialSessionMinutesFormOptionsHelper';

describe('trialSessionMinutesFormOptionsHelper', () => {
  let mockState;

  beforeEach(() => {
    mockState = {
      minuteSheetForm: {
        options: {
          irsPractitionerOptions: [
            { label: 'IRS 1', value: 'IRS 1' },
            { label: 'IRS 2', value: 'IRS 2' },
            { label: 'IRS 3', value: 'IRS 3' },
          ],
          judgeOptions: {
            judge1: { name: 'Judge One' },
            judge2: { name: 'Judge Two' },
          },
        },
        respondentsSection: {
          respondents: {
            resp1: { name: 'IRS 1' },
          },
        },
      },
    };
  });

  it('should filter out IRS practitioners that are already respondents', () => {
    const result = runCompute(trialSessionMinutesFormOptionsHelper, {
      state: mockState,
    });

    expect(result.filteredIrsPractitionerOptions).toEqual([
      { label: 'IRS 2', value: 'IRS 2' },
      { label: 'IRS 3', value: 'IRS 3' },
    ]);
  });

  it('should return all IRS practitioners when there are no respondents', () => {
    mockState.minuteSheetForm.respondentsSection.respondents = {};

    const result = runCompute(trialSessionMinutesFormOptionsHelper, {
      state: mockState,
    });

    expect(result.filteredIrsPractitionerOptions).toEqual([
      { label: 'IRS 1', value: 'IRS 1' },
      { label: 'IRS 2', value: 'IRS 2' },
      { label: 'IRS 3', value: 'IRS 3' },
    ]);
  });

  it('should return judge options unchanged', () => {
    const result = runCompute(trialSessionMinutesFormOptionsHelper, {
      state: mockState,
    });

    expect(result.judgeOptions).toEqual({
      judge1: { name: 'Judge One' },
      judge2: { name: 'Judge Two' },
    });
  });
});
