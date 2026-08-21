import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateDocketClerkReportAction } from './validateDocketClerkReportAction';

describe('validateDocketClerkReportAction', () => {
  let successStub: jest.Mock;
  let errorStub: jest.Mock;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    successStub = jest.fn();
    errorStub = jest.fn();
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.success and clear errors when both docketClerkUserId and pageType are provided', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          form: { docketClerkUserId: 'u1', pageType: 'documentQC' },
        },
        validationErrors: { docketClerkUserId: 'old error' },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
    expect(state.validationErrors).toEqual({});
  });

  it('should call path.error and set errors when docketClerkUserId is missing', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          form: { pageType: 'messages' },
        },
        validationErrors: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
    expect(state.validationErrors.docketClerkUserId).toBe(
      'Select a Docket Clerk',
    );
    expect(state.validationErrors.pageType).toBeUndefined();
  });

  it('should call path.error and set errors when pageType is missing', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          form: { docketClerkUserId: 'u1' },
        },
        validationErrors: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
    expect(state.validationErrors.pageType).toBe('Select a Page Type');
    expect(state.validationErrors.docketClerkUserId).toBeUndefined();
  });

  it('should call path.error and set both errors when both fields are missing', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          form: {},
        },
        validationErrors: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
    expect(state.validationErrors.docketClerkUserId).toBe(
      'Select a Docket Clerk',
    );
    expect(state.validationErrors.pageType).toBe('Select a Page Type');
  });
});
