import { runAction } from 'cerebral/test';
import { setIsPaperFilingAction } from './setIsPaperFilingAction';

describe('setIsPaperFilingAction', () => {
  it('should set state.isPaperFiling true if props.isPaperFiling is true', async () => {
    const { state } = await runAction(setIsPaperFilingAction, {
      props: {
        isPaperFiling: true,
      },
      state: {
        isPaperFiling: null,
      },
    });

    expect(state.isPaperFiling).toEqual(true);
  });

  it('should set state.isPaperFiling false if props.isPaperFiling is falsy', async () => {
    const { state } = await runAction(setIsPaperFilingAction, {
      props: {
        isPaperFiling: undefined,
      },
      state: {
        isPaperFiling: null,
      },
    });

    expect(state.isPaperFiling).toEqual(false);
  });
});
