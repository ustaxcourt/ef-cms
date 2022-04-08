import { isDocumentRequiringAppendedForm } from './isDocumentRequiringAppendedForm';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isDocumentRequiringAppendedForm', () => {
  let noStub;
  let proceedStub;

  beforeAll(() => {
    noStub = jest.fn();
    proceedStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      proceed: proceedStub,
    };
  });
});
