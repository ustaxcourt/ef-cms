import { getRoutes } from './routes';
import route from 'riot-route';

route.base('/');

const externalRoute = path => {
  window.location.replace(path);
};

const openInNewTab = (path, noopener = true) => {
  const windowFeatures = (noopener && 'noopener, noreferrer') || '';
  window.open(path, '_blank', windowFeatures);
};

const createObjectURL = object => {
  return window.URL.createObjectURL(object);
};

const revokeObjectURL = url => {
  return window.URL.revokeObjectURL(url);
};

const back = () => {
  window.history.back();
};

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    const { ROLE_PERMISSIONS } = app.getState('constants');

    const ifHasAccess = (cb, permissionToCheck) => {
      return function () {
        const gotoLoginPage = () => {
          const path = app.getState('cognitoLoginUrl');
          externalRoute(path);
        };
        const goto404 = () => {
          app.getSequence('navigateToPathSequence')({
            path: '404',
          });
        };

        if (!app.getState('user')) {
          gotoLoginPage();
        } else {
          if (
            permissionToCheck &&
            !app.getState('permissions')[permissionToCheck]
          ) {
            goto404();
          } else {
            app.getSequence('clearAlertSequence')();
            cb.apply(null, arguments);
          }
        }
      };
    };

    const routes = getRoutes({
      ROLE_PERMISSIONS,
      app,
      ifHasAccess,
      route,
    });

    Object.keys(routes).forEach(path => {
      const routeFunc = routes[path];
      route(path, routeFunc, path === '..' ? true : null); // TODO: fix this bool
    });

    route.start(true);
  },
};

export {
  back,
  createObjectURL,
  externalRoute,
  openInNewTab,
  revokeObjectURL,
  route,
  router,
};
