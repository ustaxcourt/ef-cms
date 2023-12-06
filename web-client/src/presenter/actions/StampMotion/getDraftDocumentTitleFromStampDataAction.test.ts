import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDraftDocumentTitleFromStampDataAction } from './getDraftDocumentTitleFromStampDataAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDraftDocumentTitleFromStampDataAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call setDocumentTitleFromStampDataInteractor with form', async () => {
    const mockStampMotionForm = {
      disposition: 'fake disposition',
    };

    const mockFormattedTitle = 'some formatted title';
    applicationContext
      .getUseCases()
      .setDocumentTitleFromStampDataInteractor.mockReturnValue(
        mockFormattedTitle,
      );

    const result = await runAction(getDraftDocumentTitleFromStampDataAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockStampMotionForm,
      },
    });

    expect(
      applicationContext.getUseCases().setDocumentTitleFromStampDataInteractor,
    ).toHaveBeenCalledWith({ stampMotionForm: mockStampMotionForm });
    expect(result.output.formattedDraftDocumentTitle).toEqual(
      mockFormattedTitle,
    );
  });
});
