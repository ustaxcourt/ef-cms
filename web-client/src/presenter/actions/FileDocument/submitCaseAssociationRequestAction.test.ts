import { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { privatePractitionerUser } from '@shared/test/mockUsers';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';

describe('submitCaseAssociationRequestAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

  it("should call submitCaseAssociationRequestInteractor when the document's event code allows for the user to be immediately associated with the case", async () => {
    const eventCodeAllowingImmediateAssociation =
      PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.filter(
        item => item.allowImmediateAssociation,
      )[0].eventCode;

    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: { primaryDocumentId: applicationContext.getUniqueId() },
      },
      state: {
        caseDetail: {},
        form: {
          eventCode: eventCodeAllowingImmediateAssociation,
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor,
    ).toHaveBeenCalledTimes(1);
  });

  it("should call submitPendingCaseAssociationRequest when the document's event code does not allow for the user to be immediately associated with the case", async () => {
    const eventCodeNotAllowingImmediateAssociation =
      PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.filter(
        item => !item.allowImmediateAssociation,
      )[0].eventCode;

    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: { primaryDocumentId: applicationContext.getUniqueId() },
      },
      state: {
        caseDetail: {},
        form: {
          eventCode: eventCodeNotAllowingImmediateAssociation,
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .submitPendingCaseAssociationRequestInteractor.mock.calls.length,
    ).toEqual(1);
  });

  it('should return the docketEntryId of the uploaded document as documentsFiled.primaryDocumentId', async () => {
    const { output } = await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      props: {
        documentsFiled: { primaryDocumentId: applicationContext.getUniqueId() },
      },
      state: {
        caseDetail: {},
        form: {
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.documentsFiled.primaryDocumentId).toBeDefined();
  });
});
