import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
import { setupContactSecondaryFormAction } from './setupContactSecondaryFormAction';

describe('setupContactSecondaryFormAction', () => {
  let PARTY_TYPES;

  beforeAll(() => {
    ({ PARTY_TYPES } = applicationContext.getConstants());
  });

  it('should set contactSecondary, docketNumber, and partyType from props.caseDetail on form', async () => {
    const result = await runAction(setupContactSecondaryFormAction, {
      props: {
        caseDetail: {
          contactSecondary: {
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
      contactSecondary: {
        name: 'Rachael Ray',
      },
      docketNumber: '101-20',
      partyType: PARTY_TYPES.petitioner,
    });
  });
});
