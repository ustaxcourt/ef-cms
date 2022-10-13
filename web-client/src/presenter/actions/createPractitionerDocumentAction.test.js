import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createPractitionerDocumentAction } from './createPractitionerDocumentAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createPractitionerDocumentAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should try to upload the file on state to s3', async () => {
    applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor.mockResolvedValue('123');

    applicationContext
      .getUseCases()
      .createPractitionerDocumentInteractor.mockResolvedValue(null);

    await runAction(createPractitionerDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          categoryName: 'Application',
          categoryType: 'Application',
          practitionerDocumentFile: {
            name: 'testing.pdf',
          },
        },
        practitionerDetail: {
          barNumber: 'PT1234',
        },
      },
    });

    expect(
      applicationContext.getUseCases().createPractitionerDocumentInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      barNumber: 'PT1234',
      documentMetadata: expect.objectContaining({
        categoryName: 'Application',
        categoryType: 'Application',
        fileName: 'testing.pdf',
        practitionerDocumentFileId: '123',
      }),
    });
  });
});
