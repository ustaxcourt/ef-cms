import { computeTrialSessionWorkingCopyFilterValuesAction } from './computeTrialSessionWorkingCopyFilterValuesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
              basisReached: false,
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
      basisReached: true,
      continued: true,
      definiteTrial: true,
      dismissed: true,
      motionToDismiss: true,
      probableSettlement: true,
      probableTrial: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      submittedCAV: true,
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
              basisReached: false,
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
      basisReached: false,
      continued: false,
      definiteTrial: false,
      dismissed: false,
      motionToDismiss: false,
      probableSettlement: false,
      probableTrial: false,
      recall: false,
      rule122: false,
      setForTrial: false,
      settled: false,
      showAll: false,
      statusUnassigned: false,
      submittedCAV: false,
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
              basisReached: false,
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
      basisReached: false,
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
          key: 'filters.basisReached',
          value: false,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              basisReached: false,
              continued: true,
              dismissed: true,
              recall: true,
              rule122: true,
              setForTrial: true,
              settled: true,
              showAll: true,
              statusUnassigned: true,
              submittedCAV: true,
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
          key: 'filters.basisReached',
          value: true,
        },
        state: {
          trialSessionWorkingCopy: {
            filters: {
              basisReached: true,
              continued: true,
              dismissed: true,
              recall: true,
              rule122: true,
              setForTrial: true,
              settled: true,
              showAll: true,
              statusUnassigned: true,
              submittedCAV: true,
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
              basisReached: true,
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
      basisReached: true,
      continued: false,
      dismissed: false,
      recall: false,
      showAll: false,
    });
  });
});
