import { STATUS_TYPES } from '../../../../shared/src/business/entities/Case';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateCaseAction } from './updateCaseAction';
import sinon from 'sinon';

let updateCaseStub = sinon.stub().returns({});
const updateCaseTrialSortTagsStub = sinon.stub().resolves();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateCase: updateCaseStub,
    updateCaseTrialSortTags: updateCaseTrialSortTagsStub,
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
        constants: { STATUS_TYPES },
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
      caseId: '123',
      status: STATUS_TYPES.generalDocketReadyForTrial,
      yearAmounts: [],
    };
    updateCaseStub = sinon.stub().returns(caseDetail);

    await runAction(updateCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail,
        constants: { STATUS_TYPES },
      },
    });
    expect(updateCaseTrialSortTagsStub.getCall(0).args[0].caseId).toEqual(
      '123',
    );
  });

  it('should not call the updateCaseTrialSortTags use case if case status is not ready for trial', async () => {
    const caseDetail = {
      caseId: '123',
      status: STATUS_TYPES.new,
      yearAmounts: [],
    };
    updateCaseStub = sinon.stub().returns(caseDetail);

    await runAction(updateCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        caseDetail,
        constants: { STATUS_TYPES },
      },
    });
    expect(updateCaseTrialSortTagsStub.getCall(1)).toEqual(null);
  });
});
