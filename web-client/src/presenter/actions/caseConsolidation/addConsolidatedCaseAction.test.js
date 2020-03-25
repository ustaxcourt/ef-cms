import { addConsolidatedCaseAction } from './addConsolidatedCaseAction';
import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('addConsolidatedCaseAction', () => {
  let applicationContext;

  beforeEach(() => {
    applicationContext = applicationContextForClient;

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call addConsolidatedCaseInteractor and return caseId and caseToConsolidateId', async () => {
    const result = await runAction(addConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { caseId: '123' },
        caseToConsolidate: { caseId: '456' },
      },
    });

    expect(
      applicationContext.getUseCases().addConsolidatedCaseInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(result.output).toEqual({
      caseId: '123',
      caseToConsolidateId: '456',
    });
  });
});
