import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { shouldValidateAction } from './shouldValidateAction';

const validateSpy = jest.fn();
const ignoreSpy = jest.fn();

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
    expect(ignoreSpy).toHaveBeenCalled();
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
    expect(validateSpy).toHaveBeenCalled();
  });
});
