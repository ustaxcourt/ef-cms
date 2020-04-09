import { applicationContext } from '../../applicationContext';
import { practitionerDetailHelper as practitionerDetailHelperComputed } from './practitionerDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const practitionerDetailHelper = withAppContextDecorator(
  practitionerDetailHelperComputed,
  {
    ...applicationContext,
  },
);

describe('practitionerDetailHelper', () => {
  it('should fall back to Not provided when additionalPhone is not set', () => {
    const { additionalPhone } = runCompute(practitionerDetailHelper, {
      state: {
        practitionerDetail: {
          additionalPhone: null,
        },
      },
    });
    expect(additionalPhone).toEqual('Not provided');
  });

  it('should fall back to Not provided when alternateEmail is not set', () => {
    const { alternateEmail } = runCompute(practitionerDetailHelper, {
      state: {
        practitionerDetail: {
          alternateEmail: null,
        },
      },
    });
    expect(alternateEmail).toEqual('Not provided');
  });

  it('should format the admissionsDate', () => {
    const { admissionsDateFormatted } = runCompute(practitionerDetailHelper, {
      state: {
        practitionerDetail: {
          admissionsDate: '2020-01-27T05:00:00.000Z',
        },
      },
    });
    expect(admissionsDateFormatted).toEqual('01/27/2020');
  });
});
