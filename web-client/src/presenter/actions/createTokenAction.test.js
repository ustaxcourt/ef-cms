import { createTokenAction } from './createTokenAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createTokenAction', () => {
  it('should create a token for a valid username', async () => {
    const result = await runAction(createTokenAction, {
      modules: {
        presenter,
      },
      state: { form: { name: 'petitioner@example.com' } },
    });

    expect(result.output.token).toBeDefined();
  });

  it('should throw an error if the username is not in the mock logins', async () => {
    await expect(
      runAction(createTokenAction, {
        modules: {
          presenter,
        },
        state: { form: { name: 'nachos' } },
      }),
    ).rejects.toThrow('Username "nachos" not found in mock logins.');
  });
});
