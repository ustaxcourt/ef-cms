import { efcmsCaseDeadlineIndex } from '../../../../elasticsearch/efcms-case-deadline-mappings';
import { efcmsCaseIndex } from '../../../../elasticsearch/efcms-case-mappings';
import { efcmsDocketEntryIndex } from '../../../../elasticsearch/efcms-docket-entry-mappings';
import { efcmsMessageIndex } from '../../../../elasticsearch/efcms-message-mappings';
import { efcmsUserIndex } from '../../../../elasticsearch/efcms-user-mappings';
import { efcmsWorkItemIndex } from '../../../../elasticsearch/efcms-work-item-mappings';
import { updateIndex } from './getIndexName';

describe('updateIndex', () => {
  it('does not transform a non-string index', () => {
    const mockSearchParameters = { index: ['efcms-case'] };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index).toEqual(['efcms-case']);
  });
  it('does not transform a string that is not in the list of aliases', () => {
    const mockSearchParameters = { index: '.kibana_1' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index).toBe('.kibana_1');
  });
  it('transforms efcms-case into the correct index name', () => {
    const mockSearchParameters = { index: 'efcms-case' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index.match(/-/g)!.length).toEqual(2);
    expect(mockSearchParameters.index).not.toEqual('efcms-case');
    expect(mockSearchParameters.index).toEqual(efcmsCaseIndex);
  });
  it('transforms efcms-case-deadline into the correct index name', () => {
    const mockSearchParameters = { index: 'efcms-case-deadline' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index.match(/-/g)!.length).toEqual(3);
    expect(mockSearchParameters.index).not.toEqual('efcms-case-deadline');
    expect(mockSearchParameters.index).toEqual(efcmsCaseDeadlineIndex);
  });
  it('transforms efcms-docket-entry into the correct index name', () => {
    const mockSearchParameters = { index: 'efcms-docket-entry' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index.match(/-/g)!.length).toEqual(3);
    expect(mockSearchParameters.index).not.toEqual('efcms-docket-entry');
    expect(mockSearchParameters.index).toEqual(efcmsDocketEntryIndex);
  });
  it('transforms efcms-message into the correct index name', () => {
    const mockSearchParameters = { index: 'efcms-message' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index.match(/-/g)!.length).toEqual(2);
    expect(mockSearchParameters.index).not.toEqual('efcms-message');
    expect(mockSearchParameters.index).toEqual(efcmsMessageIndex);
  });
  it('transforms efcms-user into the correct index name', () => {
    const mockSearchParameters = { index: 'efcms-user' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index.match(/-/g)!.length).toEqual(2);
    expect(mockSearchParameters.index).not.toEqual('efcms-user');
    expect(mockSearchParameters.index).toEqual(efcmsUserIndex);
  });
  it('transforms efcms-work-item into the correct index name', () => {
    const mockSearchParameters = { index: 'efcms-work-item' };
    updateIndex({ searchParameters: mockSearchParameters });
    expect(mockSearchParameters.index.match(/-/g)!.length).toEqual(3);
    expect(mockSearchParameters.index).not.toEqual('efcms-work-item');
    expect(mockSearchParameters.index).toEqual(efcmsWorkItemIndex);
  });
});
