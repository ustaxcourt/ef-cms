import { createApplicationContext } from '@web-api/applicationContext';
import { geocodeAddressBatch } from '@web-api/business/useCases/geocoding/getAddressGeocode';
import { getDbReader } from '@web-api/database';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parse } from 'csv-parse/sync';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function selectGeodataFields(record: any) {
  const { userId, docketNumber, address, city, state, postalCode } = record;
  return { userId: userId.toString(), docketNumber, address, city, state, postalCode };
}

function escapeCsv(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value).replace(/"/g, '""');
}

function writeTempCsv(rows: any[]) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'geocode-'));
  const filePath = path.join(tmpDir, 'addresses.csv');
  const header = ['id', 'street', 'city', 'state', 'zip'].join(',') + '\n';
  const body = rows
    .map(record => {
      const { userId, address, city, state, postalCode } = selectGeodataFields(record);
      return `${userId},"${escapeCsv(address)}","${escapeCsv(city)}","${escapeCsv(state)}","${escapeCsv(postalCode)}"`;
    })
    .join('\n');
  fs.writeFileSync(filePath, header + body, 'utf8');
  return filePath;
}

async function applyUpdates(results: any[]) {
  await getDbReader(async db => {
    for (const record of results) {
      const { userId, docketNumber, matched, lat, lng } = record;
      const update = matched && lat != null && lng != null
        ? { lat, lng, geodataMatch: true }
        : { geodataMatch: false };

      let query = db.updateTable('dwUserContact').set(update).where('userId', '=', userId);
      if (docketNumber) {
        query = query.where('docketNumber', '=', docketNumber);
      }
      await query.execute();
    }
  });
}

async function processCsv(csvPath: string, batchSize: number, delayMs: number, applicationContext: any) {
  const csvRaw = fs.readFileSync(csvPath, 'utf8');
  const records = parse(csvRaw, { columns: true, skip_empty_lines: true });
  for (let index = 0; index < records.length; index += batchSize) {
    const batch = records.slice(index, index + batchSize);
    const tmpPath = writeTempCsv(batch);
    const tmpDir = path.dirname(tmpPath);
    let results: Array<{ id: string; lat: number | null; lng: number | null; matched: boolean }> = [];
    try {
      const batchBuffer = fs.readFileSync(tmpPath);
      results = await geocodeAddressBatch(applicationContext, batchBuffer);
    } catch (err: any) {
      console.error('batch request failed', err.message ?? err);
      await sleep(delayMs);
      continue;
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    const updates = results.map(({ id, lat, lng, matched }) => ({ userId: id, lat, lng, matched }));
    await applyUpdates(updates);
    await sleep(delayMs);
  }
}

export async function backfillUserGeocodes({
  csvPath,
  batchSize,
  delayMs,
  applicationContext,
}: {
  csvPath: string;
  batchSize: number;
  delayMs: number;
  applicationContext?: any;
}): Promise<void> {
  if (!csvPath) {
    throw new Error('Missing csvPath');
  }
  const context = applicationContext ?? createApplicationContext({});
  await processCsv(csvPath, batchSize, delayMs, context);
}
