import { navigateToCreateOrderAction } from './navigateToCreateOrderAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToCreateOrderAction', () => {
  const docketNumber = '123-20';
  const documentTitle = 'Order for something';
  const documentType = 'Order';
  const eventCode = 'O';
  const parentMessageId = '02bb9dd7-391b-4aa7-9647-489184084e8b';
  const documentId = '02bb9dd7-391b-4aa7-9647-489184084e8b';

  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      openInNewTab: routeStub,
    };
  });

  it('navigates to create order url without a message id', async () => {
    await runAction(navigateToCreateOrderAction, {
      modules: {
        presenter,
      },
      props: { docketNumber },
      state: {
        modal: {
          documentId,
          documentTitle,
          documentType,
          eventCode,
        },
      },
    });

    expect(routeStub).toHaveBeenCalled();
    expect(routeStub.mock.calls[0][0]).toEqual(
      `/case-detail/${docketNumber}/create-order?documentType=${documentType}&documentId=${documentId}&eventCode=${eventCode}`,
    );
  });

  it('navigates to create order url with a message id', async () => {
    await runAction(navigateToCreateOrderAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-20',
      },
      state: {
        modal: {
          documentId,
          documentTitle,
          documentType,
          eventCode,
          parentMessageId,
        },
      },
    });

    expect(routeStub).toHaveBeenCalled();
    expect(routeStub.mock.calls[0][0]).toEqual(
      `/case-detail/${docketNumber}/create-order/${parentMessageId}?documentType=${documentType}&documentId=${documentId}&eventCode=${eventCode}`,
    );
  });
});
