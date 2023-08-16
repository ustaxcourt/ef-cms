import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createNewPractitionerUser } from './createNewPractitionerUser';
import { put } from '../../dynamodbClientService';

jest.mock('../../dynamodbClientService', () => ({
  put: jest.fn(),
}));
const mockPut = put as jest.Mock;

describe('createNewPractitionerUser', () => {
  it('should not log an error when creating a new cognito account for a practitioner user', async () => {
    await createNewPractitionerUser({
      applicationContext,
      user: {
        barNumber: 'tpp1234',
        name: 'Test Private Practitioner',
        pendingEmail: 'practitioner@example.com',
        role: ROLES.privatePractitioner,
        section: 'practitioner',
        userId: '123',
      } as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        UserAttributes: expect.arrayContaining([
          {
            Name: 'email_verified',
            Value: 'True',
          },
          {
            Name: 'email',
            Value: 'practitioner@example.com',
          },
          {
            Name: 'custom:role',
            Value: ROLES.privatePractitioner,
          },
          {
            Name: 'name',
            Value: 'Test Private Practitioner',
          },
        ]),
        Username: 'practitioner@example.com',
      }),
    );
  });

  describe('updateUserRecords', () => {
    beforeEach(() => {
      mockPut.mockReturnValue(null);
    });

    it('should put new records with uppercase name and bar number', async () => {
      await createNewPractitionerUser({
        applicationContext,
        user: {
          barNumber: 'tpp1234',
          email: 'practitioner@example.com',
          name: 'Test Private Practitioner',
          role: ROLES.privatePractitioner,
          section: 'practitioner',
          userId: '123',
        } as any,
      });

      const putItem2 = mockPut.mock.calls[1][0].Item;
      const putItem3 = mockPut.mock.calls[2][0].Item;

      expect(putItem2.pk).toEqual(
        `${ROLES.privatePractitioner}|TEST PRIVATE PRACTITIONER`,
      );
      expect(putItem3.pk).toEqual(`${ROLES.privatePractitioner}|TPP1234`);
    });
  });
});
