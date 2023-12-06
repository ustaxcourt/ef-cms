import {
  gatherRecords,
  getCsvOptions,
  sortableTitle,
  whitespaceCleanup,
} from './helpers';

describe('tools/helpers', () => {
  const MOCK_RECORDS = [
    {
      firstName: 'Jeff',
      id: '123',
      lastName: 'Buckley',
      type: 'musician',
    },
    {
      firstName: 'Stevie Ray',
      id: '234',
      lastName: 'Vaughn',
      type: 'musician',
    },
  ];

  describe('gatherRecords', () => {
    it('returns an array with the given columns and streamed records', () => {
      let mockReadIndex = 0;
      const mockReadStream = () => {
        if (mockReadIndex < MOCK_RECORDS.length) {
          const record = MOCK_RECORDS[mockReadIndex];
          mockReadIndex++;
          return record;
        } else {
          return false;
        }
      };

      const ctx = {
        read: mockReadStream, // crudely mocks out a readable stream (see above)
      };

      let output = [];
      const columns = ['firstName', 'lastName', 'type']; // omits id

      gatherRecords(columns, output).call(ctx);

      expect(output).toEqual([
        { firstName: 'Jeff', lastName: 'Buckley', type: 'musician' },
        { firstName: 'Stevie Ray', lastName: 'Vaughn', type: 'musician' },
      ]);
    });
  });

  describe('getCsvOptions', () => {
    it('returns a set of default csv options along with the given columns', () => {
      const options = getCsvOptions(['column1', 'column2']);
      expect(options).toEqual({
        columns: ['column1', 'column2'],
        delimiter: ',',
        from_line: 2,
        relax_column_count: true,
        skip_empty_lines: true,
        trim: true,
      });
    });

    it('returns the default set of csv options with overrides, if given', () => {
      const options = getCsvOptions(['column1', 'column2'], {
        delimiter: ';',
        from_line: 1,
        trim: false,
      });
      expect(options).toEqual({
        columns: ['column1', 'column2'],
        delimiter: ';', // overridden
        from_line: 1, // overridden
        relax_column_count: true,
        skip_empty_lines: true,
        trim: false, // overridden
      });
    });
  });

  describe('sortableTitle', () => {
    it('normalizes the given title into a sortable value', () => {
      const title = `


                  Title With Whitespace `; // contains spaces, line breaks, and tabs

      expect(sortableTitle(title)).toEqual('title with whitespace');
    });
  });

  describe('whitespaceCleanup', () => {
    it('removes new lines from text', () => {
      const text = `
      
      some text`;

      expect(whitespaceCleanup(text)).toEqual('some text');
    });

    it('removes tabs from text', () => {
      const text = '    some text';

      expect(whitespaceCleanup(text)).toEqual('some text');
    });

    it('removes whitespace from text', () => {
      const text = ' some text ';

      expect(whitespaceCleanup(text)).toEqual('some text');
    });
  });
});
