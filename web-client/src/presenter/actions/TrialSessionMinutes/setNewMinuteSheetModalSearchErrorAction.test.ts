import { runAction } from '@web-client/presenter/test.cerebral';
import { setNewMinuteSheetModalSearchErrorAction } from './setNewMinuteSheetModalSearchErrorAction';

describe('setNewMinuteSheetModalSearchErrorAction', () => {
  it('should set hasSearched to true', async () => {
    const { state } = await runAction(setNewMinuteSheetModalSearchErrorAction, {
      props: {
        errorType: 'noResultsFound',
      },
      state: {
        modal: {},
      },
    });

    expect(state.modal.hasSearched).toBe(true);
  });

  it('should set isCaseAlreadyOnTrialSession to true when errorType is caseAlreadyOnTrialSession', async () => {
    const { state } = await runAction(setNewMinuteSheetModalSearchErrorAction, {
      props: {
        errorType: 'caseAlreadyOnTrialSession',
      },
      state: {
        modal: {},
      },
    });

    expect(state.modal.isCaseAlreadyOnTrialSession).toBe(true);
    expect(state.modal.noResultsFound).toBe(false);
  });

  it('should set noResultsFound to true when errorType is not caseAlreadyOnTrialSession', async () => {
    const { state } = await runAction(setNewMinuteSheetModalSearchErrorAction, {
      props: {
        errorType: 'noResultsFound',
      },
      state: {
        modal: {},
      },
    });

    expect(state.modal.noResultsFound).toBe(true);
    expect(state.modal.isCaseAlreadyOnTrialSession).toBe(false);
  });
});
