import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerDocumentsAction } from './getPractitionerDocumentsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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
      props: {
        barNumber: 'AA5678',
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
