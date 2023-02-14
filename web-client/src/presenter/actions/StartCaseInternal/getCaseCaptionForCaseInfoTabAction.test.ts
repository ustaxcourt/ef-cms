import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseCaptionForCaseInfoTabAction } from './getCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getCaseCaptionForCaseInfoTabAction', () => {
  const { CASE_CAPTION_POSTFIX, PARTY_TYPES } =
    applicationContext.getConstants();

  presenter.providers.applicationContext = applicationContext;

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

  it('should call getCaseCaption with form.contactPrimary instead of the contactPrimary in form.petitioners', async () => {
    await runAction(getCaseCaptionForCaseInfoTabAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          contactPrimary: {
            name: 'Test Updated Name',
          },
          partyType: PARTY_TYPES.petitioner,
          petitioners: [
            {
              isContactPrimary: true,
              name: 'Not the right name',
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUtilities().getCaseCaption.mock.calls[0][0],
    ).toMatchObject({
      contactPrimary: {
        name: 'Test Updated Name',
      },
      petitioners: [],
    });
  });
});
