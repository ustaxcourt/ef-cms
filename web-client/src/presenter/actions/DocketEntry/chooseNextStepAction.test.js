import { chooseNextStepAction } from './chooseNextStepAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('chooseNextStepAction', () => {
  let supportingDocumentStub;
  let caseDetailStub;

  beforeEach(() => {
    supportingDocumentStub = jest.fn();
    caseDetailStub = jest.fn();

    presenter.providers.path = {
      caseDetail: caseDetailStub,
      supportingDocument: supportingDocumentStub,
    };
  });

  it('chooses the next step as supporting document if it exists', async () => {
    await runAction(chooseNextStepAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          supportingDocument: {},
        },
      },
    });

    expect(supportingDocumentStub).toHaveBeenCalled();
  });

  it('does not choose the next step as supporting document if it does not exist', async () => {
    await runAction(chooseNextStepAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(caseDetailStub).toHaveBeenCalled();
  });
});
