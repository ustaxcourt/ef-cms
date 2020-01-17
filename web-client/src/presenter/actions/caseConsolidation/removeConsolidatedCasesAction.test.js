import { presenter } from '../../presenter';
import { removeConsolidatedCasesAction } from './removeConsolidatedCasesAction';
import { runAction } from 'cerebral/test';

const removeInteractorStub = jest.fn();
presenter.providers.applicationContext = {
  getUseCases: () => ({
    removeConsolidatedCasesInteractor: removeInteractorStub,
  }),
};

describe('removeConsolidatedCasesAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call remove consolidated cases interactor with the caseId and case IDs to remove', async () => {
    await runAction(removeConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: 'abc123-abc123abc123-abc123abc123-abc123abc123' },
        modal: { casesToRemove: { abc: true, def: false } },
      },
    });

    expect(removeInteractorStub).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseId: 'abc123-abc123abc123-abc123abc123-abc123abc123',
      caseIdsToRemove: ['abc'],
    });
  });
});
