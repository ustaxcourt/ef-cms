import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentContentsAction } from './getDocumentContentsAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentContentsAction', () => {
  const mockDocketEntryId = '77ec46cd-c657-4558-ba13-9696a4a3d9b0';
  const mockDocumentContentsId = '7a44aadd-5db1-42a3-bd0d-4142758fe895';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getDocumentContentsForDocketEntryInteractor.mockReturnValue({
        documentContents: 'a content',
        richText: 'some text',
      });
  });

  it('makes a call to getDocumentContentsForDocketEntryInteractor when props.docketEntryIdToEdit is defined and the associated docketEntry has a documentContentsId', async () => {
    await runAction(getDocumentContentsAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              documentContentsId: mockDocumentContentsId,
            },
          ],
        },
        docketEntryIdToEdit: mockDocketEntryId,
      },
    });
    expect(
      applicationContext.getUseCases()
        .getDocumentContentsForDocketEntryInteractor.mock.calls[0][1],
    ).toMatchObject({
      documentContentsId: mockDocumentContentsId,
    });
  });

  it('does not make a call to getDocumentContentsAction when props.docketEntryIdToEdit is undefined', async () => {
    await runAction(getDocumentContentsAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              documentContentsId: mockDocumentContentsId,
            },
          ],
        },
      },
    });
    expect(
      applicationContext.getUseCases()
        .getDocumentContentsForDocketEntryInteractor,
    ).not.toHaveBeenCalled();
  });

  it('returns documentContents and richText as props', async () => {
    const { output } = await runAction(getDocumentContentsAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              documentContentsId: mockDocumentContentsId,
            },
          ],
        },
        docketEntryIdToEdit: mockDocketEntryId,
      },
    });
    expect(output).toEqual({
      documentContents: 'a content',
      richText: 'some text',
    });
  });
});
