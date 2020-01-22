import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setEditDocketEntryMetaModalStateAction } from './setEditDocketEntryMetaModalStateAction';

describe('setEditDocketEntryMetaModalStateAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should update the modal form state from state and given docket record index', async () => {
    const result = await runAction(setEditDocketEntryMetaModalStateAction, {
      modules: { presenter },
      props: { index: 1 },
      state: {
        caseDetail: {
          caseId: '123',
          docketRecord: [{ description: 'something', index: 1 }],
        },
      },
    });

    expect(result.state.modal.form).toEqual({
      description: 'something',
      index: 1,
    });
    expect(result.state.modal.caseId).toEqual('123');
    expect(result.state.modal.docketRecordIndex).toEqual(1);
  });

  it('should also update document-related fields if a docket record has an associated document', async () => {
    const result = await runAction(setEditDocketEntryMetaModalStateAction, {
      modules: { presenter },
      props: { index: 1 },
      state: {
        caseDetail: {
          caseId: '123',
          docketRecord: [
            { description: 'something', documentId: 'abc-123', index: 1 },
          ],
          documents: [
            {
              documentId: 'abc-123',
              servedAt: '2019-09-30',
              servedParties: ['Guy Fieri', 'Bill Burr', 'Joe Rogan'],
            },
          ],
        },
      },
    });

    expect(result.state.modal.form.servedAt).toEqual('2019-09-30');
    expect(result.state.modal.form.servedParties).toEqual(
      'Guy Fieri,Bill Burr,Joe Rogan',
    );
  });
});
