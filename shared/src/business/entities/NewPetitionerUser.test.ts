import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';

describe('NewPetitionerUser', () => {
  const validEntity = {
    confirmPassword: '12$Azasodfkj3',
    email: 'test@example.com',
    name: 'bob',
    password: '12$Azasodfkj3',
  };

  it('should return a valid NewPetitionerUser entity', () => {
    const formEntity = new NewPetitionerUser(validEntity);
    expect(formEntity.isValid()).toBeTruthy();
    expect(formEntity.getValidationErrors()).toBeNull();
  });

  it('should return error message for email', () => {
    const formEntity = new NewPetitionerUser({
      ...validEntity,
      email: 'hello',
    });
    expect(formEntity.isValid()).toBeFalsy();
    expect(formEntity.getValidationErrors()).toEqual({
      email: 'Enter a valid email address',
    });
  });

  describe('Name', () => {
    it('should return error message for name when not provided', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        name: '',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        name: 'Enter a name',
      });
    });

    it('should return error message for name when exceeds length', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        name: '#'.repeat(101),
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        name: 'Enter a name with fewer than 100 characters',
      });
    });
  });

  it('should return error message for confirmPassword', () => {
    const formEntity = new NewPetitionerUser({
      ...validEntity,
      confirmPassword: 'not matching',
    });
    expect(formEntity.isValid()).toBeFalsy();
    expect(formEntity.getValidationErrors()).toEqual({
      confirmPassword: '"confirmPassword" must be [ref:password]',
    });
  });

  describe('password', () => {
    it('should include "hasNoLeadingOrTrailingSpace" in the error message when provided a password with leading space', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: ' 12$Azasodfkj3',
        password: ' 12$Azasodfkj3',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasNoLeadingOrTrailingSpace',
      });
    });

    it('should include "hasNoLeadingOrTrailingSpace" in the error message when provided a password with trailing space', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: '12$Azasodfkj3 ',
        password: '12$Azasodfkj3 ',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasNoLeadingOrTrailingSpace',
      });
    });

    it('should set "hasOneLowercase" in the error message when provided a password does not contain a lower case character', () => {
      const PASSWORD = '1AWD%$DNAWK';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasOneLowercase',
      });
    });

    it('should include "hasOneNumber" in the error message when provided a password does not contain a number', () => {
      const PASSWORD = 'aAWD%$DNAWK';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasOneNumber',
      });
    });

    it('should include "hasOneUppercase" in the error message when provided a password does not contain an upper case character', () => {
      const PASSWORD = 'aaws%$dn1awk';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasOneUppercase',
      });
    });

    it('should include "hasSpecialCharacterOrSpace" in the error message when provided a password does not contain a special character', () => {
      const PASSWORD = 'aaWsdn1awk';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toEqual({
        password: 'hasSpecialCharacterOrSpace',
      });
    });

    it('should include "isProperLength" in the error message when provided a password is fewer than 8 characters long', () => {
      const PASSWORD = '1';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toMatchObject({
        password:
          'hasOneLowercase|hasOneUppercase|hasSpecialCharacterOrSpace|isProperLength',
      });
    });

    it('should include "isProperLength" in the error message when provided a password is greater than 99 characters long', () => {
      const PASSWORD = '12$Azasodfkj3'.repeat(13);
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getValidationErrors()).toMatchObject({
        password: 'isProperLength',
      });
    });
  });
});
