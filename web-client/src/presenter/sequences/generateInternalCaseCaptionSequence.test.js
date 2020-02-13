import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

presenter.providers.applicationContext = applicationContext;

let test = CerebralTest(presenter);

describe('generateInternalCaseCaptionSequence', () => {
  it('should create and set a case caption for the case', async () => {
    test.setState('form', {
      contactPrimary: {
        name: 'Carl Fredricksen',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });

    await test.runSequence('generateInternalCaseCaptionSequence', {
      tab: 'caseInfo',
    });

    expect(test.getState('form.caseCaption')).toBe(
      `Carl Fredricksen, Petitioner ${Case.CASE_CAPTION_POSTFIX}`,
    );
  });
});
