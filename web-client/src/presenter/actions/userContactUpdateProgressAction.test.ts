import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { userContactUpdateProgressAction } from './userContactUpdateProgressAction';

describe('userContactUpdateProgressAction', () => {
  it('should set the state.userContactEditProgress based on props passed in', async () => {
    const result = await runAction(userContactUpdateProgressAction, {
      modules: {
        presenter,
      },
      props: {
        completedCases: 3,
        totalCases: 15,
      },
      state: {
        userContactEditProgress: {},
      },
    });

    expect(result.state.userContactEditProgress).toEqual({
      completedCases: 3,
      totalCases: 15,
    });
  });

  it('should not set the completed to a lower number on a new event that was lower than the current completedCases count', async () => {
    const result = await runAction(userContactUpdateProgressAction, {
      modules: {
        presenter,
      },
      props: {
        completedCases: 3,
        totalCases: 15,
      },
      state: {
        userContactEditProgress: {
          completedCases: 100,
        },
      },
    });

    expect(result.state.userContactEditProgress).toEqual({
      completedCases: 3,
      totalCases: 15,
    });
  });
});
