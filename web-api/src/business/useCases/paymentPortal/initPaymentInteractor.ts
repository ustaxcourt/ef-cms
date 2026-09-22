import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ALLOWLIST_FEATURE_FLAGS,
  PAYMENT_FILING_FEE_ORIGIN,
  PAYMENT_PORTAL_FEE_TYPES,
  PAYMENT_STATUS,
  type PaymentFilingFeeOrigin,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { InitPaymentRequest } from '@ustaxcourt/payment-portal';
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
import {
  Case,
  userIsDirectlyAssociated,
} from '@shared/business/entities/cases/Case';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export type FilingFeePaymentReturnOrigin = PaymentFilingFeeOrigin;

function buildPaymentReturnQuery(
  params: Record<string, string | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function formatFilingFeeReturnPageQuery(
  filingFeeReturnPage?: number,
): string | undefined {
  if (
    filingFeeReturnPage === undefined ||
    !Number.isFinite(filingFeeReturnPage) ||
    filingFeeReturnPage <= 1
  ) {
    return undefined;
  }

  return String(Math.floor(filingFeeReturnPage));
}

export const initPayment = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    filingFeeReturnOrigin,
    filingFeeReturnPage,
  }: {
    docketNumber: string;
    filingFeeReturnOrigin?: FilingFeePaymentReturnOrigin;
    filingFeeReturnPage?: number;
  },
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

  if (currentCaseEntity.petitionPaymentStatus !== PAYMENT_STATUS.UNPAID) {
    throw new InvalidRequest(
      `Cannot initiate filing fee payment for ${docketNumber} with status ${currentCaseEntity.petitionPaymentStatus}`,
    );
  }

  const transactionReferenceId =
    currentCaseEntity.petitionPaymentTransactionReferenceId ||
    applicationContext.getUniqueId();

  let domain;
  if (applicationContext.environment.stage !== 'local')
    domain = `https://app.${process.env.EFCMS_DOMAIN}`;
  else domain = 'http://localhost:1234';

  const returnPageQuery = formatFilingFeeReturnPageQuery(filingFeeReturnPage);

  const data: InitPaymentRequest = {
    transactionReferenceId,
    fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
    urlSuccess: `${domain}/payment-success${buildPaymentReturnQuery({
      docketNumber,
      page: returnPageQuery,
    })}`,
    urlCancel: `${domain}/payment-cancel${buildPaymentReturnQuery({
      docketNumber,
      origin:
        filingFeeReturnOrigin === PAYMENT_FILING_FEE_ORIGIN.DASHBOARD
          ? PAYMENT_FILING_FEE_ORIGIN.DASHBOARD
          : undefined,
      page:
        filingFeeReturnOrigin === PAYMENT_FILING_FEE_ORIGIN.DASHBOARD
          ? returnPageQuery
          : undefined,
    })}`,
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
