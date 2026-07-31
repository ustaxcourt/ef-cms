import { MOTION_DISPOSITIONS } from '@shared/business/entities/EntityConstants';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateGrantDenyMotionFormAction } from './validateGrantDenyMotionFormAction';

describe('validateGrantDenyMotionFormAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    mockSuccessPath.mockReset();
    mockErrorPath.mockReset();
    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('takes the success path when the form is valid', async () => {
    await runAction(validateGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(mockSuccessPath).toHaveBeenCalled();
  });

  it('takes the error path with formatted errors when invalid', async () => {
    await runAction(validateGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: {},
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder: [
        'issueOrder',
        'disposition',
        'jurisdiction',
        'filingParty',
        'dueDate',
        'additionalOrderTextArray',
      ],
      errors: { disposition: 'Select Granted or Denied' },
    });
  });

  it('orders filingParty before dueDate so the bullet list matches the field order', async () => {
    await runAction(validateGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          dueDateMessage: 'statusReport',
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith(
      expect.objectContaining({
        errorDisplayOrder: expect.arrayContaining(['filingParty', 'dueDate']),
        errors: expect.objectContaining({
          dueDate: 'Date is required',
          filingParty: 'Select Filing Party',
        }),
      }),
    );

    const { errorDisplayOrder } = mockErrorPath.mock.calls[0][0];
    expect(errorDisplayOrder.indexOf('filingParty')).toBeLessThan(
      errorDisplayOrder.indexOf('dueDate'),
    );
  });

  it('flags issueOrder as required on a lead case', async () => {
    await runAction(validateGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26', leadDocketNumber: '101-26' },
        form: { disposition: MOTION_DISPOSITIONS.GRANTED },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({
          issueOrder: 'Select on which cases to file this order',
        }),
      }),
    );
  });

  it('flags jurisdiction as required when case is stricken from trial session', async () => {
    await runAction(validateGrantDenyMotionFormAction, {
      modules: { presenter },
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: {
          disposition: MOTION_DISPOSITIONS.GRANTED,
          strickenFromTrialSession: true,
        },
      },
    });

    expect(mockErrorPath).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({
          jurisdiction:
            'Jurisdiction is required since case is stricken from the trial session',
        }),
      }),
    );
  });
});
