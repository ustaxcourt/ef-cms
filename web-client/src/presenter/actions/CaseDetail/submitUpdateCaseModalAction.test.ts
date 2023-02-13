import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitUpdateCaseModalAction } from './submitUpdateCaseModalAction';

describe('submitUpdateCaseModalAction', () => {
  const { STATUS_TYPES } = applicationContext.getConstants();

  const caseMock = {
    caption: 'Test Caption',
    docketNumber: '123-20',
    status: STATUS_TYPES.new,
  };

  presenter.providers.applicationContext = applicationContext;

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
        .calls[0][1],
    ).toMatchObject({
      caseCaption: 'Updated Test Caption',
      docketNumber: '123-20',
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
          caseStatus: STATUS_TYPES.generalDocket,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseStatus: STATUS_TYPES.generalDocket,
      docketNumber: '123-20',
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
          caseStatus: STATUS_TYPES.generalDocket,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseStatus: STATUS_TYPES.generalDocket,
      docketNumber: '123-20',
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
          associatedJudge: 'Judge Colvin',
          caseStatus: STATUS_TYPES.generalDocket,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseContextInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseContextInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseStatus: STATUS_TYPES.generalDocket,
      docketNumber: '123-20',
    });
  });
});
