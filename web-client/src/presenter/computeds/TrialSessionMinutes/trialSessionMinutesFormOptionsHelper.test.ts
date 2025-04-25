import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionMinutesFormOptionsHelper } from './trialSessionMinutesFormOptionsHelper';
import {
  ACTION_FILED_BY_OPTIONS,
  ACTION_FILED_BY_OPTIONS_INVERTED,
} from '@shared/business/entities/EntityConstants';

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
        actionsAndFilingsSection: {
          actionsAndFilings: {},
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

  it('should provide court document type options when an action/filing entry was filed by the court', () => {
    const renderKey = '123456';
    mockState.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings = {
      renderKey: {
        renderKey,
        filedBy:
          ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.court],
      },
    };

    const { documentTypeOptions } = runCompute(
      trialSessionMinutesFormOptionsHelper,
      {
        state: mockState,
      },
    );

    expect(
      documentTypeOptions[renderKey].some(option => option.value === 'O'),
    ).toBeTruthy();

    expect(
      documentTypeOptions[renderKey].some(option => option.value === 'A'),
    ).toBeFalsy();
  });

  it('should provide internal document type options when an action/filing entry was not filed by the court', () => {
    const renderKey = '123456';
    mockState.minuteSheetForm.actionsAndFilingsSection.actionsAndFilings = {
      renderKey: {
        renderKey,
        filedBy:
          ACTION_FILED_BY_OPTIONS_INVERTED[ACTION_FILED_BY_OPTIONS.respondent],
      },
    };

    const { documentTypeOptions } = runCompute(
      trialSessionMinutesFormOptionsHelper,
      {
        state: mockState,
      },
    );

    expect(
      documentTypeOptions[renderKey].some(option => option.value === 'A'),
    ).toBeTruthy();

    expect(
      documentTypeOptions[renderKey].some(option => option.value === 'O'),
    ).toBeFalsy();
  });
});
