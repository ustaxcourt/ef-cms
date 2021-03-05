import { setupTest } from '../../../integration-tests/helpers';

describe('gotoDashboardSequence', () => {
  let test;

  beforeAll(() => {
    test = setupTest({
      useCases: {
        getUserInteractor: jest.fn().mockResolvedValue({ name: 'test user' }),
        setItemInteractor: jest.fn(),
      },
    });
  });

  it('should set the current user on state', async () => {
    test.applicationContext.getCurrentUser = jest.fn().mockReturnValue({});

    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('user')).toEqual({ name: 'test user' });
    expect(
      test.applicationContext.getUseCases().setItemInteractor.mock.calls[0][0],
    ).toMatchObject({ key: 'user', value: { name: 'test user' } });
  });
});
