import { CerebralTest } from 'cerebral/test';
import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';

describe('generateInternalCaseCaptionSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    test = CerebralTest(presenter);
  });
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
      'Carl Fredricksen, Petitioner',
    );
  });
});
