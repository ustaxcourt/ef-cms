import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupContactFormAction } from './setupContactFormAction';

describe('setupContactFormAction', () => {
  let PARTY_TYPES;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    ({ PARTY_TYPES } = applicationContext.getConstants());
  });

  it('should set contactPrimary, docketNumber, and partyType from props.caseDetail on form', async () => {
    const result = await runAction(setupContactFormAction, {
      modules: { presenter },
      props: {
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
      },
      state: {
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
