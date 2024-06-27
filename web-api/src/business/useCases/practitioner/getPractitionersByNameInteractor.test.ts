import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getPractitionersByNameInteractor } from './getPractitionersByNameInteractor';

describe('getPractitionersByNameInteractor', () => {
  describe('Logged in User', () => {
    beforeEach(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitionsClerk,
        userId: 'petitionsClerk',
      });
    });

    it('returns an unauthorized error on petitioner user role', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.petitioner,
        userId: 'petitioner',
      });

      await expect(
        getPractitionersByNameInteractor(
          applicationContext,
          {} as { name: string; searchAfter: string },
        ),
      ).rejects.toThrow('Unauthorized for searching practitioners');
    });

    it('throws an error if name is not passed in', async () => {
      await expect(
        getPractitionersByNameInteractor(
          applicationContext,
          {} as { name: string; searchAfter: string },
        ),
      ).rejects.toThrow('Name must be provided to search');
    });

    it('calls search function with correct params and returns records for a name search', async () => {
      applicationContext
        .getPersistenceGateway()
        .getPractitionersByName.mockReturnValue({
          lastKey: [1.23],
          results: [
            {
              barNumber: 'PT1234',
              contact: { flavor: 'bbq', state: 'WI' },
              name: 'Test Practitioner1',
              role: ROLES.irsPractitioner,
              userId: '8190d648-e643-4964-988e-141e4e0db861',
            },
            {
              barNumber: 'PT5432',
              contact: { favoriteColor: 'chartreuse', state: 'WI' },
              name: 'Test Practitioner2',
              role: ROLES.privatePractitioner,
              userId: '12d5bb3a-e867-4066-bda5-2f178a76191f',
            },
          ],
          total: 2,
        });

      const results = await getPractitionersByNameInteractor(
        applicationContext,
        {
          name: 'Test Practitioner',
          searchAfter: undefined as unknown as string,
        },
      );

      expect(results).toMatchObject({
        searchResults: {
          lastKey: [1.23],
          practitioners: [
            {
              barNumber: 'PT1234',
              contact: { state: 'WI' },
              name: 'Test Practitioner1',
            },
            {
              barNumber: 'PT5432',
              contact: { state: 'WI' },
              name: 'Test Practitioner2',
            },
          ],
          total: 2,
        },
      });
    });
  });

  describe('Public User', () => {
    beforeEach(() => {
      applicationContext.getCurrentUser.mockReturnValue(undefined);

      applicationContext
        .getPersistenceGateway()
        .getPractitionersByName.mockReturnValue({
          lastKey: [1.23],
          results: [
            {
              barNumber: 'PT1234',
              contact: { flavor: 'bbq', state: 'WI' },
              name: 'Test Practitioner1',
              originalBarState: 'originalBarState_WI',
              role: ROLES.irsPractitioner,
              userId: '8190d648-e643-4964-988e-141e4e0db861',
            },
            {
              barNumber: 'PT5432',
              contact: { favoriteColor: 'chartreuse', state: 'WI' },
              name: 'Test Practitioner2',
              originalBarState: 'originalBarState_WI',
              role: ROLES.privatePractitioner,
              userId: '12d5bb3a-e867-4066-bda5-2f178a76191f',
            },
          ],
          total: 2,
        });
    });

    it('should not throw an Unauthorized error if its a Public user', async () => {
      const results = await getPractitionersByNameInteractor(
        applicationContext,
        {
          name: 'Test Practitioner',
          searchAfter: undefined as unknown as string,
        },
      );

      expect(results).toBeDefined();
    });

    it('should return the correct practitioner data when a Public user requests it', async () => {
      const results = await getPractitionersByNameInteractor(
        applicationContext,
        {
          name: 'Test Practitioner',
          searchAfter: undefined as unknown as string,
        },
      );

      expect(results).toMatchObject({
        searchResults: {
          lastKey: [1.23],
          practitioners: [
            {
              barNumber: 'PT1234',
              contact: { state: 'originalBarState_WI' },
              name: 'Test Practitioner1',
            },
            {
              barNumber: 'PT5432',
              contact: { state: 'originalBarState_WI' },
              name: 'Test Practitioner2',
            },
          ],
          total: 2,
        },
      });
    });
  });
});
