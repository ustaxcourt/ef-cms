import { addConsolidatedCaseAction } from './addConsolidatedCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('addConsolidatedCaseAction', () => {
  let setConsolidatedCaseInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    setConsolidatedCaseInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        setConsolidatedCaseInteractor: setConsolidatedCaseInteractorMock,
      }),
    };
  });

  it('should call addConsolidatedCaseInteractor and return caseId amd caseToConsolidateId', async () => {
    const result = await runAction(addConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { caseId: '123' },
        caseToConsolidate: { caseId: '456' },
      },
    });

    expect(setConsolidatedCaseInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseId: '123',
      caseToConsolidateId: '456',
    });
  });
});
