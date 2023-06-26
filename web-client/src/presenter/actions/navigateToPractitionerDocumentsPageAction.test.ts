import { navigateToPractitionerDocumentsPageAction } from './navigateToPractitionerDocumentsPageAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToPractitionerDocumentsPageAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to the practitioner documents page', async () => {
    await runAction(navigateToPractitionerDocumentsPageAction, {
      modules: {
        presenter,
      },
      state: {
        practitionerDetail: {
          barNumber: 'PT314',
        },
      },
    });

    expect(routeStub).toHaveBeenCalledWith(
      '/practitioner-detail/PT314?tab=practitioner-documentation',
    );
  });
});
