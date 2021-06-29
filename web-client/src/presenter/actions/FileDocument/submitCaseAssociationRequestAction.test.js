import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';

describe('submitCaseAssociationRequestAction', () => {
  const { submitCaseAssociationRequestInteractor } =
    applicationContext.getUseCases();
  const { submitPendingCaseAssociationRequestInteractor } =
    applicationContext.getUseCases();

  presenter.providers.applicationContext = applicationContext;

  applicationContext.getCurrentUser.mockReturnValue(
    new User({
      email: 'practitioner1@example.com',
      name: 'richard',
      role: ROLES.privatePractitioner,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    }),
  );

  it('should call submitCaseAssociationRequest', async () => {
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
          documentType: 'Entry of Appearance',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitCaseAssociationRequestInteractor.mock.calls.length).toEqual(1);
  });

  it('should call submitPendingCaseAssociationRequest', async () => {
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
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(
      submitPendingCaseAssociationRequestInteractor.mock.calls.length,
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
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(output.documentsFiled.primaryDocumentId).toBeDefined();
  });
});
