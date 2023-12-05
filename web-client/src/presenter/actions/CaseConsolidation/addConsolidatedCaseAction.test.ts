import { addConsolidatedCaseAction } from './addConsolidatedCaseAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addConsolidatedCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call addConsolidatedCaseInteractor and return docketNumber and caseToConsolidate docketNumber', async () => {
    const result = await runAction(addConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { docketNumber: '123-20' },
        caseToConsolidate: { docketNumber: '456-20' },
      },
    });

    expect(
      applicationContext.getUseCases().addConsolidatedCaseInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(result.output).toEqual({
      caseToConsolidateDocketNumber: '456-20',
      docketNumber: '123-20',
    });
  });
});
