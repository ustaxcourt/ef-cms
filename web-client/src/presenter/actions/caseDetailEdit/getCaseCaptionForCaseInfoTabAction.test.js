import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseCaptionForCaseInfoTabAction } from './getCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContextForClient;

describe('getCaseCaptionForCaseInfoTabAction', () => {
  const {
    CASE_CAPTION_POSTFIX,
    PARTY_TYPES,
  } = applicationContextForClient.getConstants();

  it('should return an empty string when the party type has not been selected', async () => {
    const result = await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          partyType: '',
        },
      },
    });
    // case caption should not, ever, contain the postfix "v. Commissioner..."
    // that would make it the case title.
    expect(result.output.caseCaption).toBe('');
  });

  it('should return a generated case caption WITHOUT the postfix when party type has been selected', async () => {
    const result = await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            name: 'Guy Fieri',
          },
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.output.caseCaption).toBe('Guy Fieri, Petitioner');
    expect(
      result.output.caseCaption.includes(CASE_CAPTION_POSTFIX),
    ).toBeFalsy();
  });
});
