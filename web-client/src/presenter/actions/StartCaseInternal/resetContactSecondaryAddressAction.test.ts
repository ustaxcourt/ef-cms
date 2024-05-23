import { resetContactSecondaryAddressAction } from '@web-client/presenter/actions/StartCaseInternal/resetContactSecondaryAddressAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetContactSecondaryAddressAction', () => {
  it('should clear state correctly', async () => {
    const results = await runAction(resetContactSecondaryAddressAction, {
      state: {
        form: {
          contactSecondary: {
            address1: 'TEST_address1',
            address2: 'TEST_address2',
            address3: 'TEST_address3',
            city: 'TEST_city',
            phone: 'TEST_phone',
            placeOfLegalResidence: 'TEST_placeOfLegalResidence',
            postalCode: 'TEST_postalCode',
            state: 'TEST_state',
          },
        },
      },
    });

    const { contactSecondary } = results.state.form;
    expect(contactSecondary).toEqual({});
  });
});
