import { getShouldRedirectToFilePetitionSuccessAction } from './getShouldRedirectToFilePetitionSuccessAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getShouldRedirectToFilePetitionSuccessAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeEach(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return yes when the current page is StartCaseWizard, the user is on the last step of the wizard, and the case has a docket number', async () => {
    await runAction(getShouldRedirectToFilePetitionSuccessAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '1234-54',
        },
        currentPage: 'StartCaseWizard',
        form: {
          wizardStep: '5',
        },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('should return no when the current page is Dashboard', async () => {
    await runAction(getShouldRedirectToFilePetitionSuccessAction, {
      modules: {
        presenter,
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
