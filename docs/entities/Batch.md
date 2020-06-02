# Batch
 ```
---
  type: "object"
  keys: 
    batchId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    batchIndex: 
      type: "number"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 0
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
    pages: 
      type: "array"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1

 ```
