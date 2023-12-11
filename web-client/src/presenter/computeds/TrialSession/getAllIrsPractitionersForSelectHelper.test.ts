import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getAllIrsPractitionersForSelectHelper as getAllIrsPractitionersForSelectHelperComputed } from './getAllIrsPractitionersForSelectHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('getAllIrsPractitionersForSelectHelper', () => {
  let TEST_IRS_PRACTITIONERS: any[] = [];
  const getAllIrsPractitionersForSelectHelper = withAppContextDecorator(
    getAllIrsPractitionersForSelectHelperComputed,
    {
      ...applicationContext,
    },
  );

  beforeEach(() => {
    TEST_IRS_PRACTITIONERS = [];
  });

  it('should return the formatted irs calendar admin contact info', () => {
    TEST_IRS_PRACTITIONERS.push({
      admissionsStatus: 'Active',
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

  it('should return the formatted irs calendar admin contact info excluding non "Active" users', () => {
    TEST_IRS_PRACTITIONERS.push({
      admissionsStatus: 'Inctive',
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

    TEST_IRS_PRACTITIONERS.push({
      admissionsStatus: 'Active',
      contact: {
        address1: 'ACTIVE_TEST_ADDRESS_1',
        address2: 'ACTIVE_TEST_ADDRESS_2',
        city: 'ACTIVE_TEST_CITY',
        phone: 'ACTIVE_TEST_PHONE',
        postalCode: 'ACTIVE_TEST_POSTAL_CODE',
        state: 'ACTIVE_TEST_STATE',
      },
      email: 'ACTIVE_TEST_EMAIL',
      name: 'ACTIVE_TEST_NAME',
    });

    const result = runCompute(getAllIrsPractitionersForSelectHelper, {
      state: {
        irsPractitioners: TEST_IRS_PRACTITIONERS,
      },
    });

    expect(result.irsPractitionersContactInfo.length).toEqual(1);
    expect(result).toEqual({
      irsPractitionersContactInfo: [
        {
          email: 'ACTIVE_TEST_EMAIL',
          label:
            'ACTIVE_TEST_NAME; ACTIVE_TEST_ADDRESS_1, ACTIVE_TEST_ADDRESS_2; ACTIVE_TEST_CITY, ACTIVE_TEST_STATE ACTIVE_TEST_POSTAL_CODE',
          name: 'ACTIVE_TEST_NAME',
          phone: 'ACTIVE_TEST_PHONE',
          value:
            'ACTIVE_TEST_NAME; ACTIVE_TEST_ADDRESS_1, ACTIVE_TEST_ADDRESS_2; ACTIVE_TEST_CITY, ACTIVE_TEST_STATE ACTIVE_TEST_POSTAL_CODE',
        },
      ],
    });
  });
});
