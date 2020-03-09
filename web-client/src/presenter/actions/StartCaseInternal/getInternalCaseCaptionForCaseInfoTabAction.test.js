import { applicationContext } from '../../../applicationContext';
import { getInternalCaseCaptionForCaseInfoTabAction } from './getInternalCaseCaptionForCaseInfoTabAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('getInternalCaseCaptionForCaseInfoTabAction', () => {
  const { ContactFactory } = applicationContext.getEntityConstructors();

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
          partyType: ContactFactory.PARTY_TYPES.petitioner,
        },
      },
    });

    expect(result.output.caseCaption).toBe('Carl Fredricksen, Petitioner');
  });
});
