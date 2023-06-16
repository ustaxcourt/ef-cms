import { applicationContext } from '../../applicationContext';
import { createOrderHelper as createOrderHelperComputed } from './createOrderHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const createOrderHelper = withAppContextDecorator(
  createOrderHelperComputed,
  applicationContext,
);

describe('createOrderHelper', () => {
  it('runs create order helper when not editing', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '102-20',
        },
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.pageTitle).toEqual('Create Order');
    expect(result.isEditing).toEqual(false);
  });

  it('runs create order helper when editing', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '102-20',
        },
        documentToEdit: {},
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.pageTitle).toEqual('Edit Order');
    expect(result.isEditing).toEqual(true);
    expect(result.documentToEdit).toMatchObject({});
  });

  it('sets showAddDocketNumbersButton to true when viewing a lead case', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '101-20',
        },
        documentToEdit: {},
        featureFlags: {
          'consolidated-cases-add-docket-numbers': true,
        },
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.showAddDocketNumbersButton).toEqual(true);
    expect(result.addDocketNumbersButtonText).toEqual(
      'Add docket numbers to the caption',
    );
    expect(result.addDocketNumbersButtonIcon).toEqual('plus-circle');
  });

  it('sets the correct addDocketNumbersButtonText when addedDocketNumbers is defined', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        addedDocketNumbers: [],
        caseDetail: {
          docketNumber: '101-20',
          leadDocketNumber: '101-20',
        },
        documentToEdit: {},
        featureFlags: {
          'consolidated-cases-add-docket-numbers': true,
        },
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.addDocketNumbersButtonText).toEqual(
      'Edit docket numbers in the caption',
    );
    expect(result.addDocketNumbersButtonIcon).toEqual('edit');
  });
});
