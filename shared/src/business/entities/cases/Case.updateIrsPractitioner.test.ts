import { Case } from './Case';
import { IrsPractitioner } from '../IrsPractitioner';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('updateIrsPractitioner', () => {
  let myCase;

  beforeEach(() => {
    myCase = new Case(
      {
        ...MOCK_CASE,
        irsPractitioners: [{ name: 'Christopher Walken', userId: '123' }],
        privatePractitioners: [{ name: 'Slim Shady', userId: '567' }],
      },
      { applicationContext },
    );
  });

  it('updates the given irsPractitioner on the case', () => {
    const caseToVerify = new Case(
      {
        irsPractitioners: [
          new IrsPractitioner({
            email: 'irspractitioner@example.com',
            userId: 'irsPractitioner',
          }),
        ],
      },
      {
        applicationContext,
      },
    );

    expect(caseToVerify.irsPractitioners).not.toBeNull();
    expect(caseToVerify.irsPractitioners[0].email).toEqual(
      'irspractitioner@example.com',
    );

    caseToVerify.updateIrsPractitioner({
      email: 'irspractitioner@example.com',
      userId: 'irsPractitioner',
    });
    expect(caseToVerify.irsPractitioners[0].email).toEqual(
      'irspractitioner@example.com',
    );
  });

  it('updates a matching IRS practitioner found on the case', () => {
    expect(myCase.irsPractitioners.length).toEqual(1);

    myCase.updateIrsPractitioner({
      name: 'Christopher Running',
      userId: '123',
    });

    expect(myCase.irsPractitioners.length).toEqual(1);
    expect(myCase.irsPractitioners[0]).toMatchObject({
      name: 'Christopher Running',
    });
  });
  it('updates nothing when provided object does not match', () => {
    myCase.updateIrsPractitioner({
      name: 'Slow Jog',
      userId: '000-111-222',
    });

    expect(myCase.irsPractitioners.length).toEqual(1);
    expect(myCase.irsPractitioners[0]).toMatchObject({
      name: 'Christopher Walken',
    });
  });
});
