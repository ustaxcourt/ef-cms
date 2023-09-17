import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { openPractitionerDocumentDownloadUrlAction } from './openPractitionerDocumentDownloadUrlAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('openPractitionerDocumentDownloadUrlAction', () => {
  const mockBarNumber = 'PT1234';
  const mockFileId = '5e6b3a82-07d3-44a3-935d-9cad2d97b998';
  const mockDownloadUrl = 'www.example.com';

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor.mockReturnValue({
        url: mockDownloadUrl,
      });
  });

  it('should make a call to retrieve the practitioner document download url', async () => {
    await runAction(openPractitionerDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        barNumber: mockBarNumber,
        practitionerDocumentFileId: mockFileId,
      },
    });

    expect(
      applicationContext.getUseCases()
        .getPractitionerDocumentDownloadUrlInteractor.mock.calls[0][1],
    ).toMatchObject({
      barNumber: mockBarNumber,
      practitionerDocumentFileId: mockFileId,
    });
  });

  it('should the practitioner document in a new tab', async () => {
    await runAction(openPractitionerDocumentDownloadUrlAction, {
      modules: { presenter },
      props: {
        barNumber: mockBarNumber,
        practitionerDocumentFileId: mockFileId,
      },
    });

    expect(
      applicationContext.getUtilities().openUrlInNewTab,
    ).toHaveBeenCalledWith({ url: mockDownloadUrl });
  });

  it('should re-throw a formatted error when an error occurs while attempting to open the practitioner document', async () => {
    const mockError = 'ERROR';
    applicationContext.getUtilities().openUrlInNewTab.mockImplementation(() => {
      throw new Error(mockError);
    });

    await expect(
      runAction(openPractitionerDocumentDownloadUrlAction, {
        modules: { presenter },
        props: {
          barNumber: mockBarNumber,
          practitionerDocumentFileId: mockFileId,
        },
      }),
    ).rejects.toThrow(`Unable to open document. ${mockError}`);
  });
});
