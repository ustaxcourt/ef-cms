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
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import {
  ProcessPaymentRequest,
  ProcessPaymentResponse,
} from 'node_modules/@ustaxcourt/payment-portal/dist';

export const processPayment = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<ProcessPaymentResponse> => {
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
      `Invalid User attempting to process payment for docket Number: ${docketNumber}`,
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

  if (!currentCaseEntity.petitionPaymentToken) {
    throw new InvalidRequest(
      `${docketNumber} has no active payment portal transaction`,
    );
  }

  const data: ProcessPaymentRequest = {
    token: currentCaseEntity.petitionPaymentToken,
  };

  const processResponse = await applicationContext
    .getPaymentPortalClient()
    .processPayment(applicationContext, data);

  // TODO: set other petition payment fields to mark case's filing fee as paid if payment was successful

  delete currentCaseEntity.petitionPaymentToken;

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: currentCaseEntity,
  });

  return processResponse;
};

export const processPaymentInteractor = withLocking(
  processPayment,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
