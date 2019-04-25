import { CerebralTest } from 'cerebral/test';
import { NotFoundError } from '../../../../shared/src/errors/errors';
import { presenter } from '../presenter';
import sinon from 'sinon';

let test;
let getCase = async () => true;

presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCase,
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
    expect(test.getState('form.searchError')).not.toBeTruthy();
    expect(routeStub.called).toBeTruthy();
  });

  it('does not navigate if endpoint throws NotFoundError', async () => {
    getCase = async () => {
      return Promise.reject(new NotFoundError('cannot find that'));
    };

    expect(async () => {
      await test.runSequence('submitCaseSearchSequence', {
        searchTerm: '111-19',
      });
    }).not.toThrow();
    expect(routeStub.called).toBeFalsy();
    expect(test.getState('form.searchError')).toBeTruthy();
  });

  it('rethrows errors that are not NotFoundError instances', async () => {
    getCase = async () => {
      throw new Error('something else went wrong');
    };
    expect(async () => {
      await test.runSequence('submitCaseSearchSequence', {
        searchTerm: '111-19',
      });
    }).toThrow();
    expect(routeStub.called).toBeFalsy();
  });
});
