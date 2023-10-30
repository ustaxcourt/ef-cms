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
    expect(formEntity.getFormattedValidationErrors()).toEqual({
      email: 'Enter a valid email address',
      password: {
        hasNoLeadingOrTrailingSpace: true,
        hasOneLowercase: true,
        hasOneNumber: true,
        hasOneUppercase: true,
        hasSpecialCharacterOrSpace: true,
        isProperLength: true,
      },
    });
  });

  describe('Name', () => {
    it('should return error message for name when not provided', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        name: '',
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        name: 'Enter a name',
        password: {
          hasNoLeadingOrTrailingSpace: true,
          hasOneLowercase: true,
          hasOneNumber: true,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });

    it('should return error message for name when exceeds length', () => {
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        name: '#'.repeat(101),
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        name: 'Enter a name with less than 100 characters',
        password: {
          hasNoLeadingOrTrailingSpace: true,
          hasOneLowercase: true,
          hasOneNumber: true,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });
  });

  it('should return error message for confirmPassword', () => {
    const formEntity = new NewPetitionerUser({
      ...validEntity,
      confirmPassword: 'not matching',
    });
    expect(formEntity.isValid()).toBeFalsy();
    expect(formEntity.getFormattedValidationErrors()).toEqual({
      confirmPassword: '"confirmPassword" must be [ref:password]',
      password: {
        hasNoLeadingOrTrailingSpace: true,
        hasOneLowercase: true,
        hasOneNumber: true,
        hasOneUppercase: true,
        hasSpecialCharacterOrSpace: true,
        isProperLength: true,
      },
    });
  });

  describe('password', () => {
    it('should set hasNoLeadingOrTrailingSpace to false when provided a password with leading space', () => {
      const formEntity = new NewPetitionerUser({
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
      const formEntity = new NewPetitionerUser({
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

    it('should set hasOneLowercase to false when provided a password does not contain a lower case character', () => {
      const PASSWORD = '1AWD%$DNAWK';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        password: {
          hasNoLeadingOrTrailingSpace: true,
          hasOneLowercase: false,
          hasOneNumber: true,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });

    it('should set hasOneNumber to false when provided a password does not contain a number', () => {
      const PASSWORD = 'aAWD%$DNAWK';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        password: {
          hasNoLeadingOrTrailingSpace: true,
          hasOneLowercase: true,
          hasOneNumber: false,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });

    it('should set hasOneUppercase to false when provided a password does not contain an upper case character', () => {
      const PASSWORD = 'aaws%$dn1awk';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        password: {
          hasNoLeadingOrTrailingSpace: true,
          hasOneLowercase: true,
          hasOneNumber: true,
          hasOneUppercase: false,
          hasSpecialCharacterOrSpace: true,
          isProperLength: true,
        },
      });
    });

    it('should set hasSpecialCharacterOrSpace to false when provided a password does not contain a special character', () => {
      const PASSWORD = 'aaWsdn1awk';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        password: {
          hasNoLeadingOrTrailingSpace: true,
          hasOneLowercase: true,
          hasOneNumber: true,
          hasOneUppercase: true,
          hasSpecialCharacterOrSpace: false,
          isProperLength: true,
        },
      });
    });

    it('should set isProperLength to false when provided a password is less than 8 characters long', () => {
      const PASSWORD = '1';
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toMatchObject({
        password: {
          isProperLength: false,
        },
      });
    });

    it('should set isProperLength to false when provided a password is greater than 99 characters long', () => {
      const PASSWORD = '#'.repeat(101);
      const formEntity = new NewPetitionerUser({
        ...validEntity,
        confirmPassword: PASSWORD,
        password: PASSWORD,
      });
      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toMatchObject({
        password: {
          isProperLength: false,
        },
      });
    });
  });
});
