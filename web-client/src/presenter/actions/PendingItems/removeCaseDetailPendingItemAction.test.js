import { presenter } from '../../presenter';
import { removeCaseDetailPendingItemAction } from './removeCaseDetailPendingItemAction';
import { runAction } from 'cerebral/test';

describe('removeCaseDetailPendingItemAction', () => {
  let applicationContext;
  const removeCasePendingItemInteractorSpy = jest.fn();

  beforeEach(() => {
    applicationContext = {
      getUseCases: () => ({
        removeCasePendingItemInteractor: removeCasePendingItemInteractorSpy,
      }),
    };
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

    expect(removeCasePendingItemInteractorSpy.mock.calls[0][0]).toMatchObject({
      caseId: '23456',
      documentId: '123abc',
    });
  });
});
