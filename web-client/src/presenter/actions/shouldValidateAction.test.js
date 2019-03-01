import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import { shouldValidateAction } from './shouldValidateAction';

const validateSpy = sinon.spy();
const ignoreSpy = sinon.spy();

presenter.providers.path = {
  validate: validateSpy,
  ignore: ignoreSpy,
};

describe('shouldValidateAction', async () => {
  it('calls path.ignore if showValidation is false', async () => {
    await runAction(shouldValidateAction, {
      state: {
        showValidation: false,
      },
      modules: {
        presenter,
      },
      props: {},
    });
    expect(ignoreSpy.called).toBeTruthy();
  });

  it('calls path.validate if showValidation is true', async () => {
    await runAction(shouldValidateAction, {
      state: {
        showValidation: true,
      },
      modules: {
        presenter,
      },
      props: {},
    });
    expect(validateSpy.called).toBeTruthy();
  });
});
