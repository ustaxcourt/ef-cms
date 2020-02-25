import { applicationContext } from '../../../applicationContext';
import { getCaseCaptionForCaseInfoTabAction } from './getCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getCaseCaptionForCaseInfoTabAction', () => {
  const { Case, ContactFactory } = applicationContext.getEntityConstructors();

  it('should return just the postfix when party type has not been selected', async () => {
    const result = await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'partyInfo',
      },
      state: {
        caseDetail: {
          partyType: '',
        },
      },
    });

    expect(result.output.caseCaption).toBe(` ${Case.CASE_CAPTION_POSTFIX}`);
  });

  it('should return a generated case caption when party type has been selected', async () => {
    const result = await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'partyInfo',
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

    expect(result.output.caseCaption).toBe(
      `Guy Fieri, Petitioner ${Case.CASE_CAPTION_POSTFIX}`,
    );
  });

  it('should not return a generated case caption when party type has been selected but the prop is not partyInfo', async () => {
    const result = await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'parties',
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

    expect(result.output).toBeUndefined();
  });
});
