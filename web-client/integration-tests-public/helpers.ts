import { CerebralTest, CerebralTestType } from 'cerebral/test';
import { applicationContextPublic as applicationContext } from '../src/applicationContextPublic';
import { getFakeFile } from '../../shared/src/business/test/getFakeFile';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter-public';
import { withAppContextDecorator } from '../src/withAppContext';

export const fakeFile = getFakeFile();

export const setupTest = ({ useCases = {} } = {}) => {
  const cerebralTest: Omit<CerebralTestType, 'getState'> & {
    getState: Function;
    closeSocket?: Function;
    currentRouteUrl?: string | null;
    docketNumber?: string;
    [key: string]: any;
  } = CerebralTest(presenter);

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

  presenter.state = mapValues(presenter.state, value => {
    if (isFunction(value)) {
      return withAppContextDecorator(value, applicationContext);
    }
    return value;
  });

  cerebralTest.closeSocket = () => {
    /* no-op */
  };

  cerebralTest.currentRouteUrl = null;

  return cerebralTest;
};
