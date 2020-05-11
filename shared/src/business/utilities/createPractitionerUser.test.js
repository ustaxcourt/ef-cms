const { applicationContext } = require('../test/createTestApplicationContext');
const { createPractitionerUser } = require('./createPractitionerUser');
const { User } = require('../entities/User');

describe('createPractitionerUser', () => {
  const mockAdmissionsDate = new Date('1876/02/19');

  it('should generate a bar number and userId when they are not provided', async () => {
    const mockUser = {
      admissionsDate: mockAdmissionsDate,
      admissionsStatus: 'Active',
      birthYear: '1993',
      employer: 'DOJ',
      firstName: 'Test',
      lastName: 'IRSPractitioner',
      originalBarState: 'CA',
      practitionerType: 'Attorney',
      role: User.ROLES.irsPractitioner,
    };

    const result = await createPractitionerUser({
      applicationContext,
      user: mockUser,
    });

    expect(result.barNumber).not.toBeUndefined();
    expect(result.userId).not.toBeUndefined();
  });

  it('should use provided bar number when it is provided', async () => {
    const mockUser = {
      admissionsDate: mockAdmissionsDate,
      admissionsStatus: 'Active',
      barNumber: '1',
      birthYear: '1993',
      employer: 'DOJ',
      firstName: 'Test',
      lastName: 'IRSPractitioner',
      originalBarState: 'CA',
      practitionerType: 'Attorney',
      role: User.ROLES.irsPractitioner,
    };

    const result = await createPractitionerUser({
      applicationContext,
      user: mockUser,
    });

    expect(result.barNumber).toBe('1');
    expect(result.userId).not.toBeUndefined();
  });
});
