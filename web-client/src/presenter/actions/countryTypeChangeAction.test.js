import { countryTypeChangeAction } from './countryTypeChangeAction';
import { runAction } from 'cerebral/test';

describe('countryTypeChangeAction', () => {
  it('should clear contact info and validationErrors when changed', async () => {
    const result = await runAction(countryTypeChangeAction, {
      state: {
        caseDetail: {
          contactPrimary: {
            address1: '123 Hello',
            city: 'Howdy Town',
            country: 'Argentina',
            phone: '1234567890',
            postalCode: '12345',
            state: '',
          },
        },
        validationErrors: {
          contactPrimary: {
            state: 'Invalid state',
          },
        },
      },
    });

    expect(result.state.validationErrors.contactPrimary).toEqual({});
    expect(result.state.caseDetail.contactPrimary.address1).toBeUndefined();
    expect(result.state.caseDetail.contactPrimary.city).toBeUndefined();
    expect(result.state.caseDetail.contactPrimary.country).toBeUndefined();
    expect(result.state.caseDetail.contactPrimary.phone).toBeUndefined();
    expect(result.state.caseDetail.contactPrimary.postalCode).toBeUndefined();
    expect(result.state.caseDetail.contactPrimary.state).toBeUndefined();
  });
});
