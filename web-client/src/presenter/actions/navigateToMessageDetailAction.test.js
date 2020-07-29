import { navigateToMessageDetailAction } from './navigateToMessageDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToMessageDetailAction', () => {
  let routeStub;
  const DOCKET_NUMBER = '123-45';
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
        caseDetail: { docketNumber: DOCKET_NUMBER },
        parentMessageId: PARENT_MESSAGE_ID,
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      `/case-messages/${DOCKET_NUMBER}/message-detail/${PARENT_MESSAGE_ID}`,
    );
  });
});
