import { PARTY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateOrderForOdsAction } from './updateOrderForOdsAction';

describe('updateOrderForOdsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.form.orderForOds true if state.form.partyType is Corporation and an ownership disclosure file has not been uploaded', async () => {
    const result = await runAction(updateOrderForOdsAction, {
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

    expect(result.state.form.orderForOds).toEqual(true);
  });

  it('should set state.form.orderForOds false if state.form.partyType is Petitioner', async () => {
    const result = await runAction(updateOrderForOdsAction, {
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

    expect(result.state.form.orderForOds).toEqual(false);
  });

  it('should set state.form.orderForOds false if state.form.partyType is Corporation and an ownership disclosure file has been uploaded', async () => {
    const result = await runAction(updateOrderForOdsAction, {
      modules: {
        presenter,
      },
      props: { key: 'ownershipDisclosureFile' },
      state: {
        form: {
          ownershipDisclosureFile: 'the file!',
          partyType: PARTY_TYPES.corporation,
        },
      },
    });

    expect(result.state.form.orderForOds).toEqual(false);
  });

  it('should not update orderForOds if props.key is not partyType or ownershipDisclosureFile', async () => {
    const result = await runAction(updateOrderForOdsAction, {
      modules: {
        presenter,
      },
      props: { key: 'anotherField' },
      state: {
        form: {
          orderForOds: false,
          partyType: PARTY_TYPES.corporation,
        },
      },
    });

    expect(result.state.form.orderForOds).toEqual(false);
  });
});
