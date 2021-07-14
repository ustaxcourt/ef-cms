import { CerebralTest } from 'cerebral/test';
import { NotFoundError } from '../errors/NotFoundError';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { submitCaseSearchSequence } from '../sequences/submitCaseSearchSequence';

describe('submitCaseSearchSequence', () => {
  let cerebralTest;
  let routeStub;
  beforeAll(() => {
    presenter.providers.props = { docketNumber: () => '111-19' };

    presenter.providers.router = {
      route: route => routeStub(route),
    };
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      submitCaseSearchSequence,
    };
    cerebralTest = CerebralTest(presenter);
    cerebralTest.setState('searchTerm', '111-19');
  });
  beforeAll(() => {
    routeStub = jest.fn().mockReturnValue({});
  });

  it('navigates to found case', async () => {
    await cerebralTest.runSequence('submitCaseSearchSequence', {
      searchTerm: '111-19',
    });
    expect(routeStub).toBeCalled();
    expect(routeStub.mock.calls[0][0]).toContain('/case-detail');
  });

  it('does not navigate AND sets error state if endpoint throws NotFoundError', async () => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockImplementation(() => {
        return Promise.reject(
          new NotFoundError({ message: "404 Can't find it" }),
        );
      });

    await cerebralTest.runSequence('submitCaseSearchSequence', {
      searchTerm: '111-19',
    });
    expect(routeStub).toBeCalled();
    expect(routeStub.mock.calls[0][0]).toContain('/search/no-matches');
  });
});
