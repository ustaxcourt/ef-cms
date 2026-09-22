import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CaseListRowExternal } from './CaseListRowExternal';
import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';
import { TAssociatedCaseFormatted } from '@web-client/presenter/computeds/Dashboard/externalUserCasesHelper';

jest.mock('@web-client/ustc-ui/Responsive/Responsive', () => ({
  NonPhone: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Phone: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

type PayButtonProps = {
  'data-testid'?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

describe('CaseListRowExternal filing fee payment control', () => {
  const initMyCasesFilingFeePaymentSequence = jest.fn();

  const unpaidCase = {
    caseTitle: 'Test v. Commissioner',
    consolidatedCases: undefined,
    consolidatedIconTooltipText: '',
    createdAtFormatted: '01/01/24',
    docketNumber: '101-24',
    formattedStatus: 'New',
    inConsolidatedGroup: false,
    isLeadCase: false,
    isRequestingUserAssociated: true,
    petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    status: 'New',
  } as TAssociatedCaseFormatted;

  const renderMarkup = (
    overrides: {
      enablePaymentPortalIntegration?: boolean;
      formattedCase?: TAssociatedCaseFormatted;
    } = {},
  ): string => {
    return renderToStaticMarkup(
      <table>
        <tbody>
          <CaseListRowExternal
            enablePaymentPortalIntegration={
              overrides.enablePaymentPortalIntegration ?? true
            }
            formattedCase={overrides.formattedCase ?? unpaidCase}
            initMyCasesFilingFeePaymentSequence={
              initMyCasesFilingFeePaymentSequence
            }
            isNestedCase={false}
            showCaseStatus={false}
            showCaseStatusInfoSequence={jest.fn()}
            showFilingFee
          />
        </tbody>
      </table>,
    );
  };

  const collectPayButtons = (
    node: React.ReactNode,
    buttons: Array<React.ReactElement<PayButtonProps>> = [],
  ): Array<React.ReactElement<PayButtonProps>> => {
    if (!node || typeof node === 'string' || typeof node === 'number') {
      return buttons;
    }

    if (Array.isArray(node)) {
      node.forEach(child => collectPayButtons(child, buttons));
      return buttons;
    }

    if (!React.isValidElement<PayButtonProps>(node)) {
      return buttons;
    }

    if (node.props['data-testid'] === 'pay-filing-fee-button') {
      buttons.push(node);
    }

    if (
      typeof node.type === 'function' &&
      node.type.name === 'FilingFeeStatus'
    ) {
      const rendered = (node.type as (props: unknown) => React.ReactNode)(
        node.props,
      );
      collectPayButtons(rendered, buttons);
      return buttons;
    }

    collectPayButtons(node.props.children, buttons);
    return buttons;
  };

  beforeEach(() => {
    initMyCasesFilingFeePaymentSequence.mockClear();
  });

  it('should not render Pay now when the payment portal feature flag is off', () => {
    const markup = renderMarkup({ enablePaymentPortalIntegration: false });

    expect(markup).not.toContain('pay-filing-fee-button');
    expect(markup).toContain(PAYMENT_STATUS.UNPAID);
  });

  it('should not render Pay now when the filing fee is paid', () => {
    const markup = renderMarkup({
      formattedCase: {
        ...unpaidCase,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
    });

    expect(markup).not.toContain('pay-filing-fee-button');
    expect(markup).toContain(PAYMENT_STATUS.PAID);
  });

  it('should not render Pay now when the filing fee is waived', () => {
    const markup = renderMarkup({
      formattedCase: {
        ...unpaidCase,
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      },
    });

    expect(markup).not.toContain('pay-filing-fee-button');
    expect(markup).toContain(PAYMENT_STATUS.WAIVED);
  });

  it('should not render Pay now when the user is not associated with the case', () => {
    const markup = renderMarkup({
      formattedCase: {
        ...unpaidCase,
        isRequestingUserAssociated: false,
      },
    });

    expect(markup).not.toContain('pay-filing-fee-button');
    expect(markup).toContain(PAYMENT_STATUS.UNPAID);
  });

  it('should render Pay now for unpaid cases and invoke the sequence from desktop and mobile controls', () => {
    const markup = renderMarkup();
    expect(markup.match(/pay-filing-fee-button/g)).toHaveLength(2);

    const payButtons = collectPayButtons(
      CaseListRowExternal({
        enablePaymentPortalIntegration: true,
        formattedCase: unpaidCase,
        initMyCasesFilingFeePaymentSequence,
        isNestedCase: false,
        showCaseStatus: false,
        showCaseStatusInfoSequence: jest.fn(),
        showFilingFee: true,
      }),
    );
    expect(payButtons).toHaveLength(2);

    payButtons.forEach(button => button.props.onClick?.());

    expect(initMyCasesFilingFeePaymentSequence).toHaveBeenCalledTimes(2);
    expect(initMyCasesFilingFeePaymentSequence).toHaveBeenCalledWith({
      caseDetail: unpaidCase,
    });
  });
});
