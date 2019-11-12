import { COURT_ISSUED_EVENT_CODES } from '../../../../shared/src/business/entities/Document';
import { addCourtIssuedDocketEntryNonstandardHelper as addCourtIssuedDocketEntryNonstandardHelperComputed } from './addCourtIssuedDocketEntryNonstandardHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  constants: {
    COURT_ISSUED_EVENT_CODES,
  },
  form: {},
};

const addCourtIssuedDocketEntryNonstandardHelper = withAppContextDecorator(
  addCourtIssuedDocketEntryNonstandardHelperComputed,
);

describe('addCourtIssuedDocketEntryNonstandardHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns showFreeText = true when state.form.eventCode is O5 (scenario = Type A)', () => {
    let testState = { ...state, form: { eventCode: 'O5' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: false,
      showDocketNumbers: false,
      showFreeText: true,
      showJudge: false,
    });
  });

  it('returns showFreeText = true and showJudge = true when state.form.eventCode is OAJ (scenario = Type B)', () => {
    let testState = { ...state, form: { eventCode: 'OAJ' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: false,
      showDocketNumbers: false,
      showFreeText: true,
      showJudge: true,
    });
  });

  it('returns showDocketNumbers = true when state.form.eventCode is OAL (scenario = Type C)', () => {
    let testState = { ...state, form: { eventCode: 'OAL' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: false,
      showDocketNumbers: true,
      showFreeText: false,
      showJudge: false,
    });
  });

  it('returns showDate = true and showFreeText = true when state.form.eventCode is OAP (scenario = Type D)', () => {
    let testState = { ...state, form: { eventCode: 'OAP' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: true,
      showDocketNumbers: false,
      showFreeText: true,
      showJudge: false,
    });
  });

  it('returns showDate = true when state.form.eventCode is OFFX (scenario = Type E)', () => {
    let testState = { ...state, form: { eventCode: 'OFFX' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: true,
      showDocketNumbers: false,
      showFreeText: false,
      showJudge: false,
    });
  });
});
