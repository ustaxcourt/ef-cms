import {
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';

describe('submitCaseAssociationRequestAction', () => {
  presenter.providers.applicationContext = applicationContext;

  applicationContext.getCurrentUser.mockReturnValue(
    new User({
      email: 'practitioner1@example.com',
      name: 'richard',
      role: ROLES.privatePractitioner,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    }),
  );

  const testCaseDetail = {
    consolidatedCases: [{ docketNumber: '101-23' }, { docketNumber: '102-23' }],
    docketNumber: '101-23',
  };

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
          fileAcrossConsolidatedGroup: undefined,
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor
        .mock.calls[0][1],
    ).toEqual(expect.objectContaining({ consolidatedCasesDocketNumbers: [] }));
  });

  it("should call submitCaseAssociationRequestInteractor with an array of consolidated case numbers when the document's event code allows for the user to be immediately associated with the case", async () => {
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
        caseDetail: testCaseDetail,
        form: {
          eventCode: eventCodeAllowingImmediateAssociation,
          fileAcrossConsolidatedGroup: true,
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().submitCaseAssociationRequestInteractor
        .mock.calls[0][1],
    ).toEqual(
      expect.objectContaining({
        consolidatedCasesDocketNumbers: ['101-23', '102-23'],
      }),
    );
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
