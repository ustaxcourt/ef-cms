import { CerebralTest } from 'cerebral/test';
import { InvalidRequestError } from '../errors/InvalidRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { presenter } from '../presenter';
import sinon from 'sinon';

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
    routeStub = sinon.stub().returns({});
  });

  it('navigates to found case', async () => {
    await test.runSequence('submitCaseSearchSequence', {
      searchTerm: '111-19',
    });
    expect(routeStub.called).toBeTruthy();
    expect(routeStub.getCall(0).args[0]).toContain('/case-detail');
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
    expect(routeStub.called).toBeTruthy();
    expect(routeStub.getCall(0).args[0]).toContain('/search/no-matches');
  });
});
