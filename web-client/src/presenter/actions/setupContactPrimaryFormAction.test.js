import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
import { setupContactPrimaryFormAction } from './setupContactPrimaryFormAction';

describe('setupContactPrimaryFormAction', () => {
  let PARTY_TYPES;

  beforeAll(() => {
    ({ PARTY_TYPES } = applicationContext.getConstants());
  });

  it('should set contactPrimary, docketNumber, and partyType from props.caseDetail on form', async () => {
    const result = await runAction(setupContactPrimaryFormAction, {
      props: {
        caseDetail: {
          contactPrimary: {
            name: 'Rachael Ray',
          },
          docketNumber: '101-20',
          partyType: PARTY_TYPES.petitioner,
        },
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      contactPrimary: {
        name: 'Rachael Ray',
      },
      docketNumber: '101-20',
      partyType: PARTY_TYPES.petitioner,
    });
  });
});
