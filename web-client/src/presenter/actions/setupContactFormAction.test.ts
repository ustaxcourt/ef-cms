import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setupContactFormAction } from './setupContactFormAction';

describe('setupContactFormAction', () => {
  let PARTY_TYPES;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    ({ PARTY_TYPES } = applicationContext.getConstants());
  });

  it('should set contactPrimary, docketNumber, and partyType from state.caseDetail on form', async () => {
    const result = await runAction(setupContactFormAction, {
      modules: { presenter },
      props: {},
      state: {
        caseDetail: {
          docketNumber: '101-20',
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            {
              contactType: CONTACT_TYPES.primary,
              name: 'Rachael Ray',
            },
          ],
        },
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      contact: {
        contactType: CONTACT_TYPES.primary,
        name: 'Rachael Ray',
      },
      docketNumber: '101-20',
      partyType: PARTY_TYPES.petitioner,
    });
  });
});
