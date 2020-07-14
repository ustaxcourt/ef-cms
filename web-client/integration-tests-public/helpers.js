import { CerebralTest } from 'cerebral/test';
import { applicationContextPublic as applicationContext } from '../src/applicationContextPublic';
import { getFakeFile } from '../../shared/src/business/test/createTestApplicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter-public';
import { withAppContextDecorator } from '../src/withAppContext';

export const fakeFile = getFakeFile();

export const setupTest = ({ useCases = {} } = {}) => {
  let test;

  presenter.providers.applicationContext = applicationContext;
  const originalUseCases = applicationContext.getUseCases();
  presenter.providers.applicationContext.getUseCases = () => {
    return {
      ...originalUseCases,
      ...useCases,
    };
  };

  presenter.providers.router = {
    createObjectURL: () => {
      return 'abc';
    },
    externalRoute: url => {
      test.currentRouteUrl = url;
    },
    revokeObjectURL: () => {},
    route: async url => {
      test.currentRouteUrl = url;
      switch (url) {
        case `/case-detail/${test.docketNumber}`:
          await test.runSequence('gotoPublicCaseDetailSequence', {
            docketNumber: test.docketNumber,
          });
          break;
        default:
          break;
      }
    },
  };

  presenter.state = mapValues(presenter.state, value => {
    if (isFunction(value)) {
      return withAppContextDecorator(value, applicationContext);
    }
    return value;
  });

  test = CerebralTest(presenter);

  test.currentRouteUrl = null;

  return test;
};
