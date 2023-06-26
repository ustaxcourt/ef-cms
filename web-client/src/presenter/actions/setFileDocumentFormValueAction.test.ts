import { runAction } from '@web-client/presenter/test.cerebral';
import { setFileDocumentFormValueAction } from './setFileDocumentFormValueAction';

describe('setFileDocumentFormValueAction', () => {
  it('sets state.form[props.key] to props.value', async () => {
    const { state } = await runAction(setFileDocumentFormValueAction, {
      props: {
        key: 'testKey',
        value: 'test value',
      },
    });

    expect(state.form['testKey']).toEqual('test value');
  });

  it('sets state.form.previousDocument to the document associated with the id in props.value', async () => {
    const { state } = await runAction(setFileDocumentFormValueAction, {
      props: {
        key: 'previousDocument',
        value: '234',
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123',
              documentTitle: 'Test Document Title One',
            },
            {
              docketEntryId: '234',
              documentTitle: 'Test Document Title Two',
            },
          ],
        },
      },
    });

    expect(state.form.previousDocument).toEqual({
      docketEntryId: '234',
      documentTitle: 'Test Document Title Two',
    });
  });

  it('sets state.form.secondaryDocument.previousDocument to the document associated with the id in props.value', async () => {
    const { state } = await runAction(setFileDocumentFormValueAction, {
      props: {
        key: 'secondaryDocument.previousDocument',
        value: '234',
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123',
              documentTitle: 'Test Document Title One',
            },
            {
              docketEntryId: '234',
              documentTitle: 'Test Document Title Two',
            },
          ],
        },
      },
    });

    expect(state.form.secondaryDocument.previousDocument).toEqual({
      docketEntryId: '234',
      documentTitle: 'Test Document Title Two',
    });
  });

  it('unsets state.form[props.key] if props.value is empty', async () => {
    const { state } = await runAction(setFileDocumentFormValueAction, {
      props: {
        key: 'testKey',
        value: '',
      },
      state: {
        form: {
          testKey: 'Yahtzee!',
        },
      },
    });

    expect(state.form.testKey).toBeUndefined();
  });
});
