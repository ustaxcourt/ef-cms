import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('confirmInitiateServiceModalHelper', () => {
  const confirmInitiateServiceModalHelper = withAppContextDecorator(
    confirmInitiateServiceModalHelperComputed,
    applicationContext,
  );

  it('returns the expected contacts needed if someone needs paper', () => {
    const result = runCompute(confirmInitiateServiceModalHelper, {
      state: {
        caseDetail: {
          irsPractitioners: [],
          isPaper: false,
          petitioners: [
            {
              address1: '609 East Cowley Parkway',
              address2: 'Ullamco quibusdam ea',
              address3: 'Consectetur quos do',
              city: 'asdf',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner@example.com',
              name: 'Callie Bullock',
              postalCode: '33333',
              state: 'AK',
            },
            {
              address1: 'asdf',
              city: 'asadf',
              contactType: CONTACT_TYPES.secondary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              name: 'Chelsea Hogan',
              postalCode: '33333',
              state: 'AL',
            },
          ],
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
          irsPractitioners: [],
          isPaper: false,
          petitioners: [
            {
              address1: '609 East Cowley Parkway',
              address2: 'Ullamco quibusdam ea',
              address3: 'Consectetur quos do',
              city: 'asdf',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner@example.com',
              name: 'Callie Bullock',
              postalCode: '33333',
              state: 'AK',
            },
          ],
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
