import { migrateItems } from './0001-add-associated-judge-id';

describe('migrateItems', () => {
  it('should add associatedJudgeId to case records when there is an associated judge', () => {
    const items = [
      {
        name: 'Colvin',
        pk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        role: 'judge',
        sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      {
        associatedJudge: 'Colvin',
        pk: 'case|445-22',
        sk: 'case|445-22',
      },
    ];
    const results = migrateItems(items);
    expect(results.length).toEqual(2);
    expect(results[1]).toEqual({
      associatedJudge: 'Colvin',
      associatedJudgeId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      pk: 'case|445-22',
      sk: 'case|445-22',
    });
  });

  it('should not add associatedJudgeId when the associated judge is set to Chief Judge', () => {
    const items = [
      {
        name: 'Chief Judge',
        pk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        role: 'judge',
        sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        userId: 'Chief Judge Id',
      },
      {
        associatedJudge: 'Chief Judge',
        pk: 'case|445-22',
        sk: 'case|445-22',
      },
    ];
    const results = migrateItems(items);
    expect(results.length).toEqual(2);
    expect(results[1]).toEqual({
      associatedJudge: 'Chief Judge',
      pk: 'case|445-22',
      sk: 'case|445-22',
    });
  });

  it('should not add associatedJudgeId if the record is not a case record', () => {
    const items = [
      {
        name: 'Colvin',
        pk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        role: 'judge',
        sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      {
        associatedJudge: 'Colvin',
        pk: 'case|445-22',
        sk: 'case-worksheet|445-22',
      },
    ];
    const results = migrateItems(items);
    expect(results.length).toEqual(2);
    expect(results[1]).toEqual({
      associatedJudge: 'Colvin',
      pk: 'case|445-22',
      sk: 'case-worksheet|445-22',
    });
  });

  it('should not add associatedJudgeId if the record is a case record with no associatedjudge defined', () => {
    const items = [
      {
        name: 'Colvin',
        pk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        role: 'judge',
        sk: 'user|dabbad00-18d0-43ec-bafb-654e83405416',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      {
        associatedJudge: undefined,
        pk: 'case|445-22',
        sk: 'case|445-22',
      },
    ];
    const results = migrateItems(items);
    expect(results.length).toEqual(2);
    expect(results[1]).toEqual({
      associatedJudge: undefined,
      pk: 'case|445-22',
      sk: 'case|445-22',
    });
  });
});
