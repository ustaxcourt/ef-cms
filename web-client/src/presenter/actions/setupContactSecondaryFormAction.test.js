import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupContactSecondaryFormAction } from './setupContactSecondaryFormAction';

describe('setupContactSecondaryFormAction', () => {
  let PARTY_TYPES;

  beforeAll(() => {
    ({ PARTY_TYPES } = applicationContext.getConstants());
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set contactSecondary, docketNumber, and partyType from props.caseDetail on form', async () => {
    const result = await runAction(setupContactSecondaryFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          docketNumber: '101-20',
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            {
              contactType: CONTACT_TYPES.secondary,
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
      contactSecondary: {
        contactType: CONTACT_TYPES.secondary,
        name: 'Rachael Ray',
      },
      docketNumber: '101-20',
      partyType: PARTY_TYPES.petitioner,
    });
  });
});
