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
test.setState('form.searchError', 'BLAH');

describe('submitCaseSearchSequence', () => {
  beforeEach(() => {
    routeStub = sinon.stub().returns({});
  });

  it('navigates to found case', async () => {
    await test.runSequence('submitCaseSearchSequence', {
      searchTerm: '111-19',
    });
    expect(test.getState('form.searchError')).not.toBeTruthy();
    expect(routeStub.called).toBeTruthy();
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
    expect(routeStub.called).toBeFalsy();
    expect(test.getState('form.searchError')).toBeTruthy();
  });

  it('rethrows errors that are not NotFoundError instances', async () => {
    getCaseInteractor = async () => {
      return Promise.reject(
        new InvalidRequestError('something else went wrong'),
      );
    };
    await expect(
      test.runSequence('submitCaseSearchSequence', {
        searchTerm: '000-00',
      }),
    ).rejects.toThrow(InvalidRequestError);
    expect(routeStub.called).toBeFalsy();
  });
});
