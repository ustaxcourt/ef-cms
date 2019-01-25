import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import updateCaseAction from './updateCaseAction';

const updateCaseStub = sinon.stub().returns({});
const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateCase: updateCaseStub,
  }),
};

presenter.providers.path = {
  success: successStub,
  error: errorStub,
};

describe('updateCaseAction', async () => {
  it('should filter the year amounts that do not have values', async () => {
    await runAction(updateCaseAction, {
      state: {
        caseDetail: {
          yearAmounts: [
            {
              year: '',
              amount: '',
            },
            {
              year: '2001',
              amount: '',
            },
            {
              year: '',
              amount: '1000',
            },
            {
              year: '2002',
              amount: '1000',
            },
          ],
        },
      },
      modules: {
        presenter,
      },
      props: {},
    });
    expect(updateCaseStub.getCall(0).args[0].caseToUpdate).toMatchObject({
      yearAmounts: [
        { amount: '', year: '2001' },
        { amount: '1000', year: '' },
        { amount: '1000', year: '2002' },
      ],
    });
    expect(successStub.calledOnce).toEqual(true);
  });
});
