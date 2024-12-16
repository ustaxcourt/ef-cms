import { appendFileSync, existsSync, unlinkSync } from 'fs';

const compileOutput = ({
  columns,
  rows,
}: {
  columns: { header: string; key: string }[];
  rows: { [k: string]: any }[];
}): string => {
  const headers = columns.map(c => c.header);
  const keys = columns.map(c => c.key);
  let output = `"${headers.join('","')}"`;
  for (const row of rows) {
    const values: string[] = [];
    for (const key of keys) {
      const value = row[key] || '';
      values.push(`${value}`);
    }
    output += `\n"${values.join('","')}"`;
  }
  return output;
};

const writeFile = ({
  contents,
  filename,
}: {
  contents: string;
  filename: string;
}): void => {
  if (existsSync(filename)) {
    unlinkSync(filename);
  }
  appendFileSync(filename, contents);
};

export const generateCsv = ({
  columns,
  filename,
  rows,
}: {
  columns: { header: string; key: string }[];
  filename: string;
  rows: { [k: string]: any }[];
}): void => {
  const contents = compileOutput({ columns, rows });
  writeFile({ contents, filename });
};
