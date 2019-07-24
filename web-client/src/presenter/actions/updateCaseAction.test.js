import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateCaseAction } from './updateCaseAction';
import sinon from 'sinon';

let updateCaseStub = sinon.stub().returns({});
const updateCaseTrialSortTagsStub = sinon.stub().resolves();

presenter.providers.applicationContext = {
  getEntityConstructors: () => ({
    Case,
  }),
  getUseCases: () => ({
    updateCaseInteractor: updateCaseStub,
    updateCaseTrialSortTagsInteractor: updateCaseTrialSortTagsStub,
  }),
};

describe('updateCaseAction', () => {
  it('should filter the year amounts that do not have values', async () => {
    await runAction(updateCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail: {
          ...MOCK_CASE,
          yearAmounts: [
            {
              amount: '',
              year: '',
            },
            {
              amount: '',
              year: '2001',
            },
            {
              amount: '1000',
              year: '',
            },
            {
              amount: '1000',
              year: '2002',
            },
          ],
        },
        constants: { STATUS_TYPES: Case.STATUS_TYPES },
      },
    });
    expect(updateCaseStub.getCall(0).args[0].caseToUpdate).toMatchObject({
      yearAmounts: [
        { amount: '', year: '2001' },
        { amount: '1000', year: '' },
        { amount: '1000', year: '2002' },
      ],
    });
  });

  it('should call the updateCaseTrialSortTags use case if case status is ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      createdAt: '2019-03-01T21:40:46.415Z',
    };
    updateCaseStub = sinon.stub().returns(caseDetail);

    await runAction(updateCaseAction, {
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
    expect(updateCaseTrialSortTagsStub.getCall(0).args[0].caseSortTags).toEqual(
      {
        hybrid:
          'WashingtonDC-H-C-20190301164046-c54ba5a9-b37b-479d-9201-067ec6e335bb',
        nonHybrid:
          'WashingtonDC-R-C-20190301164046-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    );
  });

  it('should not call the updateCaseTrialSortTags use case if case status is not ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: Case.STATUS_TYPES.new,
    };
    updateCaseStub = sinon.stub().returns(caseDetail);

    await runAction(updateCaseAction, {
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
