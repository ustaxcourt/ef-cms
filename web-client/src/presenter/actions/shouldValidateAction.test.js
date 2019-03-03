import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import { shouldValidateAction } from './shouldValidateAction';

const validateSpy = sinon.spy();
const ignoreSpy = sinon.spy();

presenter.providers.path = {
  ignore: ignoreSpy,
  validate: validateSpy,
};

describe('shouldValidateAction', async () => {
  it('calls path.ignore if showValidation is false', async () => {
    await runAction(shouldValidateAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        showValidation: false,
      },
    });
    expect(ignoreSpy.called).toBeTruthy();
  });

  it('calls path.validate if showValidation is true', async () => {
    await runAction(shouldValidateAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        showValidation: true,
      },
    });
    expect(validateSpy.called).toBeTruthy();
  });
});
