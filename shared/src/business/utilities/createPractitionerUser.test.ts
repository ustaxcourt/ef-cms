import { ROLES, SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '../test/createTestApplicationContext';
import { createPractitionerUser } from './createPractitionerUser';

describe('createPractitionerUser', () => {
  it('should generate a bar number and userId when they are not provided', async () => {
    const { barNumber, userId } = await createPractitionerUser(
      applicationContext,
      {
        user: {
          admissionsDate: '1876-02-19',
          admissionsStatus: 'Active',
          barNumber: undefined,
          birthYear: '1993',
          employer: 'DOJ',
          entityName: 'Practitioner',
          firstName: 'Test',
          lastName: 'IRSPractitioner',
          name: 'Test IRSPractitioner',
          originalBarState: 'CA',
          practitionerType: 'Attorney',
          role: ROLES.irsPractitioner,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
          userId: undefined,
        } as unknown as RawPractitioner,
      },
    );

    expect(barNumber).toBeDefined();
    expect(userId).toBeDefined();
  });

  it('should use provided bar number when it is provided', async () => {
    const mockBarNumber = 'tp8172';

    const { barNumber } = await createPractitionerUser(applicationContext, {
      user: {
        admissionsDate: '1876-02-19',
        admissionsStatus: 'Active',
        barNumber: mockBarNumber,
        birthYear: '1993',
        employer: 'DOJ',
        entityName: 'Practitioner',
        firstName: 'Test',
        lastName: 'IRSPractitioner',
        name: 'Test IRSPractitioner',
        originalBarState: 'CA',
        practitionerType: 'Attorney',
        role: ROLES.irsPractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        userId: '70e686e6-3ab3-49f1-8d5b-edf1596d86ac',
      },
    });

    expect(barNumber).toBe(mockBarNumber);
  });
});
