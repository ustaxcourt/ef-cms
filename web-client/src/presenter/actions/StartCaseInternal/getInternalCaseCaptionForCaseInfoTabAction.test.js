import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext.js';
import { getInternalCaseCaptionForCaseInfoTabAction } from './getInternalCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getInternalCaseCaptionForCaseInfoTabAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const { PARTY_TYPES } = applicationContext.getConstants();

  it('should return an empty string when party type has not been selected', async () => {
    const result = await runAction(getInternalCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          partyType: '',
        },
      },
    });

    expect(result.output.caseCaption).toBe('');
  });

  it('should return a generated case caption when party type has been selected', async () => {
    const result = await runAction(getInternalCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            name: 'Carl Fredricksen',
          },
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.output.caseCaption).toBe('Carl Fredricksen, Petitioner');
  });
});
