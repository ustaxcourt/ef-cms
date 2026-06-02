import {
  getNewPasswordForEnvironment,
  makeNewPassword,
} from './make-new-password';
import { environment } from '@web-api/environment';
import fs from 'fs';
import path from 'path';

jest.mock('@web-api/environment', () => ({
  environment: {
    defaultAccountPass: 'Testing1234$',
    stage: 'local',
  },
}));

// ------------------ Parsing the Actual Password Policy  ------------------ //

// The following methods parse the password policy from the primary user pool,
// defined in web-api/terraform/modules/everything-else-deprecated/cognito.tf.

// We do this so this test can ensure `makeNewPassword` generates passwords
// that meet the requirements, even if those requirements change in the future.

const parsePasswordPolicy = (content: string) => {
  const policyMatch = content.match(
    /resource "aws_cognito_user_pool" "pool"\s*{[\s\S]*?password_policy\s*{([^}]+)}/,
  );
  if (!policyMatch) {
    throw new Error('Could not find password_policy in cognito.tf');
  }
  const policyContent = policyMatch[1];
  const getVal = (key: string) => {
    const match = policyContent.match(new RegExp(`${key}\\s*=\\s*(\\S+)`));
    return match ? match[1] : null;
  };

  return {
    minimumLength: parseInt(getVal('minimum_length') || '0'),
    requireLowercase: getVal('require_lowercase') === 'true',
    requireNumbers: getVal('require_numbers') === 'true',
    requireSymbols: getVal('require_symbols') === 'true',
    requireUppercase: getVal('require_uppercase') === 'true',
  };
};

const getPasswordRequirements = () => {
  const cognitoTfPath = path.join(
    __dirname,
    '../../web-api/terraform/modules/everything-else-deprecated/cognito.tf',
  );
  const cognitoTfContent = fs.readFileSync(cognitoTfPath, 'utf8');

  return parsePasswordPolicy(cognitoTfContent);
};

const isValidPassword = (
  password: string,
  requirements: ReturnType<typeof getPasswordRequirements>,
) => {
  if (password.length < requirements.minimumLength) return false;
  if (requirements.requireLowercase && !/[a-z]/.test(password)) return false;
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requirements.requireNumbers && !/[0-9]/.test(password)) return false;
  return !(
    requirements.requireSymbols && !/[\^*.()@#%&/,><:;_~=+-]/.test(password)
  );
};

describe('makeNewPassword', () => {
  const policy = getPasswordRequirements();

  it('generates a password that meets the cognito requirements over 10,000 iterations', () => {
    for (let i = 0; i < 10000; i++) {
      const password = makeNewPassword();
      expect(isValidPassword(password, policy)).toBe(true);
    }
  });

  it('returns an empty string if no valid character sets are provided', () => {
    const password = makeNewPassword([]);
    expect(password).toBe('');
  });

  it('returns an empty string if only invalid character sets are provided', () => {
    const password = makeNewPassword(['invalid']);
    expect(password).toBe('');
  });

  it('handles some valid and some invalid character sets', () => {
    const password = makeNewPassword(['numbers', 'invalid']);
    expect(/^[0-9]+$/.test(password)).toBe(true);
    expect(password).not.toBe('');
  });

  it('uses the provided length if specified', () => {
    const length = 25;
    const password = makeNewPassword(undefined, length);
    expect(password.length).toBe(length);
  });

  it('uses the number of character sets if provided length is too small', () => {
    // 4 character sets by default: numbers, symbols, uppercase, lowercase
    // If length is < 4, it should fallback to 4.
    const length = 2;
    const password = makeNewPassword(undefined, length);
    expect(password.length).toBe(4);
  });

  it('uses a random length between 12 and 20 if length is not specified', () => {
    for (let i = 0; i < 100; i++) {
      const password = makeNewPassword();
      expect(password.length).toBeGreaterThanOrEqual(12);
      expect(password.length).toBeLessThanOrEqual(20);
    }
  });

  describe('getNewPasswordForEnvironment', () => {
    it('returns defaultAccountPass when stage is not prod', () => {
      environment.stage = 'local';
      expect(getNewPasswordForEnvironment()).toBe('Testing1234$');
    });

    it('returns a new password when stage is prod', () => {
      environment.stage = 'prod';
      const password = getNewPasswordForEnvironment();
      expect(password).not.toBe('Testing1234$');
      expect(isValidPassword(password, policy)).toBe(true);
    });
  });
});
