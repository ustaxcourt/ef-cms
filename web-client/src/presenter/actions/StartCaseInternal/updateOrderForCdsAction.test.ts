import { PARTY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateOrderForCdsAction } from './updateOrderForCdsAction';

describe('updateOrderForCdsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.form.orderForCds true if state.form.partyType is Corporation and an corporate disclosure file has not been uploaded', async () => {
    const result = await runAction(updateOrderForCdsAction, {
      modules: {
        presenter,
      },
      props: { key: 'partyType' },
      state: {
        form: {
          partyType: PARTY_TYPES.corporation,
        },
      },
    });

    expect(result.state.form.orderForCds).toEqual(true);
  });

  it('should set state.form.orderForCds false if state.form.partyType is Petitioner', async () => {
    const result = await runAction(updateOrderForCdsAction, {
      modules: {
        presenter,
      },
      props: { key: 'partyType' },
      state: {
        form: {
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.state.form.orderForCds).toEqual(false);
  });

  it('should set state.form.orderForCds false if state.form.partyType is Corporation and a corporate disclosure file has been uploaded', async () => {
    const result = await runAction(updateOrderForCdsAction, {
      modules: {
        presenter,
      },
      props: { key: 'corporateDisclosureFile' },
      state: {
        form: {
          corporateDisclosureFile: 'the file!',
          partyType: PARTY_TYPES.corporation,
        },
      },
    });

    expect(result.state.form.orderForCds).toEqual(false);
  });

  it('should not update orderForCds if props.key is not partyType or corporateDisclosureFile', async () => {
    const result = await runAction(updateOrderForCdsAction, {
      modules: {
        presenter,
      },
      props: { key: 'anotherField' },
      state: {
        form: {
          orderForCds: false,
          partyType: PARTY_TYPES.corporation,
        },
      },
    });

    expect(result.state.form.orderForCds).toEqual(false);
  });
});
