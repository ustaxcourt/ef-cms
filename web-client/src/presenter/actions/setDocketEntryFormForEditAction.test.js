import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setDocketEntryFormForEditAction } from './setDocketEntryFormForEditAction';

presenter.providers.applicationContext = applicationContext;

const editState = {
  testKey: 'testValue',
};

describe('setDocketEntryFormForEditAction', () => {
  it("sets the given document's edit state on form.state", async () => {
    const result = await runAction(setDocketEntryFormForEditAction, {
      props: {
        documentId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          caseId: '123',
          docketRecord: [
            {
              documentId: '123-abc-123-abc',
              editState: JSON.stringify(editState),
            },
            { documentId: '321-cba-321-cba', editState: {} },
          ],
        },
        form: {},
      },
    });
    expect(result.state.form).toEqual(editState);
  });

  it('sets an empty object on form.state if no document matches the given documentId', async () => {
    const result = await runAction(setDocketEntryFormForEditAction, {
      props: {
        documentId: '111-aaa-111-aaa',
      },
      state: {
        caseDetail: {
          caseId: '123',
          docketRecord: [
            {
              documentId: '123-abc-123-abc',
              editState: JSON.stringify(editState),
            },
            {
              documentId: '321-cba-321-cba',
              editState: JSON.stringify(editState),
            },
          ],
        },
        form: {},
      },
    });
    expect(result.state.form).toEqual({});
  });
});
