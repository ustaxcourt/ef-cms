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
        modal: { casesToRemove: { '123-20': true, '234-20': false } },
      },
    });

    expect(
      applicationContext.getUseCases().removeConsolidatedCasesInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '101-20',
      docketNumbersToRemove: ['123-20'],
    });
  });
});
