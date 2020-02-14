import { applicationContext } from '../../../applicationContext';
import { getInternalCaseCaptionForCaseInfoTabAction } from './getInternalCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getInternalCaseCaptionForCaseInfoTabAction', () => {
  const { Case, ContactFactory } = applicationContext.getEntityConstructors();

  it('should return just the respondent when party type has not been selected', async () => {
    const result = await runAction(getInternalCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'caseInfo',
      },
      state: {
        form: {
          partyType: '',
        },
      },
    });

    expect(result.output.caseCaption).toBe(` ${Case.CASE_CAPTION_POSTFIX}`);
  });

  it('should return a generated case caption when party type has been selected', async () => {
    const result = await runAction(getInternalCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'caseInfo',
      },
      state: {
        form: {
          contactPrimary: {
            name: 'Carl Fredricksen',
          },
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.output.caseCaption).toBe(
      `Carl Fredricksen, Petitioner ${Case.CASE_CAPTION_POSTFIX}`,
    );
  });

  it('should not return a generated case caption when party type has been selected but the prop is not caseInfo', async () => {
    const result = await runAction(getInternalCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      props: {
        tab: 'parties',
      },
      state: {
        form: {
          contactPrimary: {
            name: 'Carl Fredricksen',
          },
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.output).toBeUndefined();
  });
});
