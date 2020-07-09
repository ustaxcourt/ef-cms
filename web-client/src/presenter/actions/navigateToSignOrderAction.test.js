import { navigateToSignOrderAction } from './navigateToSignOrderAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToSignOrderAction', () => {
  let routeStub;
  const CASE_ID = 'fc1b424c-885f-450d-baee-b1965fd67149';
  const DOCUMENT_ID = 'e1c27a56-721e-4f46-a1e8-7b83842e9f21';
  const PARENT_MESSAGE_ID = '14ccdbd2-896a-4a28-a603-b8b3030c84f7';

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to sign order page without a message id', async () => {
    await runAction(navigateToSignOrderAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: CASE_ID,
        documentId: DOCUMENT_ID,
      },
      state: { form: {} },
    });

    expect(routeStub).toHaveBeenCalledWith(
      `/case-detail/${CASE_ID}/edit-order/${DOCUMENT_ID}/sign`,
    );
  });

  it('navigates to sign order page with a message id', async () => {
    await runAction(navigateToSignOrderAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: CASE_ID,
        documentId: DOCUMENT_ID,
      },
      state: {
        parentMessageId: PARENT_MESSAGE_ID,
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      `/case-detail/${CASE_ID}/edit-order/${DOCUMENT_ID}/sign/${PARENT_MESSAGE_ID}`,
    );
  });
});
