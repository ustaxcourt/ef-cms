import {
  type TriageRow,
  formatDuplicateObjects,
  formatTriageTable,
  settleWithFullRead,
  summarizeTriage,
} from './pdf-triage.helpers';
import type { CrossReferenceIntegrity } from './crossReference.helpers';
import type { DuplicateReport } from './pdf-doctor.helpers';

const integrity = (
  overrides: Partial<CrossReferenceIntegrity> = {},
): CrossReferenceIntegrity => ({
  coverageComplete: true,
  displacedObjectNumber: null,
  entryCount: 9,
  overDeclaredBy: 0,
  probes: [],
  reason: 'a reason from the section',
  residue: [],
  size: 9,
  status: 'VALID',
  ...overrides,
});

const report = (
  duplicates: DuplicateReport['duplicates'] = [],
): DuplicateReport => ({ duplicates, objectsBefore: 9, unresolved: 0 });

const duplicate = (objectNumber: number, objectType: string | null) => ({
  generations: [0, 1],
  keptGeneration: 1,
  liveGenerations: [1],
  objectNumber,
  objectType,
});

describe('formatDuplicateObjects', () => {
  it('pairs each object number with its declared type', () => {
    expect(
      formatDuplicateObjects(
        report([duplicate(7, 'Catalog'), duplicate(9, null)]),
      ),
    ).toBe('7:/Catalog 9:untyped');
  });

  it('renders an empty survey as an empty field', () => {
    expect(formatDuplicateObjects(report())).toBe('');
  });
});

describe('settleWithFullRead', () => {
  // A full read enumerates objects and does not depend on byte offsets, so it
  // is the stronger evidence and decides a candidate either way.
  it('promotes a candidate the full read proves duplicated', () => {
    const outcome = settleWithFullRead(
      integrity({ status: 'RESIDUE' }),
      report([duplicate(7, 'Catalog')]),
    );

    expect(outcome.status).toBe('DUPLICATED');
    expect(outcome.duplicates).toBe('7:/Catalog');
    expect(outcome.reason).toContain('1 duplicated object number');
  });

  it('clears a candidate the full read finds sound', () => {
    const outcome = settleWithFullRead(
      integrity({ status: 'RESIDUE' }),
      report(),
    );

    expect(outcome.status).toBe('VALID');
    expect(outcome.duplicates).toBe('');
  });

  it('confirms a duplicate the section already proved', () => {
    const outcome = settleWithFullRead(
      integrity({ status: 'DUPLICATED' }),
      report([duplicate(7, 'Catalog')]),
    );

    expect(outcome.status).toBe('DUPLICATED');
  });

  // pdf-lib recovers a broken section by rescanning, so it can load a document
  // whose stored bytes are misattributed and report no duplicate. The stored
  // file is still what a reader opens, so the accusation has to stand.
  it('keeps the accusation when a full read disagrees with the section', () => {
    const outcome = settleWithFullRead(
      integrity({ status: 'DUPLICATED' }),
      report(),
    );

    expect(outcome.status).toBe('DUPLICATED');
    expect(outcome.reason).toContain('pdf-lib rebuilt the section on load');
  });

  it('leaves a sound document alone', () => {
    const outcome = settleWithFullRead(integrity(), report());

    expect(outcome.status).toBe('VALID');
    expect(outcome.reason).toBe('a reason from the section');
  });

  it('passes an unjudgeable document through untouched', () => {
    const outcome = settleWithFullRead(
      integrity({ reason: 'incrementally updated', status: 'INDETERMINATE' }),
      report(),
    );

    expect(outcome.status).toBe('INDETERMINATE');
  });

  // A file too damaged for pdf-lib to parse is evidence, not an absence of it.
  it('keeps the section verdict when the document will not load', () => {
    const outcome = settleWithFullRead(
      integrity({ reason: 'rows displaced', status: 'DUPLICATED' }),
      null,
    );

    expect(outcome.status).toBe('DUPLICATED');
    expect(outcome.reason).toContain('could not load');
    expect(outcome.reason).toContain('rows displaced');
  });

  it('reports a document that will not load and looked sound as unreadable', () => {
    const outcome = settleWithFullRead(integrity(), null);

    expect(outcome.status).toBe('UNREADABLE');
  });
});

describe('summarizeTriage', () => {
  const row = (file: string, status: TriageRow['status']): TriageRow => ({
    duplicates: '',
    file,
    reason: '',
    status,
  });

  it('orders the worst verdict first', () => {
    expect(
      summarizeTriage([
        row('a.pdf', 'VALID'),
        row('b.pdf', 'DUPLICATED'),
        row('c.pdf', 'VALID'),
        row('d.pdf', 'RESIDUE'),
        row('e.pdf', 'DUPLICATED'),
      ]),
    ).toEqual([
      { count: 2, status: 'DUPLICATED' },
      { count: 1, status: 'RESIDUE' },
      { count: 2, status: 'VALID' },
    ]);
  });

  it('summarizes an empty run', () => {
    expect(summarizeTriage([])).toEqual([]);
  });
});

describe('formatTriageTable', () => {
  it('aligns the columns to the longest filename', () => {
    const lines = formatTriageTable([
      {
        duplicates: '7:/Catalog',
        file: 'a-very-long-name.pdf',
        reason: '',
        status: 'DUPLICATED',
      },
      { duplicates: '', file: 'b.pdf', reason: '', status: 'VALID' },
    ]);

    expect(lines[0]).toMatch(/^file {17}\s+verdict/);
    expect(lines[1]).toBe('a-very-long-name.pdf  DUPLICATED  7:/Catalog');
    expect(lines[2]).toBe('b.pdf                 VALID       -');
  });
});
