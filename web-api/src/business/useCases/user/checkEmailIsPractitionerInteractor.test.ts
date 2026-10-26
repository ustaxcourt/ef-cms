import {
  mockAdmissionsClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { checkEmailIsPractitioner } from '@web-api/persistence/postgres/users/checkEmailIsPractitioner';
import { checkEmailIsPractitionerInteractor } from './checkEmailIsPractitionerInteractor';

jest.mock('@web-api/persistence/postgres/users/checkEmailIsPractitioner');

describe('checkEmailIsPetitionerInteractor', () => {
  const mockEmail = 'practitioner@example.com';
  const checkEmailIsPractitionerMock = jest.mocked(checkEmailIsPractitioner);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when the user is unauthorized to check practitioner emails', async () => {
    await expect(
      checkEmailIsPractitionerInteractor(
        { email: mockEmail },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized to get user emails');

    expect(checkEmailIsPractitionerMock).not.toHaveBeenCalled();
  });

  it('should check the email and return true when it belongs to a practitioner', async () => {
    checkEmailIsPractitionerMock.mockResolvedValue(true);

    const result = await checkEmailIsPractitionerInteractor(
      { email: mockEmail },
      mockAdmissionsClerkUser,
    );

    expect(checkEmailIsPractitionerMock).toHaveBeenCalledWith({
      email: mockEmail,
    });
    expect(result).toBe(true);
  });

  it('should return false when the email does not belong to a practitioner', async () => {
    checkEmailIsPractitionerMock.mockResolvedValue(false);

    const result = await checkEmailIsPractitionerInteractor(
      { email: mockEmail },
      mockAdmissionsClerkUser,
    );

    expect(result).toBe(false);
  });
});
