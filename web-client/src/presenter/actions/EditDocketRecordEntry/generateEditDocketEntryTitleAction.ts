import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Generates document titles when editing a docket entry's metadata.
 *
 * Unlike generateTitleAction, the existing title is kept when a title cannot be
 * generated (e.g. Notice of Receipt of Petition or other entries without a
 * category), so saving an edit never clears a docket entry's title.
 */
export const generateEditDocketEntryTitleAction = ({
  applicationContext,
  get,
  store,
}: ActionProps): void => {
  const documentMetadata = get(state.form);

  const documentTitle = applicationContext
    .getUtilities()
    .generateExternalDocumentTitle(applicationContext, {
      documentMetadata,
    });

  if (documentTitle) {
    store.set(state.form.documentTitle, documentTitle);
  }

  if (!isEmpty(documentMetadata.secondaryDocument)) {
    const secondaryDocumentTitle = applicationContext
      .getUtilities()
      .generateExternalDocumentTitle(applicationContext, {
        documentMetadata: documentMetadata.secondaryDocument,
      });

    if (secondaryDocumentTitle) {
      store.set(
        state.form.secondaryDocument.documentTitle,
        secondaryDocumentTitle,
      );
    }
  }
};
