import { navigateToMessageDetailAction } from './navigateToMessageDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToMessageDetailAction', () => {
  let routeStub;
  const CASE_ID = 'fc1b424c-885f-450d-baee-b1965fd67149';
  const PARENT_MESSAGE_ID = '14ccdbd2-896a-4a28-a603-b8b3030c84f7';

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to message detail page with parent message id', async () => {
    await runAction(navigateToMessageDetailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: { caseId: CASE_ID },
        parentMessageId: PARENT_MESSAGE_ID,
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      `/case-messages/${CASE_ID}/message-detail/${PARENT_MESSAGE_ID}`,
    );
  });
});
