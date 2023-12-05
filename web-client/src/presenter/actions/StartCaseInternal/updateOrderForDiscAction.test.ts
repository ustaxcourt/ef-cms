import { PARTY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateOrderForDiscAction } from './updateOrderForDiscAction';

describe('updateOrderForDiscAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.form.orderForDisc true if state.form.partyType is Corporation and an corporate disclosure file has not been uploaded', async () => {
    const result = await runAction(updateOrderForDiscAction, {
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

    expect(result.state.form.orderForDisc).toEqual(true);
  });

  it('should set state.form.orderForDisc false if state.form.partyType is Petitioner', async () => {
    const result = await runAction(updateOrderForDiscAction, {
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

    expect(result.state.form.orderForDisc).toEqual(false);
  });

  it('should set state.form.orderForDisc false if state.form.partyType is Corporation and an corporate disclosure file has been uploaded', async () => {
    const result = await runAction(updateOrderForDiscAction, {
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

    expect(result.state.form.orderForDisc).toEqual(false);
  });

  it('should not update orderForDisc if props.key is not partyType or corporateDisclosureFile', async () => {
    const result = await runAction(updateOrderForDiscAction, {
      modules: {
        presenter,
      },
      props: { key: 'anotherField' },
      state: {
        form: {
          orderForDisc: false,
          partyType: PARTY_TYPES.corporation,
        },
      },
    });

    expect(result.state.form.orderForDisc).toEqual(false);
  });
});
