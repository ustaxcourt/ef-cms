import { addConsolidatedCaseAction } from './addConsolidatedCaseAction';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('addConsolidatedCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call addConsolidatedCaseInteractor and return caseId and caseToConsolidateId', async () => {
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
