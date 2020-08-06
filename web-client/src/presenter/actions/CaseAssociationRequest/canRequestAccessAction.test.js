import { canRequestAccessAction } from './canRequestAccessAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('canRequestAccessAction', () => {
  beforeAll(() => {
    presenter.providers.path = {
      proceed: jest.fn(),
      unauthorized: jest.fn(),
    };
  });

  it('should call path.proceed if props.isAssociated is false or undefined', async () => {
    await runAction(canRequestAccessAction, {
      modules: {
        presenter,
      },
      props: { isAssociated: false },
      state: { caseDetail: { docketNumber: '123-45' } },
    });

    expect(presenter.providers.path.proceed).toBeCalled();
  });

  it('should call the unauthorized path with a docketNumber if props.isAssociated is truthy', async () => {
    await runAction(canRequestAccessAction, {
      modules: {
        presenter,
      },
      props: { isAssociated: 'yep' },
      state: { caseDetail: { docketNumber: '123-45' } },
    });

    expect(presenter.providers.path.unauthorized).toBeCalled();
    expect(
      presenter.providers.path.unauthorized.mock.calls[0][0],
    ).toMatchObject({
      docketNumber: '123-45',
    });
  });
});
