import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateCaseAssociationTitleAction } from './generateCaseAssociationTitleAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

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
        caseDetail: { contactPrimary: { name: 'Daphne' } },
        contactSecondary: { name: 'Hastings' },
        form: {},
      },
    });

    expect(result.state.form.documentTitle).toEqual(mockDocumentTitle);
  });

  it('should set state.form.supportingDocumentMetadata.documentTitle when state.form.supportingDocumentMetadata is not empty', async () => {
    applicationContext
      .getUseCases()
      .generateDocumentTitleInteractor.mockReturnValue(
        mockSupportingDocumentTitle,
      );

    const result = await runAction(generateCaseAssociationTitleAction, {
      modules: {
        presenter,
      },
      props: { isAssociated: false },
      state: {
        caseDetail: { contactPrimary: { name: 'Daphne' } },
        contactSecondary: { name: 'Hastings' },
        form: { supportingDocumentMetadata: { name: 'Hello' } },
      },
    });

    expect(result.state.form.supportingDocumentMetadata.documentTitle).toEqual(
      mockSupportingDocumentTitle,
    );
  });
});
