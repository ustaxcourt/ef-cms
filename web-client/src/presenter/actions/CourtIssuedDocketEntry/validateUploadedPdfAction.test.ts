import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadedPdfAction } from './validateUploadedPdfAction';

describe('validateUploadedPdfAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to determine if virus scanning is enabled', async () => {
    await runAction(validateUploadedPdfAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getUseCases().getStatusOfVirusScanInteractor,
    ).toHaveBeenCalled();
  });

  it('should make a call to validate the pdf using the docketEntryId from props', async () => {
    const mockDocketEntryId = '5f354717-f7cc-4817-9575-452b04b2ef09';

    await runAction(validateUploadedPdfAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
      },
    });

    expect(
      applicationContext.getUseCases().validatePdfInteractor.mock.calls[0][1],
    ).toEqual({
      key: mockDocketEntryId,
    });
  });
});
