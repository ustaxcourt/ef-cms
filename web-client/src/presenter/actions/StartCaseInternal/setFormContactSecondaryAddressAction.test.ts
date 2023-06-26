import { runAction } from '@web-client/presenter/test.cerebral';
import { setFormContactSecondaryAddressAction } from './setFormContactSecondaryAddressAction';

describe('setFormContactSecondaryAddressAction', () => {
  it('should set form.contactSecondary to the contact props value, excluding name, paper petition email, and e-consent values', async () => {
    const result = await runAction(setFormContactSecondaryAddressAction, {
      props: {
        contact: {
          city: 'Flavortown',
          hasConsentedToEService: true,
          name: 'Guy Fieri',
          paperPetitionEmail: 'petitioner@example.com',
        },
      },
      state: {
        form: {
          contactPrimary: {
            city: 'Flavortown',
            contactId: '123abc',
            hasConsentedToEService: true,
            name: 'Guy Fieri',
            paperPetitionEmail: 'petitioner@example.com',
          },
          contactSecondary: {
            city: 'Greenbough',
            contactId: 'abc123',
            hasConsentedToEService: false,
            inCareOf: 'Jennay',
            name: 'Forrest',
            paperPetitionEmail: 'notacopy@example.com',
          },
        },
      },
    });

    expect(result.state.form.contactPrimary).toMatchObject({
      city: 'Flavortown',
      contactId: '123abc',
      hasConsentedToEService: true,
      name: 'Guy Fieri',
      paperPetitionEmail: 'petitioner@example.com',
    });
    expect(result.state.form.contactSecondary).toMatchObject({
      city: 'Flavortown',
      contactId: 'abc123',
      hasConsentedToEService: false,
      inCareOf: 'Jennay',
      name: 'Forrest',
      paperPetitionEmail: 'notacopy@example.com',
    });
  });
});
