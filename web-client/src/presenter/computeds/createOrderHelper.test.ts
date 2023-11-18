import { applicationContext } from '../../applicationContext';
import { createOrderHelper as createOrderHelperComputed } from './createOrderHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const createOrderHelper = withAppContextDecorator(
  createOrderHelperComputed,
  applicationContext,
);

describe('createOrderHelper', () => {
  const consolidatedCasesToMultiDocketOn = [
    {
      checked: true,
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20L',
      leadDocketNumber: '101-20',
    },
    {
      checked: false,
      docketNumber: '103-67',
      docketNumberWithSuffix: '103-67S',
      leadDocketNumber: '101-20',
    },
  ];

  let caseDetail;

  beforeEach(() => {
    caseDetail = {
      docketNumber: '101-20',
      leadDocketNumber: '101-20',
    };
  });

  it('should set isEditing to false and set pageTitle to "Create Order" if there is no document to edit', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail,
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.pageTitle).toEqual('Create Order');
    expect(result.isEditing).toEqual(false);
  });

  it('should set isEditing to true and set pageTitle to "Edit Order" if there is a document to edit', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail,
        documentToEdit: {},
        form: {
          documentTitle: 'Order',
        },
      },
    });

    expect(result.pageTitle).toEqual('Edit Order');
    expect(result.isEditing).toEqual(true);
  });

  it('sets showAddDocketNumbersButton to true when viewing a lead case', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail,
        documentToEdit: {},
        featureFlags: {
          'consolidated-cases-add-docket-numbers': true,
        },
        form: {
          documentTitle: 'Order',
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(result.showAddDocketNumbersButton).toEqual(true);
  });

  it('sets showAddDocketNumbersButton to false if feature flag is not set', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail,
        documentToEdit: {},
        featureFlags: {
          'consolidated-cases-add-docket-numbers': false,
        },
        form: {
          documentTitle: 'Order',
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(result.showAddDocketNumbersButton).toEqual(false);
  });

  it('sets showAddDocketNumbersButton to false for member cases', () => {
    caseDetail.docketNumber = '103-20';
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail,
        documentToEdit: {},
        featureFlags: {
          'consolidated-cases-add-docket-numbers': true,
        },
        form: {
          documentTitle: 'Order',
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(result.showAddDocketNumbersButton).toEqual(false);
  });

  it('should display "Add docket numbers to the caption" text and plus icon if there are no consolidated cases to select', () => {
    const result = runCompute(createOrderHelper, {
      state: {
        caseDetail,
        documentToEdit: {},
        featureFlags: {
          'consolidated-cases-add-docket-numbers': true,
        },
        form: {
          documentTitle: 'Order',
        },
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn: undefined, // REFACTOR DEFAULT STATE OF consolidatedCasesToMultiDocketOn on modal to have a default state when creating of order starts to make
          },
        },
      },
    });
    expect(result.addDocketNumbersButtonText).toEqual(
      'Add docket numbers to the caption',
    );
    expect(result.addDocketNumbersButtonIcon).toEqual('plus-circle');
  });

  it('should display "Edit docket numbers in the caption" text and edit icon if there are selected consolidated cases', () => {
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
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn,
          },
        },
      },
    });

    expect(result.addDocketNumbersButtonText).toEqual(
      'Edit docket numbers in the caption',
    );
    expect(result.addDocketNumbersButtonIcon).toEqual('edit');
  });
});
