import presenter from '..';
import { runAction } from 'cerebral/test';
import { shouldValidateAction } from './shouldValidateAction';
import sinon from 'sinon';

const validateSpy = sinon.spy();
const ignoreSpy = sinon.spy();

presenter.providers.path = {
  ignore: ignoreSpy,
  validate: validateSpy,
};

describe('shouldValidateAction', () => {
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
