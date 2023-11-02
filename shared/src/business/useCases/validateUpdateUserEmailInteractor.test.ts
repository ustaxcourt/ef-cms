import { validateUpdateUserEmailInteractor } from './validateUpdateUserEmailInteractor';

describe('validateUpdateUserEmailInteractor', () => {
  it('should NOT return validation errors when the updated email request is valid', () => {
    const errors = validateUpdateUserEmailInteractor({
      updateUserEmail: {
        confirmEmail: 'test@example.com',
        email: 'test@example.com',
      },
    });

    expect(errors).toBeNull();
  });

  it('should return validation errors when the updated user email form is missing data', () => {
    const errors = validateUpdateUserEmailInteractor({
      updateUserEmail: {
        confirmEmail: undefined, // this is a required property
        email: 'abc', // not a valid email
      } as any,
    });

    expect(errors).toEqual({
      confirmEmail: expect.anything(),
      email: expect.anything(),
    });
  });
});
