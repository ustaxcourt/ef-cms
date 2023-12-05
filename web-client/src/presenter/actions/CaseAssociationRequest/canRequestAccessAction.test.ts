import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { canRequestAccessAction } from './canRequestAccessAction';
import { presenter } from '../../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('canRequestAccessAction', () => {
  const { USER_ROLES } = applicationContext.getConstants();
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      proceed: jest.fn(),
      unauthorized: jest.fn(),
    };

    (applicationContext.getCurrentUser as jest.Mock).mockReturnValue({
      role: USER_ROLES.irsPractitioner,
    });
  });

  it('should call path.proceed if props.isAssociated is false or undefined', async () => {
    await runAction(canRequestAccessAction, {
      modules: {
        presenter,
      },
      props: { isDirectlyAssociated: false },
      state: { caseDetail: { docketNumber: '123-45' } },
    });

    expect(presenter.providers.path.proceed).toHaveBeenCalled();
  });

  it('should set isRequestingAccess to true when user is an unassociated practitioner', async () => {
    const isRequestingAccess = true;

    await runAction(canRequestAccessAction, {
      modules: {
        presenter,
      },
      props: { isDirectlyAssociated: false },
      state: { caseDetail: { docketNumber: '123-45' } },
    });

    expect(presenter.providers.path.proceed).toHaveBeenCalledWith({
      isRequestingAccess,
    });
  });

  it('should call the unauthorized path with a docketNumber if props.isAssociated is truthy', async () => {
    await runAction(canRequestAccessAction, {
      modules: {
        presenter,
      },
      props: { isDirectlyAssociated: 'yep' },
      state: { caseDetail: { docketNumber: '123-45' } },
    });

    expect(presenter.providers.path.unauthorized).toHaveBeenCalled();
    expect(
      presenter.providers.path.unauthorized.mock.calls[0][0],
    ).toMatchObject({
      docketNumber: '123-45',
    });
  });
});
