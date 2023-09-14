import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createTokenAction } from './createTokenAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('createTokenAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

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

  it('should throw an error if the user is a legacyJudge due to legacy judges not allowed to login (no account)', async () => {
    await expect(
      runAction(createTokenAction, {
        modules: {
          presenter,
        },
        state: { form: { name: 'judgefieri@example.com' } },
      }),
    ).rejects.toThrow(
      'The legacy judge "judgefieri@example.com" cannot login.',
    );
  });
});
