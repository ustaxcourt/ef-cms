import { navigateToDocumentDetailAction } from './navigateToDocumentDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToDocumentDetailAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to document detail url when given docketNumber and documentId', async () => {
    await runAction(navigateToDocumentDetailAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-19',
        documentId: '123',
      },
    });

    expect(routeStub.mock.calls.length).toEqual(1);
  });

  it('does not navigate to document detail url when there is no docketNumber and documentId', async () => {
    await runAction(navigateToDocumentDetailAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).not.toBeCalled();
  });
});
