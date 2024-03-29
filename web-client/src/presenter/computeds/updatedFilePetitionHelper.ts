import { ClientApplicationContext } from '@web-client/applicationContext';
import { FILING_TYPES } from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { camelCase } from 'lodash';

type UpdatedFilePetitionHelper = {
  keyGenerator: (step: number, key: string) => string;
  filingOptions: string[];
};

export const updatedFilePetitionHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): UpdatedFilePetitionHelper => {
  const user = applicationContext.getCurrentUser();

  const keyGenerator = (step: number, key) => {
    return 'updatedFilePetitionStep' + (step + 1) + 'State.' + camelCase(key);
  };

  const filingOptions = FILING_TYPES[user.role];

  return {
    filingOptions,
    keyGenerator,
  };
};
