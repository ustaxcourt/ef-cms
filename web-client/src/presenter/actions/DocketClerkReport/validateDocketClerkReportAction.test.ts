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
          errors: { docketClerkUserId: 'old error' },
          form: { docketClerkUserId: 'u1', pageType: 'documentQC' },
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
    expect(state.docketClerkReport.errors).toBeNull();
  });

  it('should call path.error and set errors when docketClerkUserId is missing', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          errors: null,
          form: { pageType: 'messages' },
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
    expect(state.docketClerkReport.errors?.docketClerkUserId).toBe(
      'Select a Docket Clerk',
    );
    expect(state.docketClerkReport.errors?.pageType).toBeUndefined();
  });

  it('should call path.error and set errors when pageType is missing', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          errors: null,
          form: { docketClerkUserId: 'u1' },
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
    expect(state.docketClerkReport.errors?.pageType).toBe('Select a Page Type');
    expect(state.docketClerkReport.errors?.docketClerkUserId).toBeUndefined();
  });

  it('should call path.error and set both errors when both fields are missing', async () => {
    const { state } = await runAction(validateDocketClerkReportAction, {
      modules: { presenter },
      state: {
        docketClerkReport: {
          errors: null,
          form: {},
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
    expect(successStub).not.toHaveBeenCalled();
    expect(state.docketClerkReport.errors?.docketClerkUserId).toBe(
      'Select a Docket Clerk',
    );
    expect(state.docketClerkReport.errors?.pageType).toBe('Select a Page Type');
  });
});
