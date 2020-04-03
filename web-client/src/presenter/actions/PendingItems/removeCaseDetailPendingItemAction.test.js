import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeCaseDetailPendingItemAction } from './removeCaseDetailPendingItemAction';
import { runAction } from 'cerebral/test';

describe('removeCaseDetailPendingItemAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the removeCasePendingItemInteractor with the data from props', async () => {
    await runAction(removeCaseDetailPendingItemAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          caseId: '23456',
          documents: [{ documentId: '123abc', pending: true }],
        },
        documentId: '123abc',
      },
    });

    expect(
      applicationContext.getUseCases().removeCasePendingItemInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '23456',
      documentId: '123abc',
    });
  });
});
