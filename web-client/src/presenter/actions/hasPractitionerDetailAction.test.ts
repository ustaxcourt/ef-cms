import { hasPractitionerDetailAction } from './hasPractitionerDetailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('hasPractitionerDetailAction', () => {
  let presenter;

  beforeAll(() => {
    presenter = {
      providers: {
        path: {
          noResults: jest.fn(),
          success: jest.fn(),
        },
      },
    };
  });

  it('calls the success function when a (non-empty) practitionerDetail object exists on props', async () => {
    await runAction(hasPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
      },
    });

    expect(presenter.providers.path.success).toHaveBeenCalled();
  });
  it('calls the noResults function when no practitionerDetail object exists on props', async () => {
    await runAction(hasPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(presenter.providers.path.noResults).toHaveBeenCalled();
  });
});
