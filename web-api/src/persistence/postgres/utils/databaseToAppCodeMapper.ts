import {
  ReplaceNullWithUndefined,
  transformNullToUndefined,
} from '@web-api/persistence/postgres/utils/transformNullToUndefined';

/**
 * Converts database entity data into an application-specific format.
 *
 * This mapper transforms a subset of database records (XKysely data) along with any additional properties
 * into a corresponding subset of application entity data (RawX data). For example, it converts:
 *
 *   { CaseKysely data, ...extra } → { RawCase data, ...extra }
 *
 * @example
 * const mapper = new DatabaseToEntityMapper({ keyRenameMap, transformMap });
 * const rawData = mapper.transform(data);
 *
 * @param keyRenameMap - An object that maps database keys (e.g., "caption") to application keys (e.g., "caseCaption").
 * @param transformMap - An object that maps keys to transformation functions. Each function receives the original value,
 *                       along with the full record if needed, and returns the transformed value.
 */
export class DatabaseToAppCodeMapper<
  KR extends Record<string, string>,
  TM extends Record<string, (value: any, record: any) => any>,
> {
  private keyRenameMap;
  private transformMap;
  constructor({
    keyRenameMap,
    transformMap,
  }: {
    keyRenameMap: KR;
    transformMap: TM;
  }) {
    this.keyRenameMap = keyRenameMap;
    this.transformMap = transformMap;
  }

  transform<T extends object>(data: T) {
    // Dynamically generate the correct type based on the keyRenameMap and transformMap passed into the class
    type Transformed<T> = {
      [K in keyof T as K extends keyof KR ? KR[K] : K]: K extends keyof TM
        ? ReturnType<TM[K]>
        : T[K];
    };

    const result = { ...data } as any;

    // Apply transformation functions from the transform map
    for (const key in this.transformMap) {
      if (key in result) {
        result[key] = this.transformMap[key](result[key], result);
      }
    }

    // Rename keys according to the key rename map
    for (const oldKey in this.keyRenameMap) {
      if (oldKey in result) {
        const newKey = this.keyRenameMap[oldKey];
        result[newKey] = result[oldKey];
        delete result[oldKey];
      }
    }

    // Convert null to undefined by default
    return transformNullToUndefined(
      result as Transformed<T>,
    ) as ReplaceNullWithUndefined<Transformed<T>>;
  }
}
