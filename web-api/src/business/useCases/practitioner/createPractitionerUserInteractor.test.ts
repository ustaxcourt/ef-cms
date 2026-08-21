jest.mock('@web-api/business/utilities/createPractitionerUser');
jest.mock('@web-api/persistence/postgres/users/upsertPractitioner');
jest.mock('@web-api/business/utilities/userDataCanGenerateValidBarNumber');
import {
  ACCOUNT_STATUS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { createPractitionerUserInteractor } from './createPractitionerUserInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { createPractitionerUser as createPractitionerUserMock } from '@web-api/business/utilities/createPractitionerUser';
import { userDataCanGenerateValidBarNumber as userDataCanGenerateValidBarNumberMock } from '@web-api/business/utilities/userDataCanGenerateValidBarNumber';

describe('createPractitionerUserInteractor', () => {
  const mockUser: RawPractitioner = {
    accountStatus: ACCOUNT_STATUS.active,
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'AT5678',
    birthYear: 2019,
    entityName: 'Practitioner',
    firmName: 'GW Law Offices',
    firstName: 'bob',
    lastName: 'sagot',
    name: 'Test Attorney',
    originalBarState: 'IL',
    practiceType: 'Private',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: '07044afe-641b-4d75-a84f-0698870b7650',
  };
  const createPractitionerUser = jest.mocked(createPractitionerUserMock);
  const userDataCanGenerateValidBarNumber = jest.mocked(
    userDataCanGenerateValidBarNumberMock,
  );

  beforeEach(() => {
    createPractitionerUser.mockResolvedValue(mockUser);
    userDataCanGenerateValidBarNumber.mockReturnValue(true);
  });

  it('should throw an error when the user is unauthorized to create a practitioner user', async () => {
    await expect(
      createPractitionerUserInteractor(
        {
          user: mockUser,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an InvalidRequest error when user data cannot generate a valid bar number', async () => {
    userDataCanGenerateValidBarNumber.mockReturnValue(false);

    await expect(
      createPractitionerUserInteractor(
        {
          user: mockUser,
        },
        mockAdmissionsClerkUser,
      ),
    ).rejects.toThrow(InvalidRequest);
  });

  it("should return the practitioner's bar number", async () => {
    const { barNumber } = await createPractitionerUserInteractor(
      {
        user: mockUser,
      },
      mockAdmissionsClerkUser,
    );

    expect(barNumber).toEqual(mockUser.barNumber);
  });

  it('should set practitioner.pendingEmail to practitioner.email and set practitioner.email to undefined', async () => {
    const mockEmail = 'testing@example.com';

    await createPractitionerUserInteractor(
      {
        user: {
          ...mockUser,
          email: mockEmail,
        },
      },
      mockAdmissionsClerkUser,
    );

    const mockUserCall = createPractitionerUser.mock.calls[0][0].user;
    expect(mockUserCall.email).toBeUndefined();
    expect(mockUserCall.pendingEmail).toEqual(mockEmail);
    expect(mockUserCall.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });

  it("should trim the practitioner's first and last names so that a valid bar number can be generated", async () => {
    const mockFirstName = ' sideshow';
    const mockLastName = ' bob';

    await createPractitionerUserInteractor(
      {
        user: {
          ...mockUser,
          firstName: mockFirstName,
          lastName: mockLastName,
        },
      },
      mockAdmissionsClerkUser,
    );

    const mockUserCall = createPractitionerUser.mock.calls[0][0].user;
    expect(mockUserCall.firstName).toEqual(mockFirstName.trim());
    expect(mockUserCall.lastName).toEqual(mockLastName.trim());
  });
});
