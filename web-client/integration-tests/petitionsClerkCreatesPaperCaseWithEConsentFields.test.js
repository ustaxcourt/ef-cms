import { contactPrimaryFromState, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
const { faker } = require('@faker-js/faker');

describe('petitions clerk creates paper case with E-consent fields', () => {
  const cerebralTest = setupTest();

  const validEmail = `${faker.internet.userName()}_no_error@example.com`;

  let petitionerContactId;

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  //create paper case with invalid email
  //submit and see validation errors

  //edit and enter valid email, check e consent box

  //submit
  //verify things on revew screen

  //edit
  //change email add
  //submit
  //review and serve

  //go to case detail, parties infor
  //verify paper petition email exists

  //verify case from state has e access
  //login as docketlclerk
  //seal address
  //verify things

  //view case as unauthed user, verify the fields dont show

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile, {
    paperPetitionEmail: 'myotheremail@example.com',
    paperPetitionEmail: 'myotheremail@example.com',
  });
});
