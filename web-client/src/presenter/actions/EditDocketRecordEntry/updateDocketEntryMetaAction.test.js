import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDocketEntryMetaAction } from './updateDocketEntryMetaAction';

describe('updateDocketEntryMetaAction', () => {
  let updateDocketEntryMetaInteractorStub;
  let docketEntryMetaParam;

  beforeEach(() => {
    updateDocketEntryMetaInteractorStub = jest.fn(
      ({ docketEntryMeta }) => (docketEntryMetaParam = docketEntryMeta),
    );

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        updateDocketEntryMetaInteractor: updateDocketEntryMetaInteractorStub,
      }),
    };
  });

  it('updates the docket entry by calling the interactor', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      props: {
        caseId: '123-45',
        docketRecordEntry: {
          servedParties: [],
        },
        docketRecordIndex: 1,
      },
    });

    expect(updateDocketEntryMetaInteractorStub).toHaveBeenCalled();
  });

  it('converts the servedParties string into an array', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      props: {
        caseId: '123-45',
        docketRecordEntry: {
          servedParties: 'One,Two,Three',
        },
        docketRecordIndex: 1,
      },
    });

    expect(docketEntryMetaParam.servedParties).toEqual(['One', 'Two', 'Three']);
  });

  it('converts the servedParties string into an array, stripping white space from array items', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      props: {
        caseId: '123-45',
        docketRecordEntry: {
          servedParties: 'One , Two , Three',
        },
        docketRecordIndex: 1,
      },
    });

    expect(docketEntryMetaParam.servedParties).toEqual(['One', 'Two', 'Three']);
  });

  it('does no operation the servedParties value if it is not a string', async () => {
    await runAction(updateDocketEntryMetaAction, {
      modules: { presenter },
      props: {
        caseId: '123-45',
        docketRecordEntry: {
          servedParties: undefined,
        },
        docketRecordIndex: 1,
      },
    });

    expect(docketEntryMetaParam.servedParties).toEqual(undefined);
  });
});
