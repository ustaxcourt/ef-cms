import { applicationContext } from '../../test/createTestApplicationContext';
import { createPractitionerDocumentInteractor } from './createPractitionerDocumentInteractor';
import { MOCK_PRACTITIONER } from '../../../test/mockUsers';
import {
  ROLES,
  PRACTITIONER_DOCUMENT_TYPES,
} from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
jest.mock('../users/generateChangeOfAddress');

describe('updatePractitionerUserInteractor', () => {
  let testUser;
  let mockPractitioner = MOCK_PRACTITIONER as TPractitioner;
  const mockDocumentMetadata = {
    categoryName: 'Application',
    categoryType: 'Application',
    practitionerDocumentFileId: '07044afe-641b-4d75-a84f-0698870b7650',
    description: 'hubba bubba bubble gum',
    location: undefined,
    fileName: 'application.pdf',
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

  it('should create a new document', async () => {
    const results = await createPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: 'pt1234',
        documentMetadata: mockDocumentMetadata,
      },
    );
    console.log(results);
    expect(results).toMatchObject({ ...mockDocumentMetadata });
  });
});
