import { hasPractitionerDetailAction } from './hasPractitionerDetailAction';
import { runAction } from 'cerebral/test';

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

    expect(presenter.providers.path.success.mock.calls.length).toEqual(1);
  });
});
