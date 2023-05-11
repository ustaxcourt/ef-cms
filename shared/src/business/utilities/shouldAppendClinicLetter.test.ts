import { Case } from '../entities/cases/Case';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../test/mockTrial';
import { applicationContext } from '../test/createTestApplicationContext';
import { getClinicLetterKey } from './getClinicLetterKey';
import { shouldAppendClinicLetter } from './shouldAppendClinicLetter';

jest.mock('./getClinicLetterKey');

describe('shouldAppendClinicLetter', () => {
  const clinicLetterKey = 'clinic-letter-key';

  const caseEntityWithoutPractitioners = new Case(
    {
      ...MOCK_CASE,
    },
    {
      applicationContext,
    },
  );

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);

    getClinicLetterKey.mockReturnValue(clinicLetterKey);
  });

  it('should return appendClinicLetter as true when petitioner is pro se and when a clinic letter exists for the trial location', async () => {
    const result = await shouldAppendClinicLetter({
      applicationContext,
      caseEntity: caseEntityWithoutPractitioners,
      procedureType: 'Small',
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(result.appendClinicLetter).toBe(true);
    expect(result.clinicLetterKey).toBe(clinicLetterKey);
  });

  it('should return appendClinicLetter as false when petitioner is pro se but a clinic letter does not exist for the trial location', async () => {
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValueOnce(false);

    const result = await shouldAppendClinicLetter({
      applicationContext,
      caseEntity: caseEntityWithoutPractitioners,
      procedureType: 'Small',
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(result.appendClinicLetter).toBe(false);
    expect(result.clinicLetterKey).toBe(clinicLetterKey);
  });

  it('should return appendClinicLetter as false and clinicLetterKey as undefined when petitioner is not pro se', async () => {
    const caseEntityWithPractitoner = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            barNumber: 'PP123',
            representing: ['7805d1ab-18d0-43ec-bafb-654e83405416'],
          },
        ],
      },
      {
        applicationContext,
      },
    );

    const result = await shouldAppendClinicLetter({
      applicationContext,
      caseEntity: caseEntityWithPractitoner,
      procedureType: 'Small',
      trialSession: MOCK_TRIAL_INPERSON,
    });

    expect(result.appendClinicLetter).toBe(false);
    expect(result.clinicLetterKey).toBe(undefined);
  });
});
