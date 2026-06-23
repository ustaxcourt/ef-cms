import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ALLOWLIST_FEATURE_FLAGS,
  PAYMENT_PORTAL_FEE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  InitPaymentRequest,
  InitPaymentResponse,
} from '@ustaxcourt/payment-portal';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

export const initPaymentInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<InitPaymentResponse> => {
  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const isPaymentPortalIntegrationEnabled =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.ENABLE_PAYMENT_PORTAL_INTEGRATION.key];

  if (!isPaymentPortalIntegrationEnabled) {
    throw new NotFoundError(undefined);
  }

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PAY_PETITION_FILING_FEE)) {
    throw new UnauthorizedError(
      `Invalid User attempting to init payment for docket Number: ${docketNumber}`,
    );
  }

  const currentCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const currentCaseEntity = new Case(currentCase, { authorizedUser });

  if (currentCaseEntity.petitionPaymentStatus === 'Paid') {
    throw new InvalidRequest(
      `The filing fee for ${docketNumber} has already been paid.`,
    );
  }

  const transactionReferenceId =
    currentCaseEntity.petitionPaymentTransactionReferenceId ||
    applicationContext.getUniqueId();

  const data: InitPaymentRequest = {
    transactionReferenceId,
    fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
    urlSuccess: 'https://client.app/success',
    urlCancel: 'https://client.app/cancel',
    metadata: {
      docketNumber,
    },
  };

  const initResponse = await applicationContext
    .getPaymentPortalClient()
    .initPayment(applicationContext, data);

  if (!currentCaseEntity.petitionPaymentTransactionReferenceId) {
    currentCaseEntity.petitionPaymentTransactionReferenceId =
      transactionReferenceId;

    await updateCaseAndAssociations({
      authorizedUser,
      caseToUpdate: currentCaseEntity,
    });
  }

  return initResponse;
};
