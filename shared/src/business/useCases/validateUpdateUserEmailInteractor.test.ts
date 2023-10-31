import { validateUpdateUserEmailInteractor } from './validateUpdateUserEmailInteractor';

describe('validateUpdateUserEmailInteractor', () => {
  it('runs validation on update user email form data with no invalid properties', () => {
    const errors = validateUpdateUserEmailInteractor({
      updateUserEmail: {
        confirmEmail: 'test@example.com',
        email: 'test@example.com',
      },
    });

    expect(errors).toBeFalsy();
  });

  it('runs validation on update user email form data with missing data', () => {
    const errors = validateUpdateUserEmailInteractor({
      updateUserEmail: {},
    });

    expect(errors).toBeDefined();
  });
});
