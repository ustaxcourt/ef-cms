import { navigateToDocumentDetailAction } from './navigateToDocumentDetailAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('navigateToDocumentDetailAction', () => {
  let routeStub;

  beforeEach(() => {
    routeStub = sinon.stub();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to document detail url when given caseId and documentId', async () => {
    await runAction(navigateToDocumentDetailAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: '123',
        documentId: '123',
      },
    });

    expect(routeStub.calledOnce).toEqual(true);
  });

  it('does not navigate to document detail url when there is no caseId and documentId', async () => {
    await runAction(navigateToDocumentDetailAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub.calledOnce).toEqual(false);
  });
});
