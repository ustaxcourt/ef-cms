import {
  MOCK_PRACTITIONER,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateEntryOfAppearancePdfInteractor } from './generateEntryOfAppearancePdfInteractor';

describe('generateEntryOfAppearancePdfInteractor', () => {
  const caseCaptionExtension =
    'Bert & Ernie, Petitioners v. Commissioner of Internal Revenue, Respondent';
  const caseTitle = 'Bert & Ernie';
  const docketNumberWithSuffix = '123-45S';

  const filers = [petitionerUser.userId];
  const petitioners = [
    { contactId: petitionerUser.userId, name: petitionerUser.name },
  ];

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(MOCK_PRACTITIONER);
  });

  it('should throw an unauthorized error if the user has no access to associate self with case', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      generateEntryOfAppearancePdfInteractor(applicationContext, {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers,
        petitioners,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should attempt to generate a entry of appearance using a newly created list of named filers', async () => {
    generateEntryOfAppearancePdfInteractor(applicationContext, {
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      filers: [],
      petitioners: [],
    });

    expect(
      applicationContext.getDocumentGenerators().entryOfAppearance.mock
        .calls[0][0].data,
    ).toEqual({
      caseCaptionExtension,
      caseTitle,
      docketNumberWithSuffix,
      filers: [
        //TODO: populate this
      ],
      practitionerInformation: MOCK_PRACTITIONER,
    });
  });
});
