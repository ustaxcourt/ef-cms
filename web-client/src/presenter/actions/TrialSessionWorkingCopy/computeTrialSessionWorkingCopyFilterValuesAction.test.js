import { computeTrialSessionWorkingCopyFilterValuesAction } from './computeTrialSessionWorkingCopyFilterValuesAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('computeTrialSessionWorkingCopyFilterValuesAction', () => {
  it('should set all filters to true if props.key is filters.showAll and props.value is true', async () => {
    const result = await runAction(
      computeTrialSessionWorkingCopyFilterValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'filters.showAll',
          value: true,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              aBasisReached: false,
              continued: false,
              dismissed: false,
              recall: false,
              showAll: false,
            },
          },
        },
      },
    );
    expect(result.state.trialSessionWorkingCopy.filters).toEqual({
      aBasisReached: true,
      continued: true,
      dismissed: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      takenUnderAdvisement: true,
    });
  });

  it('should set all filters to false if props.key is filters.showAll and props.value is false', async () => {
    const result = await runAction(
      computeTrialSessionWorkingCopyFilterValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'filters.showAll',
          value: false,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              aBasisReached: false,
              continued: false,
              dismissed: false,
              recall: false,
              showAll: false,
            },
          },
        },
      },
    );
    expect(result.state.trialSessionWorkingCopy.filters).toEqual({
      aBasisReached: false,
      continued: false,
      dismissed: false,
      recall: false,
      rule122: false,
      setForTrial: false,
      settled: false,
      showAll: false,
      statusUnassigned: false,
      takenUnderAdvisement: false,
    });
  });

  it('should not update the filter when no props are passed in', async () => {
    const result = await runAction(
      computeTrialSessionWorkingCopyFilterValuesAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          trialSessionWorkingCopy: {
            filters: {
              aBasisReached: false,
              continued: false,
              dismissed: false,
              recall: false,
              showAll: false,
            },
          },
        },
      },
    );
    expect(result.state.trialSessionWorkingCopy.filters).toEqual({
      aBasisReached: false,
      continued: false,
      dismissed: false,
      recall: false,
      showAll: false,
    });
  });

  it('should set showAll to false if props.key is a filter that is not showAll, and props.value is false', async () => {
    const result = await runAction(
      computeTrialSessionWorkingCopyFilterValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'filters.aBasisReached',
          value: false,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              aBasisReached: false,
              continued: true,
              dismissed: true,
              recall: true,
              rule122: true,
              setForTrial: true,
              settled: true,
              showAll: true,
              statusUnassigned: true,
              takenUnderAdvisement: true,
            },
          },
        },
      },
    );
    expect(result.state.trialSessionWorkingCopy.filters.showAll).toEqual(false);
  });

  it('should set showAll to true if props.key is a filter that is not showAll, and all of the other filters are true', async () => {
    const result = await runAction(
      computeTrialSessionWorkingCopyFilterValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'filters.aBasisReached',
          value: true,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              aBasisReached: true,
              continued: true,
              dismissed: true,
              recall: true,
              rule122: true,
              setForTrial: true,
              settled: true,
              showAll: true,
              statusUnassigned: true,
              takenUnderAdvisement: true,
            },
          },
        },
      },
    );
    expect(result.state.trialSessionWorkingCopy.filters.showAll).toEqual(true);
  });

  it('should not change filters if props.key does not contain filters', async () => {
    const result = await runAction(
      computeTrialSessionWorkingCopyFilterValuesAction,
      {
        modules: {
          presenter,
        },
        props: {
          key: 'sort',
          value: true,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              aBasisReached: true,
              continued: false,
              dismissed: false,
              recall: false,
              showAll: false,
            },
          },
        },
      },
    );
    expect(result.state.trialSessionWorkingCopy.filters).toEqual({
      aBasisReached: true,
      continued: false,
      dismissed: false,
      recall: false,
      showAll: false,
    });
  });
});
