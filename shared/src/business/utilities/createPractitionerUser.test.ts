import { ROLES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { createPractitionerUser } from './createPractitionerUser';

describe('createPractitionerUser', () => {
  const mockAdmissionsDate = '1876-02-19';

  it('should generate a bar number and userId when they are not provided', async () => {
    const mockUser = {
      admissionsDate: mockAdmissionsDate,
      admissionsStatus: 'Active',
      birthYear: '1993',
      firstName: 'Test',
      lastName: 'IRSPractitioner',
      originalBarState: 'CA',
      practiceType: 'DOJ',
      practitionerType: 'Attorney',
      role: ROLES.irsPractitioner,
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
      firstName: 'Test',
      lastName: 'IRSPractitioner',
      originalBarState: 'CA',
      practiceType: 'DOJ',
      practitionerType: 'Attorney',
      role: ROLES.irsPractitioner,
    };

    const result = await createPractitionerUser({
      applicationContext,
      user: mockUser,
    });

    expect(result.barNumber).toBe('1');
    expect(result.userId).not.toBeUndefined();
  });
});
