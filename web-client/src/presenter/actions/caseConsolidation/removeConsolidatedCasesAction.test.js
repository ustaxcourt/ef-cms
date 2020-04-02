import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeConsolidatedCasesAction } from './removeConsolidatedCasesAction';
import { runAction } from 'cerebral/test';

describe('removeConsolidatedCasesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
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

    expect(
      applicationContext.getUseCases().removeConsolidatedCasesInteractor,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseId: 'abc123-abc123abc123-abc123abc123-abc123abc123',
      caseIdsToRemove: ['abc'],
    });
  });
});
