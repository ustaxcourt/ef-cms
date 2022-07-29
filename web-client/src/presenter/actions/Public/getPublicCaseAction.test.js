import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPublicCaseAction } from './getPublicCaseAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('getPublicCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the public case information', async () => {
    await runAction(getPublicCaseAction, {
      modules: {
        presenter,
      },
      props: {
        docketNumber: '123-20',
      },
    });

    expect(applicationContext.getUseCases().getCaseInteractor).toBeCalled();
  });
});
