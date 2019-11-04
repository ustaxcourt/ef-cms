import { generateCaseConfirmationPdfAction } from './generateCaseConfirmationPdfAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
describe('generateCaseConfirmationPdfAction', () => {
  let generateCaseConfirmationPdfStub;

  beforeEach(() => {
    generateCaseConfirmationPdfStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        generateCaseConfirmationPdfInteractor: generateCaseConfirmationPdfStub,
      }),
    };
  });

  it('should call generateCaseConfirmationPdf', async () => {
    await runAction(generateCaseConfirmationPdfAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc',
        },
      },
    });

    expect(generateCaseConfirmationPdfStub).toHaveBeenCalled();
  });
});
