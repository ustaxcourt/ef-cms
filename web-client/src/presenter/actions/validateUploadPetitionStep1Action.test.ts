import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadPetitionStep1Action } from '@web-client/presenter/actions/validateUploadPetitionStep1Action';

describe('validateUploadPetitionStep1Action', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the valid path when the data gathered for an autogenerated petition in step 1 passes validation', async () => {
    await runAction(validateUploadPetitionStep1Action, {
      modules: {
        presenter,
      },
      props: {
        step1Data: {
          petitionFacts: ['Fact goes here'],
          petitionReasons: ['Reason goes here'],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
      state: {
        form: {
          petitionFacts: ['Fact goes here'],
          petitionReasons: ['Reason goes here'],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the valid path when the data gathered for an user uploaded petition in step 1 passes validation', async () => {
    await runAction(validateUploadPetitionStep1Action, {
      modules: {
        presenter,
      },
      props: {
        step1Data: {
          petitionFacts: [''],
          petitionFile: {},
          petitionFileSize: 1,
          petitionReasons: [''],
          petitionRedactionAcknowledgement: true,
          petitionType: PETITION_TYPES.userUploaded,
        },
      },
      state: {
        form: {
          petitionFacts: [''],
          petitionFile: {},
          petitionFileSize: 1,
          petitionReasons: [''],
          petitionRedactionAcknowledgement: true,
          petitionType: PETITION_TYPES.userUploaded,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path when facts or reasons are empty', async () => {
    await runAction(validateUploadPetitionStep1Action, {
      modules: {
        presenter,
      },
      props: {
        step1Data: {
          petitionFacts: [''],
          petitionReasons: [''],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
      state: {
        form: {
          petitionFacts: [''],
          petitionReasons: [''],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });

  it('should filter out empty petition facts or reasons, except for the first one, and set them on state', async () => {
    const { state } = await runAction(validateUploadPetitionStep1Action, {
      modules: {
        presenter,
      },
      props: {
        step1Data: {
          petitionFacts: ['Fact goes here', '', 'Second fact here'],
          petitionReasons: [
            'Reason goes here',
            '',
            '',
            '',
            'Second reason here',
          ],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
      state: {
        form: {
          petitionFacts: ['Fact goes here', '', 'Second fact here'],
          petitionReasons: [
            'Reason goes here',
            '',
            '',
            '',
            'Second reason here',
          ],
          petitionType: PETITION_TYPES.autoGenerated,
        },
      },
    });
    expect(state.form).toEqual({
      petitionFacts: ['Fact goes here', 'Second fact here'],
      petitionReasons: ['Reason goes here', 'Second reason here'],
      petitionType: PETITION_TYPES.autoGenerated,
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });
});
