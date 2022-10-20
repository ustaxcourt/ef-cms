# DevEfCms.MessagesApi

All URIs are relative to *https://efcms-dev.ustc-case-mgmt.flexion.us/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**messagesCaseDocketNumberGet**](MessagesApi.md#messagesCaseDocketNumberGet) | **GET** /messages/case/{docketNumber} | gets the messages for the specific case
[**messagesCompletedSectionSectionIdGet**](MessagesApi.md#messagesCompletedSectionSectionIdGet) | **GET** /messages/completed/section/{sectionId} | gets the completed messages for the specific section
[**messagesCompletedUserIdGet**](MessagesApi.md#messagesCompletedUserIdGet) | **GET** /messages/completed/{userId} | gets the completed messages for the specific user
[**messagesInboxSectionSectionGet**](MessagesApi.md#messagesInboxSectionSectionGet) | **GET** /messages/inbox/section/{section} | gets the inbox messages for the specific section
[**messagesInboxUserIdGet**](MessagesApi.md#messagesInboxUserIdGet) | **GET** /messages/inbox/{userId} | gets the inbox messages for the specific user id
[**messagesMessageIdGet**](MessagesApi.md#messagesMessageIdGet) | **GET** /messages/{messageId} | gets the message for the specific id
[**messagesMessageIdReadPost**](MessagesApi.md#messagesMessageIdReadPost) | **POST** /messages/{messageId}/read | marks a message as read
[**messagesOutboxSectionSectionGet**](MessagesApi.md#messagesOutboxSectionSectionGet) | **GET** /messages/outbox/section/{section} | gets the outbox messages for the specific section
[**messagesOutboxUserIdGet**](MessagesApi.md#messagesOutboxUserIdGet) | **GET** /messages/outbox/{userId} | gets the outbox messages for the specific user id
[**messagesParentMessageIdCompletePost**](MessagesApi.md#messagesParentMessageIdCompletePost) | **POST** /messages/{parentMessageId}/complete | complete a message
[**messagesParentMessageIdForwardPost**](MessagesApi.md#messagesParentMessageIdForwardPost) | **POST** /messages/{parentMessageId}/forward | forward a message
[**messagesParentMessageIdReplyPost**](MessagesApi.md#messagesParentMessageIdReplyPost) | **POST** /messages/{parentMessageId}/reply | reply to a message
[**messagesPost**](MessagesApi.md#messagesPost) | **POST** /messages | create a message

<a name="messagesCaseDocketNumberGet"></a>
# **messagesCaseDocketNumberGet**
> Message messagesCaseDocketNumberGet(docketNumber)

gets the messages for the specific case

Gets the messages for the specific case. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let docketNumber = "docketNumber_example"; // String | 

apiInstance.messagesCaseDocketNumberGet(docketNumber, (error, data, response) => {
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

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesCompletedSectionSectionIdGet"></a>
# **messagesCompletedSectionSectionIdGet**
> Message messagesCompletedSectionSectionIdGet(sectionId)

gets the completed messages for the specific section

Gets the completed messages for the specific user section. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let sectionId = "sectionId_example"; // String | 

apiInstance.messagesCompletedSectionSectionIdGet(sectionId, (error, data, response) => {
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
 **sectionId** | **String**|  | 

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesCompletedUserIdGet"></a>
# **messagesCompletedUserIdGet**
> Message messagesCompletedUserIdGet(userId)

gets the completed messages for the specific user

Gets the completed messages for the specific user. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let userId = "userId_example"; // String | 

apiInstance.messagesCompletedUserIdGet(userId, (error, data, response) => {
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

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesInboxSectionSectionGet"></a>
# **messagesInboxSectionSectionGet**
> Message messagesInboxSectionSectionGet(section)

gets the inbox messages for the specific section

Gets the inbox messages for the specific user section. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let section = "section_example"; // String | 

apiInstance.messagesInboxSectionSectionGet(section, (error, data, response) => {
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

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesInboxUserIdGet"></a>
# **messagesInboxUserIdGet**
> Message messagesInboxUserIdGet(userId)

gets the inbox messages for the specific user id

Gets the inbox messages for the specific user id. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let userId = "userId_example"; // String | 

apiInstance.messagesInboxUserIdGet(userId, (error, data, response) => {
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

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesMessageIdGet"></a>
# **messagesMessageIdGet**
> Message messagesMessageIdGet(messageId)

gets the message for the specific id

Gets the message for the specific id. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let messageId = "messageId_example"; // String | 

apiInstance.messagesMessageIdGet(messageId, (error, data, response) => {
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
 **messageId** | **String**|  | 

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesMessageIdReadPost"></a>
# **messagesMessageIdReadPost**
> Message messagesMessageIdReadPost(messageId, opts)

marks a message as read

Marks a message as read. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let messageId = "messageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.MessageIdReadBody() // MessageIdReadBody | the associated docket number
};
apiInstance.messagesMessageIdReadPost(messageId, opts, (error, data, response) => {
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
 **messageId** | **String**|  | 
 **body** | [**MessageIdReadBody**](MessageIdReadBody.md)| the associated docket number | [optional] 

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

<a name="messagesOutboxSectionSectionGet"></a>
# **messagesOutboxSectionSectionGet**
> Message messagesOutboxSectionSectionGet(section)

gets the outbox messages for the specific section

Gets the outbox messages for the specific user section. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let section = "section_example"; // String | 

apiInstance.messagesOutboxSectionSectionGet(section, (error, data, response) => {
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

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesOutboxUserIdGet"></a>
# **messagesOutboxUserIdGet**
> Message messagesOutboxUserIdGet(userId)

gets the outbox messages for the specific user id

Gets the outbox messages for the specific user id. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let userId = "userId_example"; // String | 

apiInstance.messagesOutboxUserIdGet(userId, (error, data, response) => {
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

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="messagesParentMessageIdCompletePost"></a>
# **messagesParentMessageIdCompletePost**
> Message messagesParentMessageIdCompletePost(parentMessageId, opts)

complete a message

Complete a message. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let parentMessageId = "parentMessageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.ParentMessageIdCompleteBody() // ParentMessageIdCompleteBody | the message info
};
apiInstance.messagesParentMessageIdCompletePost(parentMessageId, opts, (error, data, response) => {
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
 **parentMessageId** | **String**|  | 
 **body** | [**ParentMessageIdCompleteBody**](ParentMessageIdCompleteBody.md)| the message info | [optional] 

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

<a name="messagesParentMessageIdForwardPost"></a>
# **messagesParentMessageIdForwardPost**
> Message messagesParentMessageIdForwardPost(parentMessageId, opts)

forward a message

Forward a message. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let parentMessageId = "parentMessageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.ParentMessageIdForwardBody() // ParentMessageIdForwardBody | the message info
};
apiInstance.messagesParentMessageIdForwardPost(parentMessageId, opts, (error, data, response) => {
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
 **parentMessageId** | **String**|  | 
 **body** | [**ParentMessageIdForwardBody**](ParentMessageIdForwardBody.md)| the message info | [optional] 

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

<a name="messagesParentMessageIdReplyPost"></a>
# **messagesParentMessageIdReplyPost**
> Message messagesParentMessageIdReplyPost(parentMessageId, opts)

reply to a message

Reply to a message. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
let parentMessageId = "parentMessageId_example"; // String | 
let opts = { 
  'body': new DevEfCms.ParentMessageIdReplyBody() // ParentMessageIdReplyBody | the message info
};
apiInstance.messagesParentMessageIdReplyPost(parentMessageId, opts, (error, data, response) => {
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
 **parentMessageId** | **String**|  | 
 **body** | [**ParentMessageIdReplyBody**](ParentMessageIdReplyBody.md)| the message info | [optional] 

### Return type

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: */*
 - **Accept**: application/json

<a name="messagesPost"></a>
# **messagesPost**
> Message messagesPost()

create a message

Create a message. 

### Example
```javascript
import {DevEfCms} from 'dev_ef_cms';
let defaultClient = DevEfCms.ApiClient.instance;

// Configure API key authorization: CognitoUserPool
let CognitoUserPool = defaultClient.authentications['CognitoUserPool'];
CognitoUserPool.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//CognitoUserPool.apiKeyPrefix = 'Token';

let apiInstance = new DevEfCms.MessagesApi();
apiInstance.messagesPost((error, data, response) => {
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

[**Message**](Message.md)

### Authorization

[CognitoUserPool](../README.md#CognitoUserPool)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

