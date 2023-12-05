import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { deletePractitionerDocumentAction } from './deletePractitionerDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const successMock = jest.fn();
const errorMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

const practitionerDocumentFileId = '06732037-67bf-4f15-b452-deb78be78f90';
const barNumber = 'AZ4321';

describe('deletePractitionerDocumentAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('goes to success path if practitioner document is deleted', async () => {
    await runAction(deletePractitionerDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          barNumber,
          practitionerDocumentFileId,
        },
      },
    });
    expect(
      applicationContext.getUseCases().deletePractitionerDocumentInteractor.mock
        .calls[0][0],
    ).toMatchObject(applicationContext, {
      barNumber,
      practitionerDocumentFileId,
    });
    expect(successMock).toHaveBeenCalled();
  });

  it('goes to error path if error', async () => {
    applicationContext.getUseCases().deletePractitionerDocumentInteractor = jest
      .fn()
      .mockRejectedValueOnce(new Error('bad'));

    await runAction(deletePractitionerDocumentAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          barNumber,
          practitionerDocumentFileId,
        },
      },
    });

    expect(errorMock).toHaveBeenCalled();
  });
});
