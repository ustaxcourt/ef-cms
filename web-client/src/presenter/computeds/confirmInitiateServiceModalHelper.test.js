import { applicationContext } from '../../applicationContext';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const confirmInitiateServiceModalHelper = withAppContextDecorator(
  confirmInitiateServiceModalHelperComputed,
  applicationContext,
);

describe('confirmInitiateServiceModalHelper', () => {
  it('returns the expected contacts needed if someone needs paper', () => {
    const result = runCompute(confirmInitiateServiceModalHelper, {
      state: {
        caseDetail: {
          contactPrimary: {
            address1: '609 East Cowley Parkway',
            address2: 'Ullamco quibusdam ea',
            address3: 'Consectetur quos do',
            city: 'asdf',
            countryType: 'domestic',
            email: 'petitioner@example.com',
            name: 'Callie Bullock',
            postalCode: '33333',
            state: 'AK',
          },
          contactSecondary: {
            address1: 'asdf',
            city: 'asadf',
            countryType: 'domestic',
            name: 'Chelsea Hogan',
            postalCode: '33333',
            state: 'AL',
          },
          isPaper: false,
          practitioners: [],
          respondents: [],
        },
        form: {},
      },
    });

    expect(result).toEqual({
      confirmLabel: 'Yes, serve',
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
            countryType: 'domestic',
            email: 'petitioner@example.com',
            name: 'Callie Bullock',
            postalCode: '33333',
            state: 'AK',
          },
          isPaper: false,
          practitioners: [],
          respondents: [],
        },
        form: {},
      },
    });

    expect(result).toEqual({
      confirmLabel: 'Yes, serve',
      contactsNeedingPaperService: [],
      showPaperAlert: false,
    });
  });
});
