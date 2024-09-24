import { clearAddressFieldsAction } from '@web-client/presenter/actions/clearAddressFieldsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAddressFieldsAction', () => {
  it('should clear out primary contact address fields', async () => {
    const result = await runAction(clearAddressFieldsAction, {
      props: {
        type: 'contactPrimary',
      },
      state: {
        form: {
          contactPrimary: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            city: 'city',
            country: 'country',
            placeOfLegalResidence: 'placeOfLegalResidence',
            postalCode: 'postalCode',
            state: 'state',
          },
          contactSecondary: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            city: 'city',
            country: 'country',
            placeOfLegalResidence: 'placeOfLegalResidence',
            postalCode: 'postalCode',
            state: 'state',
          },
        },
      },
    });

    expect(result.state.form.contactPrimary.country).toBeUndefined();
    expect(result.state.form.contactPrimary.address1).toBeUndefined();
    expect(result.state.form.contactPrimary.address2).toBeUndefined();
    expect(result.state.form.contactPrimary.address3).toBeUndefined();
    expect(result.state.form.contactPrimary.city).toBeUndefined();
    expect(
      result.state.form.contactPrimary.placeOfLegalResidence,
    ).toBeUndefined();
    expect(result.state.form.contactPrimary.postalCode).toBeUndefined();
    expect(result.state.form.contactPrimary.state).toBeUndefined();

    expect(result.state.form.contactSecondary.country).toEqual('country');
    expect(result.state.form.contactSecondary.address1).toEqual('address1');
    expect(result.state.form.contactSecondary.address2).toEqual('address2');
    expect(result.state.form.contactSecondary.address3).toEqual('address3');
    expect(result.state.form.contactSecondary.city).toEqual('city');
    expect(result.state.form.contactSecondary.placeOfLegalResidence).toEqual(
      'placeOfLegalResidence',
    );
    expect(result.state.form.contactSecondary.postalCode).toEqual('postalCode');
    expect(result.state.form.contactSecondary.state).toEqual('state');
  });

  it('should clear out primary contact address validation errors', async () => {
    const result = await runAction(clearAddressFieldsAction, {
      props: {
        type: 'contactPrimary',
      },
      state: {
        form: {
          contactPrimary: {
            address1: 'address1',
          },
          contactSecondary: {
            address1: 'address1',
          },
        },
        validationErrors: {
          contactPrimary: {
            address1: 'Enter valid address',
            name: 'Enter valid name',
          },
        },
      },
    });

    expect(result.state.validationErrors.contactPrimary.name).toEqual(
      'Enter valid name',
    );
    expect(
      result.state.validationErrors.contactPrimary.address,
    ).toBeUndefined();
  });

  it('should clear out secondary contact address fields', async () => {
    const result = await runAction(clearAddressFieldsAction, {
      props: {
        type: 'contactSecondary',
      },
      state: {
        form: {
          contactPrimary: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            city: 'city',
            country: 'country',
            placeOfLegalResidence: 'placeOfLegalResidence',
            postalCode: 'postalCode',
            state: 'state',
          },
          contactSecondary: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            city: 'city',
            country: 'country',
            placeOfLegalResidence: 'placeOfLegalResidence',
            postalCode: 'postalCode',
            state: 'state',
          },
        },
      },
    });

    expect(result.state.form.contactPrimary.country).toEqual('country');
    expect(result.state.form.contactPrimary.address1).toEqual('address1');
    expect(result.state.form.contactPrimary.address2).toEqual('address2');
    expect(result.state.form.contactPrimary.address3).toEqual('address3');
    expect(result.state.form.contactPrimary.city).toEqual('city');
    expect(result.state.form.contactPrimary.placeOfLegalResidence).toEqual(
      'placeOfLegalResidence',
    );
    expect(result.state.form.contactPrimary.postalCode).toEqual('postalCode');
    expect(result.state.form.contactPrimary.state).toEqual('state');

    expect(result.state.form.contactSecondary.country).toBeUndefined();
    expect(result.state.form.contactSecondary.address1).toBeUndefined();
    expect(result.state.form.contactSecondary.address2).toBeUndefined();
    expect(result.state.form.contactSecondary.address3).toBeUndefined();
    expect(result.state.form.contactSecondary.city).toBeUndefined();
    expect(
      result.state.form.contactSecondary.placeOfLegalResidence,
    ).toBeUndefined();
    expect(result.state.form.contactSecondary.postalCode).toBeUndefined();
    expect(result.state.form.contactSecondary.state).toBeUndefined();
  });

  it('should clear out secondary contact address validation errors', async () => {
    const result = await runAction(clearAddressFieldsAction, {
      props: {
        type: 'contactSecondary',
      },
      state: {
        form: {
          contactPrimary: {
            address1: 'address1',
          },
          contactSecondary: {
            address1: 'address1',
          },
        },
        validationErrors: {
          contactSecondary: {
            address1: 'Enter valid address',
            name: 'Enter valid name',
          },
        },
      },
    });

    expect(result.state.validationErrors.contactSecondary.name).toEqual(
      'Enter valid name',
    );
    expect(
      result.state.validationErrors.contactSecondary.address,
    ).toBeUndefined();
  });
});
