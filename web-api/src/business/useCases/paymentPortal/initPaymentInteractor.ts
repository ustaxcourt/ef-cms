import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ALLOWLIST_FEATURE_FLAGS,
  PAYMENT_PORTAL_FEE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { InitPaymentRequest } from '@ustaxcourt/payment-portal';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export const initPayment = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ paymentRedirect: string }> => {
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

  // TODO: check petitionPaymentStatus before letting user initiate a filing fee payment

  const transactionReferenceId =
    currentCaseEntity.petitionPaymentTransactionReferenceId ||
    applicationContext.getUniqueId();

  let domain;
  if (applicationContext.environment.stage !== 'local')
    domain = `https://app.${process.env.EFCMS_DOMAIN}`;
  else domain = 'http://localhost:1234';

  const data: InitPaymentRequest = {
    transactionReferenceId,
    fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
    urlSuccess: `${domain}/payment-success/${docketNumber}`,
    urlCancel: `${domain}/payment-cancel/${docketNumber}`,
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
  }

  currentCaseEntity.petitionPaymentToken = initResponse.token;

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: currentCaseEntity,
  });

  return { paymentRedirect: initResponse.paymentRedirect };
};

export const initPaymentInteractor = withLocking(
  initPayment,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
