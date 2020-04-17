import { navigateToFirstResultCaseDetailAction } from './navigateToFirstResultCaseDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('navigateToFirstResultCaseDetailAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to case detail url for the provided docket number', async () => {
    const mockArgs = {
      modules: {
        presenter,
      },
      props: {
        searchResults: [
          {
            docketNumber: 1234,
          },
        ],
      },
    };

    await runAction(navigateToFirstResultCaseDetailAction, mockArgs);

    expect(routeStub).toHaveBeenCalled();
    expect(routeStub.mock.calls[0][0]).toEqual(
      `/case-detail/${mockArgs.props.searchResults[0].docketNumber}`,
    );
  });
});
