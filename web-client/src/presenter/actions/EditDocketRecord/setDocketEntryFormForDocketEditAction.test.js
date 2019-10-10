import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDocketEntryFormForDocketEditAction } from './setDocketEntryFormForDocketEditAction';

presenter.providers.applicationContext = applicationContext;

describe('setDocketEntryFormForDocketEditAction', () => {
  it("sets the given document's edit state on form.state", async () => {
    const result = await runAction(setDocketEntryFormForDocketEditAction, {
      props: {
        documentId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          caseId: '123',
          documents: [
            {
              documentId: '123-abc-123-abc',
              lodged: true,
            },
            { documentId: '321-cba-321-cba' },
          ],
        },
        form: {},
      },
    });

    const expectedResult = {
      documentId: '123-abc-123-abc',
      lodged: true,
    };

    expect(result.state.form).toEqual(expectedResult);
    expect(result.output.docketEntry).toEqual(expectedResult);
  });

  it('sets an empty object on form.state if no document matches the given documentId', async () => {
    const result = await runAction(setDocketEntryFormForDocketEditAction, {
      props: {
        documentId: '111-aaa-111-aaa',
      },
      state: {
        caseDetail: {
          caseId: '123',
          documents: [
            {
              documentId: '123-abc-123-abc',
            },
            {
              documentId: '321-cba-321-cba',
            },
          ],
        },
        form: {},
      },
    });

    const expectedResult = {
      lodged: false,
    };

    expect(result.state.form).toEqual(expectedResult);
    expect(result.output.docketEntry).toEqual(expectedResult);
  });
});
