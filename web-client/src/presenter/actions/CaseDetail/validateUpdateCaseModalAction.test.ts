import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUpdateCaseModalAction } from './validateUpdateCaseModalAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('validateUpdateCaseModalAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.success and not path.error if caseCaption and caseStatus are defined and the selected case status does not require a judge', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseCaption: 'A case caption',
          caseStatus: CASE_STATUS_TYPES.closed,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.success and not path.error if caseCaption and caseStatus are defined and the selected case status does require a judge and a judge is defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          associatedJudge: 'Judge Colvin',
          caseCaption: 'A case caption',
          caseStatus: CASE_STATUS_TYPES.submitted,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.success if caseCaption is not defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          associatedJudge: 'Judge Colvin',
          caseStatus: CASE_STATUS_TYPES.submitted,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.success if caseStatus is not defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          associatedJudge: 'Judge Colvin',
          caseCaption: 'A case caption',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.success if caseStatus requires a judge and a judge is not defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseCaption: 'A case caption',
          caseStatus: CASE_STATUS_TYPES.submitted,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });
});
