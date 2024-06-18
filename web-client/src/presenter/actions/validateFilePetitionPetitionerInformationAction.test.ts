import {
  COUNTRY_TYPES,
  FILING_TYPES,
  PARTY_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/validateFilePetitionPetitionerInformationAction';

describe('validateFilePetitionPetitionerInformationAction', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the valid path when the data gathered step 2 passes validation', async () => {
    runAction(validateFilePetitionPetitionerInformationAction, {
      modules: {
        presenter,
      },
      props: {
        petitionerInformationAction: {
          countryType: COUNTRY_TYPES.DOMESTIC,
          filingType: FILING_TYPES[ROLES.petitioner][0],
          partyType: PARTY_TYPES.petitioner,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path the data gathered step 2 does not pass validation', async () => {
    runAction(validateFilePetitionPetitionerInformationAction, {
      modules: {
        presenter,
      },
      props: {
        petitionerInformationAction: {},
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});