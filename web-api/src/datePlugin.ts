import type {
  KyselyPlugin,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
} from 'kysely';

const ISO_DATE_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export class IsoDatePlugin implements KyselyPlugin {
  /** No-op: leave your query AST untouched */
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return args.node;
  }

  // Post-query hook: convert any ISO strings in rows to Dates
  // eslint-disable-next-line @typescript-eslint/require-await
  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    const { result } = args;

    result.rows = result.rows.map(row => this._convertRow(row));

    return result;
  }

  private _convertRow(row: UnknownRow): UnknownRow {
    const out: UnknownRow = row;

    for (const key of Object.keys(row)) {
      const val = row[key];

      if (typeof val === 'string' && ISO_DATE_REGEX.test(val)) {
        // eslint-disable-next-line custom-rules-plugin/no-new-dates
        out[key] = new Date(val);
        console.log('new', out[key]);
      } else if (val !== null && typeof val === 'object') {
        // Recurse into nested objects/arrays
        out[key] = Array.isArray(val)
          ? (val as unknown[]).map(v =>
              v && typeof v === 'object'
                ? this._convertRow(v as UnknownRow)
                : v,
            )
          : this._convertRow(val as UnknownRow);
      } else {
        out[key] = val;
      }
    }

    return out;
  }
}
