import { addPetitionerToCaseAction } from './addPetitionerToCaseAction';
import { runAction } from 'cerebral/test';

describe('addPetitionerToCaseAction', () => {
  const mockContact = {
    address1: '123 cat lane',
    name: 'Selena Kyle',
  };

  it('sets state.alertSuccess from props.alertSuccess', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      state: {
        caseDetail: {
          docketNumebr: '999-99',
        },
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.alertSuccess).toEqual({
      message: `Petitioner ${mockContact.name} has been added to case.`,
    });
  });

  it('returns caseInfo as props.tab', async () => {
    const result = await runAction(addPetitionerToCaseAction, {
      state: {
        caseDetail: {
          docketNumebr: '999-99',
        },
        form: {
          contact: mockContact,
        },
      },
    });

    expect(result.output.tab).toBe('caseInfo');
  });
});
