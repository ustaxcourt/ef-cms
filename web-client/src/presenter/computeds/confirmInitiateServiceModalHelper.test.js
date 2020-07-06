import { applicationContext } from '../../applicationContext';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('confirmInitiateServiceModalHelper', () => {
  const confirmInitiateServiceModalHelper = withAppContextDecorator(
    confirmInitiateServiceModalHelperComputed,
    applicationContext,
  );

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  it('returns the expected contacts needed if someone needs paper', () => {
    const result = runCompute(confirmInitiateServiceModalHelper, {
      state: {
        caseDetail: {
          contactPrimary: {
            address1: '609 East Cowley Parkway',
            address2: 'Ullamco quibusdam ea',
            address3: 'Consectetur quos do',
            city: 'asdf',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner@example.com',
            name: 'Callie Bullock',
            postalCode: '33333',
            state: 'AK',
          },
          contactSecondary: {
            address1: 'asdf',
            city: 'asadf',
            countryType: COUNTRY_TYPES.DOMESTIC,
            name: 'Chelsea Hogan',
            postalCode: '33333',
            state: 'AL',
          },
          irsPractitioners: [],
          isPaper: false,
          privatePractitioners: [],
        },
        form: {},
      },
    });

    expect(result).toEqual({
      contactsNeedingPaperService: [{ name: 'Chelsea Hogan, Petitioner' }],
      showPaperAlert: true,
    });
  });

  it('returns the expected values if no contacts need paper service', () => {
    const result = runCompute(confirmInitiateServiceModalHelper, {
      state: {
        caseDetail: {
          contactPrimary: {
            address1: '609 East Cowley Parkway',
            address2: 'Ullamco quibusdam ea',
            address3: 'Consectetur quos do',
            city: 'asdf',
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner@example.com',
            name: 'Callie Bullock',
            postalCode: '33333',
            state: 'AK',
          },
          irsPractitioners: [],
          isPaper: false,
          privatePractitioners: [],
        },
        form: {},
      },
    });

    expect(result).toEqual({
      contactsNeedingPaperService: [],
      showPaperAlert: false,
    });
  });
});
