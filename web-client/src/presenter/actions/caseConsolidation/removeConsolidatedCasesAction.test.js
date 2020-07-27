import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeConsolidatedCasesAction } from './removeConsolidatedCasesAction';
import { runAction } from 'cerebral/test';

describe('removeConsolidatedCasesAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call remove consolidated cases interactor with the docketNumber and case IDs to remove', async () => {
    await runAction(removeConsolidatedCasesAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { docketNumber: '101-20' },
        modal: { casesToRemove: { abc: true, def: false } },
      },
    });

    expect(
      applicationContext.getUseCases().removeConsolidatedCasesInteractor,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      caseIdsToRemove: ['abc'],
      docketNumber: '101-20',
    });
  });
});
