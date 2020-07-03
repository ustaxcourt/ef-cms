import { addCourtIssuedDocketEntryNonstandardHelper as addCourtIssuedDocketEntryNonstandardHelperComputed } from './addCourtIssuedDocketEntryNonstandardHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
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
      showDateFirst: false,
      showDateLast: false,
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
      showDateFirst: false,
      showDateLast: false,
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
      showDateFirst: false,
      showDateLast: false,
      showDocketNumbers: true,
      showFreeText: false,
      showJudge: false,
      showTrialLocation: false,
    });
  });

  it('returns showDateFirst = true and showFreeText = true when state.form.eventCode is OAP (scenario = Type D)', () => {
    let testState = { ...state, form: { eventCode: 'OAP' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      dateLabel: 'Date',
      showDateFirst: true,
      showDateLast: false,
      showDocketNumbers: false,
      showFreeText: true,
      showJudge: false,
      showTrialLocation: false,
    });
  });

  it('returns showDateFirst = true when state.form.eventCode is OFFX (scenario = Type E)', () => {
    let testState = { ...state, form: { eventCode: 'OFFX' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      dateLabel: 'Date',
      showDateFirst: true,
      showDateLast: false,
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
      showDateFirst: false,
      showDateLast: false,
      showDocketNumbers: false,
      showFreeText: false,
      showJudge: true,
      showTrialLocation: true,
    });
  });

  it('returns showDateFirst = true and showTrialLocation = true when state.form.eventCode is NDT (scenario = Type G)', () => {
    let testState = { ...state, form: { eventCode: 'NDT' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      dateLabel: 'Date',
      showDateFirst: true,
      showDateLast: false,
      showDocketNumbers: false,
      showFreeText: false,
      showJudge: false,
      showTrialLocation: true,
    });
  });

  it('returns showDateLast = true and showFreeText = true when state.form.eventCode is TRAN (scenario = Type H)', () => {
    let testState = { ...state, form: { eventCode: 'TRAN' } };

    const result = runCompute(addCourtIssuedDocketEntryNonstandardHelper, {
      state: testState,
    });
    expect(result).toMatchObject({
      dateLabel: 'Date of trial/hearing',
      showDateFirst: false,
      showDateLast: true,
      showDocketNumbers: false,
      showFreeText: true,
      showJudge: false,
      showTrialLocation: false,
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
