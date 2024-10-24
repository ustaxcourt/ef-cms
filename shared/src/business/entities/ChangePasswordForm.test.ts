import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';

describe('ChangePasswordForm', () => {
  const email = 'updateMyPassword@example.com';

  it('should be valid when all required fields are present and password meets requirements', () => {
    const validChangePasswordForm = {
      email,
      password: 'TestPassword!1',
    };
    validChangePasswordForm['confirmPassword'] =
      validChangePasswordForm.password;

    const changePasswordForm = new ChangePasswordForm(validChangePasswordForm);

    expect(changePasswordForm.isValid()).toBe(true);
    expect(changePasswordForm.getFormattedValidationErrors()).toBeNull();
  });

  it('should not be valid when password does not match confirmPassword', () => {
    const inValidChangePasswordForm = {
      confirmPassword: 'Testing1$',
      email,
      password: 'Testing2$',
    };

    const changePasswordForm = new ChangePasswordForm(
      inValidChangePasswordForm,
    );

    expect(changePasswordForm.isValid()).toBe(false);
    expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
      confirmPassword: 'Passwords must match',
    });
  });

  describe('Required Fields', () => {
    it('should not be valid when password is not present', () => {
      const inValidChangePasswordForm = {
        confirmPassword: 'TestPassword!1',
        email,
      };

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        confirmPassword: 'Passwords must match',
      });
    });

    it('should not be valid when confirmPassword is not present', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'TestPassword!1',
      };

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        confirmPassword: 'Passwords must match',
      });
    });

    it('should not be valid when email is not present', () => {
      const inValidChangePasswordForm = {
        confirmPassword: 'TestPassword!1',
        password: 'TestPassword!1',
      };

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        email: 'Enter a valid email address',
      });
    });

    it('should not be valid when an email in the correct format is not present', () => {
      const inValidChangePasswordForm = {
        confirmPassword: 'TestPassword!1',
        email: 'myemailaddress',
        password: 'TestPassword!1',
      };

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        email: 'Enter email address in format: yourname@example.com',
      });
    });
  });

  describe('Password Requirements', () => {
    it('should not be valid when password does not contain number', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'testPassword',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must contain number',
      });
    });

    it('should not be valid when password does not contain space or special character', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'testpassword1',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;
      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must contain special character or space',
      });
    });

    it('should be valid when password contains a non-leading/non-trailing space as a special character', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'test Password 1',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;
      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(true);
    });

    it('should not be valid when password does not contain an uppercase character', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'testpassword!1',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must contain upper case letter',
      });
    });

    it('should not be valid when password does not contain an lowercase character', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'TESTPASSWORD!1',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must contain lower case letter',
      });
    });

    it('should not be valid when password does contains trailing space', () => {
      const inValidChangePasswordForm = {
        email,
        password: ' TestPassword!1',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must not contain leading or trailing space',
      });
    });

    it('should not be valid when password does not meet min length of 8', () => {
      const inValidChangePasswordForm = {
        email,
        password: 'TPwd!1',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must be between 8-99 characters long',
      });
    });

    it('should not be valid when password does not meet max length of 99', () => {
      const inValidChangePasswordForm = {
        email,
        password:
          'G?=Q2hiJHtTb/]n.EjFqqqaWBWJT29B(R8L{b]t#Kw+trZR=Y}EiVe68eRK[z&Yq/*P)L:y7Afr$V_e(7*fM?)b@0,[?Gb&?_@/(',
      };
      inValidChangePasswordForm['confirmPassword'] =
        inValidChangePasswordForm.password;

      const changePasswordForm = new ChangePasswordForm(
        inValidChangePasswordForm,
      );

      expect(changePasswordForm.isValid()).toBe(false);
      expect(changePasswordForm.getFormattedValidationErrors()).toMatchObject({
        password: 'Must be between 8-99 characters long',
      });
    });
  });
});
