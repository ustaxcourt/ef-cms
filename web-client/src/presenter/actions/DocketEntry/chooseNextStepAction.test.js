import { chooseNextStepAction } from './chooseNextStepAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('chooseNextStepAction', () => {
  let addAnotherEntryStub;
  let caseDetailStub;

  beforeAll(() => {
    addAnotherEntryStub = jest.fn();
    caseDetailStub = jest.fn();

    presenter.providers.path = {
      addAnotherEntry: addAnotherEntryStub,
      caseDetail: caseDetailStub,
    };
  });

  it('chooses the next step as supporting document if it exists', async () => {
    await runAction(chooseNextStepAction, {
      modules: {
        presenter,
      },
      props: {
        isAddAnother: true,
      },
    });

    expect(addAnotherEntryStub).toHaveBeenCalled();
  });

  it('does not choose the next step as supporting document if it does not exist', async () => {
    await runAction(chooseNextStepAction, {
      modules: {
        presenter,
      },
    });

    expect(caseDetailStub).toHaveBeenCalled();
  });
});
