import { CerebralTest } from 'cerebral/test';
import { NotFoundError } from '../errors/NotFoundError';
import { presenter } from '../presenter';

let test;
let getCaseInteractor = async () => true;

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCaseInteractor,
  }),
};
presenter.providers.props = { caseId: () => '111-19' };

let routeStub;
presenter.providers.router = {
  route: async route => routeStub(route),
};

test = CerebralTest(presenter);
test.setState('searchTerm', '111-19');

describe('submitCaseSearchSequence', () => {
  beforeEach(() => {
    routeStub = jest.fn().mockReturnValue({});
  });

  it('navigates to found case', async () => {
    await test.runSequence('submitCaseSearchSequence', {
      searchTerm: '111-19',
    });
    expect(routeStub).toBeCalled();
    expect(routeStub.mock.calls[0][0]).toContain('/case-detail');
  });

  it('does not navigate AND sets error state if endpoint throws NotFoundError', async () => {
    getCaseInteractor = () => {
      return Promise.reject(
        new NotFoundError({ message: "404 Can't find it" }),
      );
    };

    await test.runSequence('submitCaseSearchSequence', {
      searchTerm: '111-19',
    });
    expect(routeStub).toBeCalled();
    expect(routeStub.mock.calls[0][0]).toContain('/search/no-matches');
  });
});
