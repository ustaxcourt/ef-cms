import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateCaseAction } from './updateCaseAction';
import sinon from 'sinon';

const updateCaseStub = sinon.stub().returns({});

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateCase: updateCaseStub,
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
});
