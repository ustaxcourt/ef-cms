import { addConsolidatedCaseAction } from './addConsolidatedCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('addConsolidatedCaseAction', () => {
  let addConsolidatedCaseInteractorMock;
  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      caseId: '123',
      docketNumber: '123-45',
    };

    addConsolidatedCaseInteractorMock = jest.fn(() => caseDetail);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        addConsolidatedCaseInteractor: addConsolidatedCaseInteractorMock,
      }),
    };
  });

  it('should call addConsolidatedCaseInteractor and return caseDetail, caseId amd caseToConsolidateId', async () => {
    const result = await runAction(addConsolidatedCaseAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: { caseId: '123' },
        caseToConsolidate: { caseId: '456' },
      },
    });

    expect(addConsolidatedCaseInteractorMock).toHaveBeenCalled();
    expect(result.output).toEqual({
      caseDetail: expect.anything(),
      caseId: '123',
      caseToConsolidateId: '456',
    });
  });
});
