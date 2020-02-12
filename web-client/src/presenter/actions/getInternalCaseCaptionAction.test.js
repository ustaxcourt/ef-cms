import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { getInternalCaseCaptionAction } from './getInternalCaseCaptionAction';
import { runAction } from 'cerebral/test';

describe('getInternalCaseCaptionAction', () => {
  it('should return just the respondent when party type has not been selected', async () => {
    const result = await runAction(getInternalCaseCaptionAction, {
      state: {
        form: {
          partyType: '',
        },
      },
    });

    expect(result.output.caseCaption).toBe(` ${Case.CASE_CAPTION_POSTFIX}`);
  });

  it('should return a generated case caption when party type has been selected', async () => {
    const result = await runAction(getInternalCaseCaptionAction, {
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
});
