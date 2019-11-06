import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitUpdateCaseModalAction } from './submitUpdateCaseModalAction';

let updateCaseCaptionInteractorMock;
let updateCaseStatusInteractorMock;

const caseMock = {
  caption: 'Test Caption',
  caseId: '123',
  status: 'New',
};

describe('submitUpdateCaseModalAction', () => {
  beforeEach(() => {
    updateCaseCaptionInteractorMock = jest.fn();
    updateCaseStatusInteractorMock = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateCaseCaptionInteractor: updateCaseCaptionInteractorMock,
        updateCaseStatusInteractor: updateCaseStatusInteractorMock,
      }),
    };
  });

  it('Does nothing if caseDetail is not set on state', async () => {
    await runAction(submitUpdateCaseModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseCaption: 'Updated Test Caption',
          caseStatus: 'General Docket - Not at Issue',
        },
      },
    });

    expect(updateCaseCaptionInteractorMock).not.toHaveBeenCalled();
    expect(updateCaseStatusInteractorMock).not.toHaveBeenCalled();
  });

  it('Calls the update case caption interactor if the case caption has been updated', async () => {
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

    expect(updateCaseCaptionInteractorMock).toHaveBeenCalled();
    expect(updateCaseStatusInteractorMock).not.toHaveBeenCalled();
  });

  it('Calls the update case status interactor if the case status has been updated', async () => {
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

    expect(updateCaseStatusInteractorMock).toHaveBeenCalled();
    expect(updateCaseCaptionInteractorMock).not.toHaveBeenCalled();
  });
});
