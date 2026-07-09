import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  Case,
  userIsDirectlyAssociated,
} from '@shared/business/entities/cases/Case';
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  GetDetailsPathParams,
  GetDetailsResponse,
} from 'node_modules/@ustaxcourt/payment-portal/dist';

export const getTransactionDetailsInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<GetDetailsResponse> => {
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
      `Invalid User attempting to access payment details for docket Number: ${docketNumber}`,
    );
  }

  const currentCase = await getCaseByDocketNumber({
    docketNumber,
  });

  const currentCaseEntity = new Case(currentCase, { authorizedUser });

  if (
    !userIsDirectlyAssociated({
      aCase: currentCaseEntity,
      userId: authorizedUser.userId,
    })
  ) {
    throw new UnauthorizedError(
      `Invalid User attempting to init payment for docket Number: ${docketNumber}`,
    );
  }

  if (!currentCaseEntity.petitionPaymentTransactionReferenceId) {
    throw new NotFoundError(
      `No payment portal transaction has been initiated for ${docketNumber}`,
    );
  }

  const data: GetDetailsPathParams = {
    transactionReferenceId:
      currentCaseEntity.petitionPaymentTransactionReferenceId,
  };

  return await applicationContext
    .getPaymentPortalClient()
    .getTransactionDetails(applicationContext, data);
};
