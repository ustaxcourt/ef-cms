# DevEfCms.WorkitemsApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiNotificationsGet**](WorkitemsApi.md#apiNotificationsGet) | **GET** /api/notifications | gets notifications such as unread item counts
[**caseDocumentsDocketNumberDocketEntryIdCoversheetPost**](WorkitemsApi.md#caseDocumentsDocketNumberDocketEntryIdCoversheetPost) | **POST** /case-documents/{docketNumber}/{docketEntryId}/coversheet | creates a coversheet and prepends it to the existing s3 document
[**caseDocumentsDocketNumberDocketEntryIdWorkItemsPost**](WorkitemsApi.md#caseDocumentsDocketNumberDocketEntryIdWorkItemsPost) | **POST** /case-documents/{docketNumber}/{docketEntryId}/work-items | creates a new work item and attaches it to the case document
[**sectionsSectionDocumentQcInboxGet**](WorkitemsApi.md#sectionsSectionDocumentQcInboxGet) | **GET** /sections/{section}/document-qc/inbox | get the section document qc inbox work items
[**sectionsSectionDocumentQcServedGet**](WorkitemsApi.md#sectionsSectionDocumentQcServedGet) | **GET** /sections/{section}/document-qc/served | get the section document qc served work items
[**sectionsSectionUsersGet**](WorkitemsApi.md#sectionsSectionUsersGet) | **GET** /sections/{section}/users | get all users in a section
[**usersInternalGet**](WorkitemsApi.md#usersInternalGet) | **GET** /users/internal | get all internal users
[**usersUserIdDocumentQcInboxGet**](WorkitemsApi.md#usersUserIdDocumentQcInboxGet) | **GET** /users/{userId}/document-qc/inbox | get the inbox items from the users document qc section
[**usersUserIdDocumentQcServedGet**](WorkitemsApi.md#usersUserIdDocumentQcServedGet) | **GET** /users/{userId}/document-qc/served | get the served items from the users document qc section
[**workItemsPut**](WorkitemsApi.md#workItemsPut) | **PUT** /work-items | assigns an assigneId to a list of work item ids
[**workItemsWorkItemIdAssigneePut**](WorkitemsApi.md#workItemsWorkItemIdAssigneePut) | **PUT** /work-items/{workItemId}/assignee | sets the assigneeId of the workitem to a new user
[**workItemsWorkItemIdCompletePut**](WorkitemsApi.md#workItemsWorkItemIdCompletePut) | **PUT** /work-items/{workItemId}/complete | marks the workitem complete
[**workItemsWorkItemIdGet**](WorkitemsApi.md#workItemsWorkItemIdGet) | **GET** /work-items/{workItemId} | get a workitem by workItemId
[**workItemsWorkItemIdPut**](WorkitemsApi.md#workItemsWorkItemIdPut) | **PUT** /work-items/{workItemId} | update a workitem by workItemId
[**workItemsWorkItemIdReadPost**](WorkitemsApi.md#workItemsWorkItemIdReadPost) | **POST** /work-items/{workItemId}/read | marks the work item as read

<a name="apiNotificationsGet"></a>
# **apiNotificationsGet**
> Notifications apiNotificationsGet()

gets notifications such as unread item counts

Get notifications. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
apiInstance.apiNotificationsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Notifications**](Notifications.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="caseDocumentsDocketNumberDocketEntryIdCoversheetPost"></a>
# **caseDocumentsDocketNumberDocketEntryIdCoversheetPost**
> caseDocumentsDocketNumberDocketEntryIdCoversheetPost(docketNumber, docketEntryId)

creates a coversheet and prepends it to the existing s3 document

creates a coversheet and prepends it to the existing s3 document. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdCoversheetPost(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="caseDocumentsDocketNumberDocketEntryIdWorkItemsPost"></a>
# **caseDocumentsDocketNumberDocketEntryIdWorkItemsPost**
> WorkItem caseDocumentsDocketNumberDocketEntryIdWorkItemsPost(docketNumber, docketEntryId)

creates a new work item and attaches it to the case document

creates a new work item and attaches it to the case document 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let docketNumber = "docketNumber_example"; // String | 
let docketEntryId = "docketEntryId_example"; // String | 

apiInstance.caseDocumentsDocketNumberDocketEntryIdWorkItemsPost(docketNumber, docketEntryId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **docketNumber** | **String**|  | 
 **docketEntryId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="sectionsSectionDocumentQcInboxGet"></a>
# **sectionsSectionDocumentQcInboxGet**
> WorkItem sectionsSectionDocumentQcInboxGet(section, opts)

get the section document qc inbox work items

get the section document qc inbox work items. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let section = "section_example"; // String | 
let opts = { 
  'judgeUserName': "judgeUserName_example" // String | 
};
apiInstance.sectionsSectionDocumentQcInboxGet(section, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 
 **judgeUserName** | **String**|  | [optional] 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="sectionsSectionDocumentQcServedGet"></a>
# **sectionsSectionDocumentQcServedGet**
> WorkItem sectionsSectionDocumentQcServedGet(section)

get the section document qc served work items

get the section document qc served work items. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let section = "section_example"; // String | 

apiInstance.sectionsSectionDocumentQcServedGet(section, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="sectionsSectionUsersGet"></a>
# **sectionsSectionUsersGet**
> User sectionsSectionUsersGet(section)

get all users in a section

get all users in a section 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let section = "section_example"; // String | 

apiInstance.sectionsSectionUsersGet(section, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **section** | **String**|  | 

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="usersInternalGet"></a>
# **usersInternalGet**
> User usersInternalGet()

get all internal users

get all internal users 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
apiInstance.usersInternalGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="usersUserIdDocumentQcInboxGet"></a>
# **usersUserIdDocumentQcInboxGet**
> WorkItem usersUserIdDocumentQcInboxGet(userId)

get the inbox items from the users document qc section

get the inbox items from the users document qc section 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdDocumentQcInboxGet(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="usersUserIdDocumentQcServedGet"></a>
# **usersUserIdDocumentQcServedGet**
> WorkItem usersUserIdDocumentQcServedGet(userId)

get the served items from the users document qc section

get the served items from the users document qc section 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let userId = "userId_example"; // String | 

apiInstance.usersUserIdDocumentQcServedGet(userId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="workItemsPut"></a>
# **workItemsPut**
> WorkItem workItemsPut()

assigns an assigneId to a list of work item ids

Get a workitem. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
apiInstance.workItemsPut((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="workItemsWorkItemIdAssigneePut"></a>
# **workItemsWorkItemIdAssigneePut**
> WorkItem workItemsWorkItemIdAssigneePut(workItemId)

sets the assigneeId of the workitem to a new user

sets the assigneeId of the workitem to a new user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdAssigneePut(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="workItemsWorkItemIdCompletePut"></a>
# **workItemsWorkItemIdCompletePut**
> WorkItem workItemsWorkItemIdCompletePut(workItemId)

marks the workitem complete

marks the workitem complete. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdCompletePut(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="workItemsWorkItemIdGet"></a>
# **workItemsWorkItemIdGet**
> WorkItem workItemsWorkItemIdGet(workItemId)

get a workitem by workItemId

Get a workitem. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdGet(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="workItemsWorkItemIdPut"></a>
# **workItemsWorkItemIdPut**
> WorkItem workItemsWorkItemIdPut(workItemId)

update a workitem by workItemId

Update a workitem. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdPut(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="workItemsWorkItemIdReadPost"></a>
# **workItemsWorkItemIdReadPost**
> WorkItem workItemsWorkItemIdReadPost(workItemId)

marks the work item as read

marks the work item as read. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.WorkitemsApi();
let workItemId = "workItemId_example"; // String | 

apiInstance.workItemsWorkItemIdReadPost(workItemId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItemId** | **String**|  | 

### Return type

[**WorkItem**](WorkItem.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

