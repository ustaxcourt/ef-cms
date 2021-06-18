const {
  ROLE_PERMISSIONS,
} = require('../../shared/src/authorization/authorizationClientService');
const { ifHasAccess, route, router } = require('./router');

describe('router', () => {
  const getUserMock = jest.fn();
  const getPermissionsMock = jest.fn().mockReturnValue({ foo: true });
  const sequenceMock = jest.fn().mockReturnValue('Yay');
  const getSequenceMock = jest.fn().mockReturnValue(sequenceMock);
  const callbackFn = jest.fn();
  const redirect = { goto404: jest.fn(), gotoLoginPage: jest.fn() };
  const stateMock = jest.fn();

  const appMock = {
    getSequence: getSequenceMock,
    getState: statePath => {
      switch (statePath) {
        case 'constants':
          return { ROLE_PERMISSIONS };
        case 'user':
          return getUserMock();
        case 'permissions':
          return getPermissionsMock();
        default:
          return stateMock();
      }
    },
  };

  describe('ifHasAccess function generator', () => {
    it('redirects to login page if user is not defined', () => {
      getUserMock.mockReturnValue(undefined);
      ifHasAccess({ app: appMock, redirect }, callbackFn)();
      expect(redirect.goto404).not.toHaveBeenCalled();
      expect(callbackFn).not.toHaveBeenCalled();
      expect(redirect.gotoLoginPage).toHaveBeenCalled();
    });

    it('redirects to 404 if user does not have the correct permissions', () => {
      getUserMock.mockReturnValue({ username: 'Karl Childers' });
      stateMock.mockReturnValue({ permissions: undefined });
      ifHasAccess(
        {
          app: appMock,
          permissionToCheck: ROLE_PERMISSIONS.ADVANCED_SEARCH,
          redirect,
        },
        callbackFn,
      )();
      expect(redirect.gotoLoginPage).not.toHaveBeenCalled();
      expect(callbackFn).not.toHaveBeenCalled();
      expect(redirect.goto404).toHaveBeenCalled();
    });

    it('runs the callback function argument if user has correct permissions', () => {
      getPermissionsMock.mockReturnValue({
        [ROLE_PERMISSIONS.ADVANCED_SEARCH]: true,
      });

      ifHasAccess(
        {
          app: appMock,
          permissionToCheck: ROLE_PERMISSIONS.ADVANCED_SEARCH,
          redirect,
        },
        callbackFn,
      )();
      expect(redirect.gotoLoginPage).not.toHaveBeenCalled();
      expect(redirect.goto404).not.toHaveBeenCalled();
      expect(callbackFn).toHaveBeenCalled();
    });
  });

  describe('router function', () => {
    beforeAll(() => {
      getUserMock.mockReturnValue({ user: 'Samwise Gamgee' });
      router.initialize(appMock, route); // fires default route of "/"
    });

    it('attaches a function __cy_route to the window object and fires the default route of "/"', () => {
      // eslint-disable-next-line no-underscore-dangle
      expect(window.__cy_route).toBeDefined();
      expect(window.location.pathname).toBe('/');
      expect(window.document.title).toEqual(expect.stringMatching('Dashboard'));
    });

    describe('fires only upon change of location', () => {
      it('does not fire for "/" because that is already the window location', () => {
        expect(window.location.pathname).toBe('/'); // the default route
        route('/');
        expect(window.document.title).toEqual(
          expect.stringMatching('Dashboard'),
        );
        expect(getSequenceMock).not.toHaveBeenCalled();
      });

      it('tries to navigate to /does-not-exist', () => {
        route('/does-not-exist');
        expect(window.document.title).toEqual(expect.stringMatching('Error'));
        expect(getSequenceMock).toBeCalledWith('notFoundErrorSequence');
      });

      it('successfully navigates to / if that is not the current url', () => {
        expect(window.location.pathname).not.toBe('/');
        route('/');
        expect(window.document.title).toEqual(
          expect.stringMatching('Dashboard'),
        );
        expect(getSequenceMock).toBeCalledWith('gotoDashboardSequence');
      });
    });

    it('/case-detail/*', () => {
      route('/case-detail/123-45');
      expect(window.document.title).toEqual(
        expect.stringMatching('Docket 123-45'),
      );
      expect(getSequenceMock).toBeCalledWith('gotoCaseDetailSequence');
      expect(sequenceMock).toBeCalledWith({ docketNumber: '123-45' });
    });

    it('/case-detail/*?openModal=*', () => {
      route('/case-detail/123-45?openModal=MyModal');
      expect(window.document.title).toEqual(
        expect.stringMatching('Docket 123-45'),
      );
      expect(getSequenceMock).toBeCalledWith('gotoCaseDetailSequence');
      expect(sequenceMock).toBeCalledWith({
        docketNumber: '123-45',
        openModal: 'MyModal',
      });
    });

    it('/case-detail/*/documents/*/add-court-issued-docket-entry/*', () => {
      const docketNumber = '111-44';
      const docketEntryId = '000-001';
      const parentMessageId = '222-555';

      route(
        `/case-detail/${docketNumber}/documents/${docketEntryId}/add-court-issued-docket-entry/${parentMessageId}`,
      );
      expect(window.document.title).toEqual(
        expect.stringMatching('Add docket entry'),
      );
      expect(getSequenceMock).toBeCalledWith(
        'gotoAddCourtIssuedDocketEntrySequence',
      );
      expect(sequenceMock).toBeCalledWith({
        docketEntryId,
        docketNumber,
        redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${docketEntryId}`,
      });
    });
  });
});
