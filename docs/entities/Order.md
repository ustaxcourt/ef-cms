# Order
 ```
---
  type: "object"
  keys: 
    documentTitle: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    documentType: 
      type: "string"
      flags: 
        presence: "required"
    eventCode: 
      type: "string"
      flags: 
        presence: "optional"
    orderBody: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500

 ```
