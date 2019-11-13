import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { saveCaseDetailInternalEditAction } from './saveCaseDetailInternalEditAction';
import sinon from 'sinon';

let saveCaseDetailInternalEditStub = sinon.stub().returns({});
const updateCaseTrialSortTagsStub = sinon.stub().resolves();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    saveCaseDetailInternalEditInteractor: saveCaseDetailInternalEditStub,
    updateCaseTrialSortTagsInteractor: updateCaseTrialSortTagsStub,
  }),
};

describe('saveCaseDetailInternalEditAction', () => {
  it('should call the updateCaseTrialSortTags use case if case status is ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      createdAt: '2019-03-01T21:40:46.415Z',
    };
    saveCaseDetailInternalEditStub = sinon.stub().returns(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail,
        constants: { STATUS_TYPES: Case.STATUS_TYPES },
      },
    });
    expect(updateCaseTrialSortTagsStub.getCall(0).args[0].caseId).toEqual(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );
  });

  it('should not call the updateCaseTrialSortTags use case if case status is not ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.new,
    };
    saveCaseDetailInternalEditStub = sinon.stub().returns(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail,
        constants: { STATUS_TYPES: Case.STATUS_TYPES },
      },
    });
    expect(updateCaseTrialSortTagsStub.getCall(1)).toEqual(null);
  });
});
