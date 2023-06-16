import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setFeatureFlagFactoryAction } from './setFeatureFlagFactoryAction';

describe('setFeatureFlagFactoryAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should set the value of state.featureFlags.<feature_flag_name> to the value in props', async () => {
    const mockFeatureFlagName = 'multi-docketable-paper-filings';

    const { state } = await runAction(
      setFeatureFlagFactoryAction(mockFeatureFlagName),
      {
        modules: {
          presenter,
        },
        props: {
          [mockFeatureFlagName]: true,
        },
      },
    );

    expect(state.featureFlags[mockFeatureFlagName]).toEqual(true);
  });
});
