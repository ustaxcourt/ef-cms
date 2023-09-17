import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPractitionerDocumentsAction } from './getPractitionerDocumentsAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPractitionerDocumentsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getPractitionerDocumentsInteractor.mockResolvedValue([]);
  });

  it('should return the expected practitionerDocuments that have been mocked in the useCase', async () => {
    const result = await runAction(getPractitionerDocumentsAction, {
      modules: {
        presenter,
      },
      state: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
      },
    });

    expect(result.output).toEqual({
      practitionerDocuments: [],
    });
  });
});
