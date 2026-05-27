// FIXME: this file is a scratch test for GritQL plugins - DELETE BEFORE COMMIT

// --- Test: no-dates-new.grit should flag these ---
const d1 = new Date();
const d2 = new Date('2024-01-01');
const d3 = new Date(2024, 0, 1);

// --- Test: no-dates-call.grit should flag these ---
const d4 = Date();
const d5 = Date('2024-01-01');

// --- Test: no-dates-member.grit should flag these ---
const now = Date.now();
const parsed = Date.parse('2024-01-01');
const utc = Date.UTC(2024, 0, 1);

// --- Test: no-test-identifier.grit should flag these ---
const test = 'bad variable name';
let test2 = 42; // 'test2' should NOT be flagged (only exact 'test')

// --- Test: no-warning-comments.grit should flag these ---
// FIXME: resolve this
// XXX: bad code here
// xxx: also bad

// --- These should NOT be flagged ---
import { DateHandler } from './DateHandler'; // DateHandler is fine
const testName = 'something'; // 'testName' is NOT 'test'
const testResult = foo.test(); // property access should not trigger no-test-identifier
const _test = 1; // underscore-prefixed should not trigger (not exact 'test')
