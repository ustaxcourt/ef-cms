import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setupContactPrimaryFormAction } from './setupContactPrimaryFormAction';

describe('setupContactPrimaryFormAction', () => {
  let PARTY_TYPES;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    ({ PARTY_TYPES } = applicationContext.getConstants());
  });

  it('should set contactPrimary, docketNumber, and partyType from props.caseDetail on form', async () => {
    const result = await runAction(setupContactPrimaryFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          docketNumber: '101-20',
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            {
              isContactPrimary: true,
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
      contactPrimary: {
        isContactPrimary: true,
        name: 'Rachael Ray',
      },
      docketNumber: '101-20',
      partyType: PARTY_TYPES.petitioner,
    });
  });
});
