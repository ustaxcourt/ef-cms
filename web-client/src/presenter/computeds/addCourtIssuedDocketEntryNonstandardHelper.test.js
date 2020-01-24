import { Document } from '../../../../shared/src/business/entities/Document';
import { addCourtIssuedDocketEntryNonstandardHelper as addCourtIssuedDocketEntryNonstandardHelperComputed } from './addCourtIssuedDocketEntryNonstandardHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  constants: {
    COURT_ISSUED_EVENT_CODES: Document.COURT_ISSUED_EVENT_CODES,
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

  it('returns showFreeText = true when state.form.eventCode is O (scenario = Type A)', () => {
    let testState = { ...state, form: { eventCode: 'O' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: false,
      showDocketNumbers: false,
      showFreeText: true,
      showJudge: false,
      showTrialLocation: false,
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
      showTrialLocation: false,
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
      showTrialLocation: false,
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
      showTrialLocation: false,
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
      showTrialLocation: false,
    });
  });

  it('returns showJudge = true and showTrialLocation = true when state.form.eventCode is FTRL (scenario = Type F)', () => {
    let testState = { ...state, form: { eventCode: 'FTRL' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: false,
      showDocketNumbers: false,
      showFreeText: false,
      showJudge: true,
      showTrialLocation: true,
    });
  });

  it('returns showDate = true and showTrialLocation = true when state.form.eventCode is NTD (scenario = Type G)', () => {
    let testState = { ...state, form: { eventCode: 'NTD' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      showDate: true,
      showDocketNumbers: false,
      showFreeText: false,
      showJudge: false,
      showTrialLocation: true,
    });
  });

  it('returns freeTextLabel for an order if the selected eventCode is O', () => {
    let testState = { ...state, form: { eventCode: 'O' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      freeTextLabel: 'What is this order for?',
    });
  });

  it('returns freeTextLabel for a notice if the selected eventCode is NOT', () => {
    let testState = { ...state, form: { eventCode: 'NOT' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      freeTextLabel: 'What is this notice for?',
    });
  });

  it('returns default freeTextLabel if the selected eventCode is not NOT or O', () => {
    let testState = { ...state, form: { eventCode: 'WRIT' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      freeTextLabel: 'Enter description',
    });
  });
});
