import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updatePetitionerInformationAction } from './updatePetitionerInformationAction';

describe('updatePetitionerInformationAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .updatePetitionerInformationInteractor.mockReturnValue({
        paperServiceParties: { paper: [{ name: 'abc' }] },
        paperServicePdfUrl: 'www.example.com',
        updatedCase: { docketNumber: '123-20' },
      });
  });

  it('updates primary contact for the current case', async () => {
    const result = await runAction(updatePetitionerInformationAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '123-20' },
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
        message: 'Changes saved.',
      },
      caseDetail: { docketNumber: '123-20' },
      docketNumber: '123-20',
    });
  });
});
