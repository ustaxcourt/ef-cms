import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updatePetitionerInformationAction } from './updatePetitionerInformationAction';

describe('updatePetitionerInformationAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updatePetitionerInformationInteractor.mockReturnValue({
        paperServiceParties: { paper: [{ name: 'abc' }] },
        paperServicePdfUrl: 'www.example.com',
        updatedCase: { caseId: '123', docketNumber: 'ayy' },
      });
  });

  it('updates primary contact for the current case', async () => {
    const result = await runAction(updatePetitionerInformationAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: '123', docketNumber: 'ayy' },
        form: {
          contactPrimary: { name: 'abc' },
        },
      },
    });

    expect(
      applicationContext.getUseCases().updatePetitionerInformationInteractor,
    ).toHaveBeenCalled();

    expect(result.output).toEqual({
      alertSuccess: {
        title: 'Your changes have been saved.',
      },
      caseDetail: { caseId: '123', docketNumber: 'ayy' },
      caseId: 'ayy',
      paperServiceParties: { paper: [{ name: 'abc' }] },
      pdfUrl: 'www.example.com',
      tab: 'caseInfo',
    });
  });
});
