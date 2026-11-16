import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateEditDocketEntryTitleAction } from './generateEditDocketEntryTitleAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateEditDocketEntryTitleAction', () => {
  const { generateExternalDocumentTitle } = applicationContext.getUtilities();

  presenter.providers.applicationContext = applicationContext;

  it('should set form.documentTitle to the generated title', async () => {
    generateExternalDocumentTitle.mockReturnValue(
      'Motion for Judgment on the Pleadings',
    );

    const { state } = await runAction(generateEditDocketEntryTitleAction, {
      modules: { presenter },
      state: {
        form: {
          category: 'Motion',
          documentTitle: 'Motion for [Free Text]',
          documentType: 'Motion for Judgment on the Pleadings',
        },
      },
    });

    expect(
      generateExternalDocumentTitle.mock.calls[0][1].documentMetadata,
    ).toMatchObject({
      category: 'Motion',
      documentType: 'Motion for Judgment on the Pleadings',
    });
    expect(state.form.documentTitle).toEqual(
      'Motion for Judgment on the Pleadings',
    );
  });

  it('should keep the existing form.documentTitle when a title cannot be generated', async () => {
    generateExternalDocumentTitle.mockReturnValue(undefined);

    const { state } = await runAction(generateEditDocketEntryTitleAction, {
      modules: { presenter },
      state: {
        form: {
          documentTitle: 'Notice of Receipt of Petition',
          documentType: 'Notice of Receipt of Petition',
          eventCode: 'NOTR',
        },
      },
    });

    expect(state.form.documentTitle).toEqual('Notice of Receipt of Petition');
  });

  it('should set form.secondaryDocument.documentTitle to the generated secondary title', async () => {
    generateExternalDocumentTitle
      .mockReturnValueOnce('Motion for Leave to File Brief')
      .mockReturnValueOnce('Brief');

    const { state } = await runAction(generateEditDocketEntryTitleAction, {
      modules: { presenter },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Leave to File',
          secondaryDocument: {
            category: 'Miscellaneous',
            documentType: 'Brief',
          },
        },
      },
    });

    expect(
      generateExternalDocumentTitle.mock.calls[1][1].documentMetadata,
    ).toMatchObject({ category: 'Miscellaneous', documentType: 'Brief' });
    expect(state.form.documentTitle).toEqual('Motion for Leave to File Brief');
    expect(state.form.secondaryDocument.documentTitle).toEqual('Brief');
  });

  it('should keep the existing form.secondaryDocument.documentTitle when a secondary title cannot be generated', async () => {
    generateExternalDocumentTitle
      .mockReturnValueOnce('Motion for Leave to File Brief')
      .mockReturnValueOnce(undefined);

    const { state } = await runAction(generateEditDocketEntryTitleAction, {
      modules: { presenter },
      state: {
        form: {
          category: 'Motion',
          documentType: 'Motion for Leave to File',
          secondaryDocument: {
            documentTitle: 'Existing Secondary Title',
            documentType: 'Brief',
          },
        },
      },
    });

    expect(state.form.secondaryDocument.documentTitle).toEqual(
      'Existing Secondary Title',
    );
  });

  it('should not generate a secondary title when there is no secondary document', async () => {
    generateExternalDocumentTitle.mockReturnValue('Answer');

    await runAction(generateEditDocketEntryTitleAction, {
      modules: { presenter },
      state: {
        form: {
          category: 'Answer',
          documentType: 'Answer',
        },
      },
    });

    expect(generateExternalDocumentTitle).toHaveBeenCalledTimes(1);
  });
});
