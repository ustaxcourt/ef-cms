import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateUpdateCaseModalAction } from './validateUpdateCaseModalAction';

presenter.providers.applicationContext = applicationContext;

describe('validateUpdateCaseModalAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
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
          caseStatus: Case.STATUS_TYPES.closed,
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
          associatedJudge: 'Judge Armen',
          caseCaption: 'A case caption',
          caseStatus: Case.STATUS_TYPES.submitted,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.sucess if caseCaption is not defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          associatedJudge: 'Judge Armen',
          caseStatus: Case.STATUS_TYPES.submitted,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.sucess if caseStatus is not defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          associatedJudge: 'Judge Armen',
          caseCaption: 'A case caption',
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error and not path.sucess if caseStatus requires a judge and a judge is not defined', async () => {
    await runAction(validateUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseCaption: 'A case caption',
          caseStatus: Case.STATUS_TYPES.submitted,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
  });
});
