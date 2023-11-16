import {
  MOCK_PRACTITIONER,
  irsPractitionerUser,
  petitionerUser,
  privatePractitionerUser,
  validUser,
} from '@shared/test/mockUsers';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateEntryOfAppearancePdfInteractor } from './generateEntryOfAppearancePdfInteractor';

describe('generateEntryOfAppearancePdfInteractor', () => {
  const mockFile = {
    name: 'mockfile.pdf',
  };
  const mockPdfUrl = 'www.example.com';
  const caseCaptionExtension =
    'Bert & Ernie, Petitioners v. Commissioner of Internal Revenue, Respondent';
  const caseTitle = 'Bert & Ernie';
  const docketNumberWithSuffix = '123-45S';

  const filers = [petitionerUser.userId, validUser.userId];
  const petitioners = [
    { contactId: petitionerUser.userId, name: petitionerUser.name },
    { contactId: validUser.userId, name: validUser.name },
  ];

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(MOCK_PRACTITIONER);
    applicationContext
      .getDocumentGenerators()
      .entryOfAppearance.mockReturnValue(mockFile);
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);
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

  it('should generate a entry of appearance using a newly created list of named filers and return a link to the document in s3', async () => {
    const expectedFilerNames = [petitionerUser.name, validUser.name];
    const result = await generateEntryOfAppearancePdfInteractor(
      applicationContext,
      {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers,
        petitioners,
      },
    );

    expect(
      applicationContext.getDocumentGenerators().entryOfAppearance,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          filers: expectedFilerNames,
          practitionerInformation: MOCK_PRACTITIONER,
        },
      }),
    );
    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        file: mockFile,
        urlTtl: 60 * 60 * 24,
        useTempBucket: true,
      }),
    );
    expect(result).toEqual(mockPdfUrl);
  });

  it('should use Respondent as the filer name when an IRS practitioner is filing an entry of appearance', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce(irsPractitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce(irsPractitionerUser);

    const expectedFilerNames = ['Respondent'];
    const result = await generateEntryOfAppearancePdfInteractor(
      applicationContext,
      {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers,
        petitioners,
      },
    );

    expect(
      applicationContext.getDocumentGenerators().entryOfAppearance,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          filers: expectedFilerNames,
          practitionerInformation: irsPractitionerUser,
        },
      }),
    );
    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ file: mockFile, useTempBucket: true }),
    );
    expect(result).toEqual(mockPdfUrl);
  });
});
