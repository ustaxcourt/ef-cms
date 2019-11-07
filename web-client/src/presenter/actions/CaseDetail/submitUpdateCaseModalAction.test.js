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
    expect(updateCaseCaptionInteractorMock.mock.calls[0][0]).toMatchObject({
      caseCaption: 'Updated Test Caption',
      caseId: '123',
    });
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
    expect(updateCaseStatusInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      caseStatus: 'General Docket - Not at Issue',
    });
    expect(updateCaseCaptionInteractorMock).not.toHaveBeenCalled();
  });

  it('Calls the update case status interactor if the associated judge has been updated', async () => {
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
    expect(updateCaseStatusInteractorMock.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      caseStatus: 'General Docket - Not at Issue',
    });
    expect(updateCaseCaptionInteractorMock).not.toHaveBeenCalled();
  });
});
