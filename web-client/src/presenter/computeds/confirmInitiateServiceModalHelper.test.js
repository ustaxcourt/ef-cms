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
            name: 'Callie Bullock',
            postalCode: '33333',
            serviceIndicator: 'Paper',
            state: 'AK',
          },
          contactSecondary: {
            address1: 'asdf',
            city: 'asadf',
            countryType: 'domestic',
            name: 'Chelsea Hogan',
            postalCode: '33333',
            serviceIndicator: 'Paper',
            state: 'AL',
          },
          isPaper: true,
          practitioners: [],
          respondents: [],
        },
        form: {},
      },
    });

    expect(result).toEqual({
      contactsNeedingPaperService: [
        { name: 'Callie Bullock, Petitioner' },
        { name: 'Chelsea Hogan, Petitioner' },
      ],
      showPaperAlert: true,
    });
  });
});
