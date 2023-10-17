import { CreateAccountForm } from '@shared/business/entities/CreateAccountForm';

describe('CreateAccountForm', () => {
  const validEntity = {
    confirmPassword: '12$Azasodfkj3',
    email: 'test@example.com',
    name: 'bob',
    password: '12$Azasodfkj3',
  };

  it('should return a valid CreateAccountForm entity', () => {
    const formEntity = new CreateAccountForm(validEntity);
    expect(formEntity.getValidationErrors()).toBeNull();
    expect(formEntity.isValid()).toBeTruthy();
  });

  it('should return error message for email', () => {
    const formEntity = new CreateAccountForm({
      ...validEntity,
      email: 'hello',
    });
    expect(formEntity.isValid()).toBeFalsy();
    expect(formEntity.getFormattedValidationErrors()).toEqual({
      email: '"email" must be a valid email',
    });
  });

  it('should return error message for name', () => {
    const formEntity = new CreateAccountForm({
      ...validEntity,
      name: '',
    });
    expect(formEntity.isValid()).toBeFalsy();
    expect(formEntity.getFormattedValidationErrors()).toEqual({
      name: '"name" is not allowed to be empty',
    });
  });

  it('should return error message for password', () => {
    const formEntity = new CreateAccountForm({
      ...validEntity,
      confirmPassword: 'not matching',
    });
    expect(formEntity.isValid()).toBeFalsy();
    expect(formEntity.getFormattedValidationErrors()).toEqual({
      confirmPassword: '"confirmPassword" must be [ref:password]',
    });
  });

  describe('password', () => {
    it('should set hasNoLeadingOrTrailingSpace to false when provided a password with leading space', () => {
      const formEntity = new CreateAccountForm({
        ...validEntity,
        confirmPassword: ' 12$Azasodfkj3',
        password: ' 12$Azasodfkj3',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        password: {
          hasNoLeadingOrTrailingSpace: false,
          hasOneLowercase: true,
          hasOneNumber: true,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });

    it('should set hasNoLeadingOrTrailingSpace to false when provided a password with trailing space', () => {
      const formEntity = new CreateAccountForm({
        ...validEntity,
        confirmPassword: '12$Azasodfkj3 ',
        password: '12$Azasodfkj3 ',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        password: {
          hasNoLeadingOrTrailingSpace: false,
          hasOneLowercase: true,
          hasOneNumber: true,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });
  });
});
