import { InvalidEntityError, UnauthorizedError } from '../../../errors/errors';
import { MOCK_PRACTITIONER } from '../../../test/mockUsers';
import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createPractitionerDocumentInteractor } from './createPractitionerDocumentInteractor';
jest.mock('../users/generateChangeOfAddress');

describe('updatePractitionerUserInteractor', () => {
  let testUser;
  let mockPractitioner = MOCK_PRACTITIONER as TPractitioner;
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    description: 'hubba bubba bubble gum',
    fileName: 'application.pdf',
    location: undefined,
    practitionerDocumentFileId: '07044afe-641b-4d75-a84f-0698870b7650',
  } as any;

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };
    mockPractitioner = { ...MOCK_PRACTITIONER };

    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockImplementation(() => mockPractitioner);
    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
    applicationContext
      .getPersistenceGateway()
      .createNewPractitionerUser.mockImplementation(({ user }) => user);
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);
  });

  it('should throw an unauthorized error when the user does not have permission to update the practitioner user', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      createPractitionerDocumentInteractor(applicationContext, {
        barNumber: 'pt1234',
        documentMetadata: mockDocumentMetadata,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error if the practitioner document has the wrong type', async () => {
    await expect(
      createPractitionerDocumentInteractor(applicationContext, {
        barNumber: 'pt1234',
        documentMetadata: { ...mockDocumentMetadata, categoryType: 'GG' },
      }),
    ).rejects.toThrow(InvalidEntityError);
  });

  it('should create a new practitioner document', async () => {
    const results = await createPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: 'pt1234',
        documentMetadata: mockDocumentMetadata,
      },
    );
    expect(results).toMatchObject({ ...mockDocumentMetadata });
  });
});
