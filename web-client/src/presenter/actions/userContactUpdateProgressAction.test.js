import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
    });
    expect(result.state.userContactEditProgress).toEqual({
      completedCases: 3,
      inProgress: true,
      totalCases: 15,
    });
  });
});
