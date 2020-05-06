import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocketEntryFormForDocketEditAction } from './setDocketEntryFormForDocketEditAction';

describe('setDocketEntryFormForDocketEditAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it("sets the given document's edit state on form.state", async () => {
    const editState = {
      caseId: '123',
      date: '2020-01-01T05:00:00.000Z',
      documentId: '123-abc-123-abc',
      eventCode: 'OPP',
      lodged: true,
      testKey: 'testValue',
    };

    const result = await runAction(setDocketEntryFormForDocketEditAction, {
      modules: { presenter },
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
          ],
          documents: [
            {
              documentId: '123-abc-123-abc',
              eventCode: 'OPP',
              lodged: true,
            },
            { documentId: '321-cba-321-cba' },
          ],
        },
        form: {},
      },
    });

    const expectedResult = {
      caseId: '123',
      date: '2020-01-01T05:00:00.000Z',
      day: '1',
      documentId: '123-abc-123-abc',
      eventCode: 'OPP',
      lodged: true,
      month: '1',
      testKey: 'testValue',
      year: '2020',
    };

    expect(result.state.form).toEqual(expectedResult);
    expect(result.output.docketEntry).toEqual(expectedResult);
  });

  it("does not set the given document's edit state on form.state if the docketRecord editState does not contain a caseId", async () => {
    const editState = {
      documentId: '123-abc-123-abc',
      eventCode: 'OPP',
      lodged: true,
      testKey: 'testValue',
    };

    const result = await runAction(setDocketEntryFormForDocketEditAction, {
      modules: { presenter },
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
          ],
          documents: [
            {
              documentId: '123-abc-123-abc',
              eventCode: 'OPP',
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
      eventCode: 'OPP',
      lodged: true,
    };

    expect(result.state.form).toEqual(expectedResult);
    expect(result.output.docketEntry).toEqual(expectedResult);
  });

  it('sets an empty object on form.state if no document matches the given documentId', async () => {
    const result = await runAction(setDocketEntryFormForDocketEditAction, {
      modules: { presenter },
      props: {
        documentId: '111-aaa-111-aaa',
      },
      state: {
        caseDetail: {
          caseId: '123',
          docketRecord: [],
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
