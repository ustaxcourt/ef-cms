import { applicationContext } from '../../../applicationContext';
import { getCaseCaptionForCaseInfoTabAction } from './getCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getCaseCaptionForCaseInfoTabAction', () => {
  const { Case, ContactFactory } = applicationContext.getEntityConstructors();

  it('should return an empty string when the party type has not been selected', async () => {
    const result = await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
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
        caseDetail: {
          contactPrimary: {
            name: 'Guy Fieri',
          },
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.output.caseCaption).toBe('Guy Fieri, Petitioner');
    expect(
      result.output.caseCaption.includes(Case.CASE_CAPTION_POSTFIX),
    ).toBeFalsy();
  });
});
