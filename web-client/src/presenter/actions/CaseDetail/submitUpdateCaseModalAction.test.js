import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitUpdateCaseModalAction } from './submitUpdateCaseModalAction';

let updateCaseContextInteractorMock;

const caseMock = {
  caption: 'Test Caption',
  caseId: '123',
  status: 'New',
};

describe('submitUpdateCaseModalAction', () => {
  beforeEach(() => {
    updateCaseContextInteractorMock = jest.fn();

    presenter.providers.applicationContext = {
      ...applicationContext,
      getUseCases: () => ({
        updateCaseContextInteractor: updateCaseContextInteractorMock,
      }),
    };
  });

  it('Calls the update case context interactor if the case caption has been updated', async () => {
    await runAction(submitUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: caseMock,
        modal: {
          caseCaption: 'Updated Test Caption',
        },
      },
    });

    expect(updateCaseContextInteractorMock).toHaveBeenCalled();
    expect(updateCaseContextInteractorMock.mock.calls[0][0]).toMatchObject({
      caseCaption: 'Updated Test Caption',
      caseId: '123',
    });
  });

  it('Calls the update case context interactor if the case status has been updated', async () => {
    await runAction(submitUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: caseMock,
        modal: {
          caseStatus: 'General Docket - Not at Issue',
        },
      },
    });

    expect(updateCaseContextInteractorMock).toHaveBeenCalled();
    expect(updateCaseContextInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      caseStatus: 'General Docket - Not at Issue',
    });
  });

  it('Calls the update case context interactor if the associated judge has been updated', async () => {
    await runAction(submitUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: caseMock,
        modal: {
          caseStatus: 'General Docket - Not at Issue',
        },
      },
    });

    expect(updateCaseContextInteractorMock).toHaveBeenCalled();
    expect(updateCaseContextInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      caseStatus: 'General Docket - Not at Issue',
    });
  });

  it('Calls the update case context interactor if the case status has been updated, setting the associated judge to undefined if the status is General Docket - Not At Issue', async () => {
    await runAction(submitUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: caseMock,
        modal: {
          associatedJudge: 'Judge Armen',
          caseStatus: 'General Docket - Not at Issue',
        },
      },
    });

    expect(updateCaseContextInteractorMock).toHaveBeenCalled();
    expect(updateCaseContextInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      caseStatus: 'General Docket - Not at Issue',
    });
  });
});
