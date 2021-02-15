const util = require('./util');

describe('generatePassword', () => {
  it('should generate a strong password', () => {
    const pass = util.generatePassword(14);
    expect(pass).toHaveLength(14);
    expect(pass).toMatch(/\d/);
    expect(pass).toMatch(/[A-Z]/);
    expect(pass).toMatch(/[a-z]/);
    expect(pass).toMatch(/[!@#$%^&*()]/);
  });
});

describe('fakeEmail', () => {
  beforeAll(() => {});
  afterAll(() => {});

  it('should fake an email when we give it a real email.', () => {
    const realEmail = 'some-real-email@some-domain.net';
    const domainToUse = 'another-domain.net';
    const fakedEmail = util.fakeEmail({
      domainToUse,
      realEmail,
    });
    expect(fakedEmail).toEqual(expect.stringContaining('@another-domain.net'));
    expect(fakedEmail.split('@')[0].length).toBe(36);
    expect(fakedEmail.length).toBe(36 + '@another-domain.net'.length);
  });
});

describe('findAndMockEmails', () => {
  it('should replace the email addresses in the object passed in with fake ones', () => {
    const fakeObject = {
      caseCaption: 'Somebody vs someone else',
      email: 'why-would-you@i-would-never.org',
      primaryContact: {
        email: 'jason@jason-also.org',
        nameFirst: 'jason',
        nameLast: 'alsoJason',
      },
    };

    const fakedData = util.findAndMockEmails(fakeObject);
    expect(fakedData).toEqual({
      caseCaption: 'Somebody vs someone else',
      email: expect.stringContaining('@example.com'),
      primaryContact: {
        email: expect.stringContaining('@example.com'),
        nameFirst: 'jason',
        nameLast: 'alsoJason',
      },
    });
  });
});
