import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getAllIrsPractitionersForSelectHelper as getAllIrsPractitionersForSelectHelperComputed } from './getAllIrsPractitionersForSelectHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('getAllIrsPractitionersForSelectHelper', () => {
  const TEST_IRS_PRACTITIONERS: any[] = [];
  const getAllIrsPractitionersForSelectHelper = withAppContextDecorator(
    getAllIrsPractitionersForSelectHelperComputed,
    {
      ...applicationContext,
    },
  );

  it('should return an object from the helper', () => {
    const result = runCompute(getAllIrsPractitionersForSelectHelper, {
      state: {
        irsPractitioners: TEST_IRS_PRACTITIONERS,
      },
    });

    expect(typeof result).toEqual('object');
  });

  it('should return the formatted irs calendar admin contact info', () => {
    TEST_IRS_PRACTITIONERS.push({
      contact: {
        address1: 'TEST_ADDRESS_1',
        address2: 'TEST_ADDRESS_2',
        city: 'TEST_CITY',
        phone: 'TEST_PHONE',
        postalCode: 'TEST_POSTAL_CODE',
        state: 'TEST_STATE',
      },
      email: 'TEST_EMAIL',
      name: 'TEST_NAME',
    });
    const result = runCompute(getAllIrsPractitionersForSelectHelper, {
      state: {
        irsPractitioners: TEST_IRS_PRACTITIONERS,
      },
    });

    expect(result).toEqual({
      irsPractitionersContactInfo: [
        {
          email: 'TEST_EMAIL',
          label:
            'TEST_NAME; TEST_ADDRESS_1, TEST_ADDRESS_2; TEST_CITY, TEST_STATE TEST_POSTAL_CODE',
          name: 'TEST_NAME',
          phone: 'TEST_PHONE',
          value:
            'TEST_NAME; TEST_ADDRESS_1, TEST_ADDRESS_2; TEST_CITY, TEST_STATE TEST_POSTAL_CODE',
        },
      ],
    });
  });
});
