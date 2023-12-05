import { CONTACT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateCaseAssociationTitleAction } from './generateCaseAssociationTitleAction';
import { presenter } from '../../presenter';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateCaseAssociationTitleAction', () => {
  const mockDocumentTitle = 'The Duke of Ferdinand';
  const mockSupportingDocumentTitle = 'The Duke of Hazzard';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .generateCaseAssociationDocumentTitleInteractor.mockReturnValue(
        mockDocumentTitle,
      );
  });

  it('should set state.form.documentTitle', async () => {
    const result = await runAction(generateCaseAssociationTitleAction, {
      modules: {
        presenter,
      },
      props: { isAssociated: false },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, name: 'Daphne' },
            { contactType: CONTACT_TYPES.secondary, name: 'Hastings' },
          ],
        },
        form: {},
      },
    });

    expect(result.state.form.documentTitle).toEqual(mockDocumentTitle);
  });

  it('should set state.form.supportingDocumentMetadata.documentTitle when state.form.supportingDocumentMetadata is not empty', async () => {
    applicationContext
      .getUtilities()
      .generateExternalDocumentTitle.mockReturnValue(
        mockSupportingDocumentTitle,
      );

    const result = await runAction(generateCaseAssociationTitleAction, {
      modules: {
        presenter,
      },
      props: { isAssociated: false },
      state: {
        caseDetail: {
          petitioners: [
            { contactType: CONTACT_TYPES.primary, name: 'Daphne' },
            { contactType: CONTACT_TYPES.secondary, name: 'Hastings' },
          ],
        },
        form: { supportingDocumentMetadata: { name: 'Hello' } },
      },
    });

    expect(result.state.form.supportingDocumentMetadata.documentTitle).toEqual(
      mockSupportingDocumentTitle,
    );
  });
});
