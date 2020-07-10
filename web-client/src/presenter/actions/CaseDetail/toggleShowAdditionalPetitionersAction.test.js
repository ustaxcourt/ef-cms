import { runAction } from 'cerebral/test';
import { toggleShowAdditionalPetitionersAction } from './toggleShowAdditionalPetitionersAction';

describe('toggleShowAdditionalPetitionersAction', () => {
  it('should default to true for the first run', async () => {
    const result = await runAction(toggleShowAdditionalPetitionersAction);

    expect(result.state.showingAdditionalPetitioners).toEqual(true);
  });

  it('should be true if the state value is false', async () => {
    const result = await runAction(toggleShowAdditionalPetitionersAction, {
      state: {
        showingAdditionalPetitioners: false,
      },
    });

    expect(result.state.showingAdditionalPetitioners).toEqual(true);
  });

  it('should be false if the state value is true', async () => {
    const result = await runAction(toggleShowAdditionalPetitionersAction, {
      state: {
        showingAdditionalPetitioners: true,
      },
    });

    expect(result.state.showingAdditionalPetitioners).toEqual(false);
  });
});
