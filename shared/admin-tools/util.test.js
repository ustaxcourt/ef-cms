const { generatePassword } = require('./util');

describe('generatePassword', () => {
  it('should generate a strong password', () => {
    const pass = generatePassword(14);
    expect(pass).toHaveLength(14);
    expect(pass).toMatch(/\d/);
    expect(pass).toMatch(/[A-Z]/);
    expect(pass).toMatch(/[a-z]/);
    expect(pass).toMatch(/[!@#$%^&*()]/);
  });
});
