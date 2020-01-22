import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updatePetitionerInformationAction } from './updatePetitionerInformationAction';

const updatePetitionerInformationInteractorStub = jest.fn().mockReturnValue({
  paperServiceParties: { paper: [{ name: 'abc' }] },
  paperServicePdfUrl: 'www.example.com',
  updatedCase: { caseId: '123', docketNumber: 'ayy' },
});

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updatePetitionerInformationInteractor: updatePetitionerInformationInteractorStub,
  }),
};

describe('updatePetitionerInformationAction', () => {
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

    expect(updatePetitionerInformationInteractorStub).toHaveBeenCalled();
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
