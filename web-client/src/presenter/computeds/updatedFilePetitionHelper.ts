import { ClientApplicationContext } from '@web-client/applicationContext';
import { FILING_TYPES } from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { camelCase } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

type UpdatedFilePetitionHelper = {
  keyGenerator: (step: number, key: string) => string;
  filingOptions: string[];
  businessFieldNames?: {
    primary: string;
    secondary: string;
    isOptional?: boolean;
  };
};

export const updatedFilePetitionHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): UpdatedFilePetitionHelper => {
  const user = applicationContext.getCurrentUser();

  const businessType = get(state.form.businessType);

  const keyGenerator = (step: number, key) => {
    return 'updatedFilePetitionStep' + (step + 1) + 'State.' + camelCase(key);
  };

  const filingOptions = FILING_TYPES[user.role];
  const businessFieldNames = getBusinessFieldNames(businessType);

  return {
    businessFieldNames,
    filingOptions,
    keyGenerator,
  };
};

function getBusinessFieldNames(businessType) {
  if (businessType === 'Corporation') {
    return {
      isOptional: true,
      primary: 'Business name',
      secondary: 'In care of',
    };
  }
  if (businessType === 'Partnership (as the Tax Matters Partner)') {
    return {
      primary: 'Partnership name',
      secondary: 'Tax Matters Partner name',
    };
  }
  if (
    businessType === 'Partnership (as a partner other than Tax Matters Partner)'
  ) {
    return {
      primary: 'Business name',
      secondary: 'Name of partner (other than TMP)',
    };
  }
  if (
    businessType === 'Partnership (as a partnership representative under BBA)'
  ) {
    return {
      primary: 'Business name',
      secondary: 'Partnership representative name',
    };
  }
}
