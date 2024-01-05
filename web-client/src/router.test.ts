import { ROLE_PERMISSIONS } from '@shared/authorization/authorizationClientService';
import { route, router } from '@web-client/router';

describe('router', () => {
  const getUserMock = jest.fn();
  const getMaintenanceModeMock = jest.fn();
  const getPermissionsMock = jest.fn().mockReturnValue({ foo: true });
  const sequenceMock = jest.fn().mockReturnValue('Yay');
  const getSequenceMock = jest.fn().mockReturnValue(sequenceMock);
  const stateMock = jest.fn();

  const appMock = {
    getSequence: getSequenceMock,
    getState: statePath => {
      switch (statePath) {
        case 'constants':
          return { ROLE_PERMISSIONS };
        case 'user':
          return getUserMock();
        case 'token':
          return getUserMock();
        case 'permissions':
          return getPermissionsMock();
        case 'maintenanceMode':
          return getMaintenanceModeMock();
        default:
          return stateMock();
      }
    },
  };

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
        expect(getSequenceMock).toHaveBeenCalledWith('notFoundErrorSequence');
      });

      it('successfully navigates to / if that is not the current url', () => {
        expect(window.location.pathname).not.toBe('/');
        route('/');
        expect(window.document.title).toEqual(
          expect.stringMatching('Dashboard'),
        );
        expect(getSequenceMock).toHaveBeenCalledWith('gotoDashboardSequence');
      });
    });

    it('/case-detail/*', () => {
      route('/case-detail/123-45');
      expect(window.document.title).toEqual(
        expect.stringMatching('Docket 123-45'),
      );
      expect(getSequenceMock).toHaveBeenCalledWith('gotoCaseDetailSequence');
      expect(sequenceMock).toHaveBeenCalledWith({ docketNumber: '123-45' });
    });

    it('/case-detail/*?openModal=*', () => {
      route('/case-detail/123-45?openModal=MyModal');
      expect(window.document.title).toEqual(
        expect.stringMatching('Docket 123-45'),
      );
      expect(getSequenceMock).toHaveBeenCalledWith('gotoCaseDetailSequence');
      expect(sequenceMock).toHaveBeenCalledWith({
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
      expect(getSequenceMock).toHaveBeenCalledWith(
        'gotoAddCourtIssuedDocketEntrySequence',
      );
      expect(sequenceMock).toHaveBeenCalledWith({
        docketEntryId,
        docketNumber,
        redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${docketEntryId}`,
      });
    });
  });
});
