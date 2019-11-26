import { CerebralTest } from 'cerebral/test';
import { applicationContextPublic as applicationContext } from '../src/applicationContextPublic';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter-public';
import { withAppContextDecorator } from '../src/withAppContext';

exports.setupTest = ({ useCases = {} } = {}) => {
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
    externalRoute: url => {
      test.currentRouteUrl = url;
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
