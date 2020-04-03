import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitUpdateCaseModalAction } from './submitUpdateCaseModalAction';

const caseMock = {
  caption: 'Test Caption',
  caseId: '123',
  status: 'New',
};

presenter.providers.applicationContext = applicationContext;

describe('submitUpdateCaseModalAction', () => {
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

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][0],
    ).toMatchObject({
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

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][0],
    ).toMatchObject({
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

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][0],
    ).toMatchObject({
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

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: '123',
      caseStatus: 'General Docket - Not at Issue',
    });
  });
});
