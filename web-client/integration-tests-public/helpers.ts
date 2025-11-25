import { CerebralTest } from 'cerebral/test';
import { applicationContextPublic as applicationContext } from '../src/applicationContextPublic';
import { getFakeFile } from '../../shared/src/business/test/getFakeFile';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter-public';
import { withAppContextDecorator } from '../src/withAppContext';

export const fakeFile = getFakeFile();

export const setupTest = ({ useCases = {} } = {}) => {
  // eslint-disable-next-line prefer-const
  let cerebralTest: any;

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
      cerebralTest.currentRouteUrl = url;
    },
    revokeObjectURL: () => {},
    route: async url => {
      cerebralTest.currentRouteUrl = url;
      switch (url) {
        case `/case-detail/${cerebralTest.docketNumber}`:
          await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
            docketNumber: cerebralTest.docketNumber,
          });
          break;
        case '/create-account/verification-sent':
          await cerebralTest.runSequence('goToVerificationSentSequence');
          break;
        default:
          break;
      }
    },
  };

  // map and decorate functions in presenter.state; cast to any to avoid strict type mismatches in tests
  (presenter.state as any) = mapValues(presenter.state, value => {
    if (isFunction(value)) {
      return withAppContextDecorator(value, applicationContext);
    }
    return value;
  });

  // cast presenter to any for test harness compatibility with CerebralTest
  cerebralTest = CerebralTest(presenter as any);
  cerebralTest.closeSocket = () => {
    /* no-op */
  };
  cerebralTest.currentRouteUrl = null;

  return cerebralTest;
};
