# PublicCase
 ```
---
  type: "object"
  whens: 
    - 
      is: 
        type: "object"
        flags: 
          unknown: true
        keys: 
          isSealed: 
            type: "any"
            flags: 
              only: true
            allow: 
              - 
                override: true
              - true
      then: 
        type: "object"
        keys: 
          caseCaption: 
            type: "any"
            flags: 
              presence: "forbidden"
          contactPrimary: 
            type: "any"
            flags: 
              presence: "forbidden"
          contactSecondary: 
            type: "any"
            flags: 
              presence: "forbidden"
          createdAt: 
            type: "any"
            flags: 
              presence: "forbidden"
          docketEntries: 
            type: "array"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 0
          docketNumber: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
              - 
                name: "pattern"
                args: 
                  regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
          docketNumberSuffix: 
            type: "string"
            flags: 
              only: true
              presence: "optional"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
            allow: 
              - "X"
              - "R"
              - "D"
              - "L"
              - "P"
              - "S"
              - "SL"
              - "W"
          hasIrsPractitioner: 
            type: "boolean"
          isSealed: 
            type: "boolean"
          partyType: 
            type: "any"
            flags: 
              presence: "forbidden"
          receivedAt: 
            type: "any"
            flags: 
              presence: "forbidden"
  keys: 
    caseCaption: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 4700
    contactPrimary: 
      type: "object"
      flags: 
        presence: "required"
      keys: 
        name: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 500
        state: 
          type: "string"
          flags: 
            only: true
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          allow: 
            - "AK"
            - "AL"
            - "AR"
            - "AZ"
            - "CA"
            - "CO"
            - "CT"
            - "DC"
            - "DE"
            - "FL"
            - "GA"
            - "HI"
            - "IA"
            - "ID"
            - "IL"
            - "IN"
            - "KS"
            - "KY"
            - "LA"
            - "MA"
            - "MD"
            - "ME"
            - "MI"
            - "MN"
            - "MO"
            - "MS"
            - "MT"
            - "NC"
            - "ND"
            - "NE"
            - "NH"
            - "NJ"
            - "NM"
            - "NV"
            - "NY"
            - "OH"
            - "OK"
            - "OR"
            - "PA"
            - "RI"
            - "SC"
            - "SD"
            - "TN"
            - "TX"
            - "UT"
            - "VA"
            - "VT"
            - "WA"
            - "WI"
            - "WV"
            - "WY"
            - "AA"
            - "AE"
            - "AP"
            - "AS"
            - "FM"
            - "GU"
            - "MH"
            - "MP"
            - "PR"
            - "PW"
            - "VI"
            - "N/A"
    contactSecondary: 
      type: "object"
      flags: 
        presence: "optional"
      allow: 
        - null
      keys: 
        name: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 500
        state: 
          type: "string"
          flags: 
            only: true
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          allow: 
            - "AK"
            - "AL"
            - "AR"
            - "AZ"
            - "CA"
            - "CO"
            - "CT"
            - "DC"
            - "DE"
            - "FL"
            - "GA"
            - "HI"
            - "IA"
            - "ID"
            - "IL"
            - "IN"
            - "KS"
            - "KY"
            - "LA"
            - "MA"
            - "MD"
            - "ME"
            - "MI"
            - "MN"
            - "MO"
            - "MS"
            - "MT"
            - "NC"
            - "ND"
            - "NE"
            - "NH"
            - "NJ"
            - "NM"
            - "NV"
            - "NY"
            - "OH"
            - "OK"
            - "OR"
            - "PA"
            - "RI"
            - "SC"
            - "SD"
            - "TN"
            - "TX"
            - "UT"
            - "VA"
            - "VT"
            - "WA"
            - "WI"
            - "WV"
            - "WY"
            - "AA"
            - "AE"
            - "AP"
            - "AS"
            - "FM"
            - "GU"
            - "MH"
            - "MP"
            - "PR"
            - "PW"
            - "VI"
            - "N/A"
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    docketEntries: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of DocketEntry Entities for the case."
      items: 
        - 
          type: "object"
          keys: 
            additionalInfo: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            additionalInfo2: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            createdAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "When the Document was added to the system."
            docketEntryId: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            docketNumber: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Docket Number of the associated Case in XXXXX-YY format."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "pattern"
                  args: 
                    regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
            documentTitle: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The title of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 3000
            documentType: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The type of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            eventCode: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "A"
                - "AAAP"
                - "AAPN"
                - "AATP"
                - "AATS"
                - "AATT"
                - "ACED"
                - "ADMR"
                - "ADMT"
                - "AFE"
                - "AFF"
                - "AFP"
                - "AMAT"
                - "AMDC"
                - "APA"
                - "APLD"
                - "APPL"
                - "APPW"
                - "APW"
                - "ASAP"
                - "ASUP"
                - "ATAP"
                - "ATSP"
                - "BND"
                - "BRF"
                - "CERT"
                - "CIVP"
                - "COED"
                - "CS"
                - "CTRA"
                - "DCL"
                - "DEC"
                - "DISC"
                - "DSC"
                - "EA"
                - "ES"
                - "EVID"
                - "EXH"
                - "FEE"
                - "FEEW"
                - "FTRL"
                - "HE"
                - "HEAR"
                - "LEA"
                - "LTR"
                - "M000"
                - "M001"
                - "M002"
                - "M003"
                - "M004"
                - "M005"
                - "M006"
                - "M007"
                - "M008"
                - "M009"
                - "M010"
                - "M011"
                - "M012"
                - "M013"
                - "M014"
                - "M015"
                - "M016"
                - "M017"
                - "M018"
                - "M019"
                - "M020"
                - "M021"
                - "M022"
                - "M023"
                - "M024"
                - "M026"
                - "M027"
                - "M028"
                - "M029"
                - "M030"
                - "M031"
                - "M032"
                - "M033"
                - "M034"
                - "M035"
                - "M036"
                - "M037"
                - "M038"
                - "M039"
                - "M040"
                - "M041"
                - "M042"
                - "M043"
                - "M044"
                - "M045"
                - "M046"
                - "M047"
                - "M048"
                - "M049"
                - "M050"
                - "M051"
                - "M052"
                - "M053"
                - "M054"
                - "M055"
                - "M056"
                - "M057"
                - "M058"
                - "M059"
                - "M060"
                - "M061"
                - "M062"
                - "M063"
                - "M064"
                - "M065"
                - "M066"
                - "M067"
                - "M068"
                - "M069"
                - "M070"
                - "M071"
                - "M072"
                - "M073"
                - "M074"
                - "M075"
                - "M076"
                - "M077"
                - "M078"
                - "M079"
                - "M080"
                - "M081"
                - "M082"
                - "M083"
                - "M084"
                - "M085"
                - "M086"
                - "M087"
                - "M088"
                - "M089"
                - "M090"
                - "M091"
                - "M092"
                - "M093"
                - "M094"
                - "M095"
                - "M096"
                - "M097"
                - "M098"
                - "M099"
                - "M100"
                - "M101"
                - "M102"
                - "M103"
                - "M104"
                - "M105"
                - "M106"
                - "M107"
                - "M108"
                - "M109"
                - "M110"
                - "M111"
                - "M112"
                - "M113"
                - "M114"
                - "M115"
                - "M116"
                - "M117"
                - "M118"
                - "M119"
                - "M120"
                - "M121"
                - "M122"
                - "M123"
                - "M124"
                - "M125"
                - "M126"
                - "M129"
                - "M130"
                - "M131"
                - "M132"
                - "M133"
                - "M134"
                - "M135"
                - "M136"
                - "M137"
                - "M218"
                - "MEMO"
                - "MINC"
                - "MIND"
                - "MISC"
                - "MISCL"
                - "MISP"
                - "MOP"
                - "NAJA"
                - "NCA"
                - "NCAG"
                - "NCAP"
                - "NCNP"
                - "NCON"
                - "NCP"
                - "NCTP"
                - "NDC"
                - "NFAR"
                - "NIFL"
                - "NINF"
                - "NIS"
                - "NITM"
                - "NJAR"
                - "NNOB"
                - "NOA"
                - "NOB"
                - "NOC"
                - "NODC"
                - "NOEI"
                - "NOEP"
                - "NOI"
                - "NOST"
                - "NOT"
                - "NOTW"
                - "NOU"
                - "NPB"
                - "NPJR"
                - "NRJD"
                - "NRJR"
                - "NSA"
                - "NSTE"
                - "NTA"
                - "NTD"
                - "NTN"
                - "O"
                - "OAD"
                - "OAJ"
                - "OAL"
                - "OAP"
                - "OAPF"
                - "OAR"
                - "OAS"
                - "OASL"
                - "OAW"
                - "OAX"
                - "OBJ"
                - "OBJE"
                - "OBJN"
                - "OCA"
                - "OD"
                - "ODD"
                - "ODJ"
                - "ODL"
                - "ODP"
                - "ODR"
                - "ODS"
                - "ODSL"
                - "ODW"
                - "ODX"
                - "OF"
                - "OFAB"
                - "OFFX"
                - "OFWD"
                - "OFX"
                - "OIP"
                - "OJR"
                - "OODS"
                - "OP"
                - "OPFX"
                - "OPPO"
                - "OPX"
                - "ORAP"
                - "OROP"
                - "OSC"
                - "OSCP"
                - "OST"
                - "OSUB"
                - "P"
                - "PARD"
                - "PHM"
                - "PMT"
                - "PSDE"
                - "PTE"
                - "PTFR"
                - "PTRL"
                - "RAT"
                - "RATF"
                - "RCOM"
                - "REDC"
                - "REPL"
                - "REQ"
                - "REQA"
                - "RESP"
                - "RFPC"
                - "RJN"
                - "RLRI"
                - "RM"
                - "ROA"
                - "RPT"
                - "RQT"
                - "RSP"
                - "RTP"
                - "RTRA"
                - "S212"
                - "SADM"
                - "SAMB"
                - "SATL"
                - "SDEC"
                - "SEAB"
                - "SEOB"
                - "SERB"
                - "SESB"
                - "SIAB"
                - "SIAM"
                - "SIMB"
                - "SIML"
                - "SIOB"
                - "SIOM"
                - "SIRB"
                - "SISB"
                - "SOC"
                - "SOMB"
                - "SOP"
                - "SORI"
                - "SPAR"
                - "SPD"
                - "SPML"
                - "SPMT"
                - "SPOS"
                - "SPTN"
                - "SPTO"
                - "SRMB"
                - "SSB"
                - "SSRB"
                - "SSRM"
                - "SSTP"
                - "STAR"
                - "STAT"
                - "STBB"
                - "STIN"
                - "STIP"
                - "STP"
                - "STPD"
                - "STS"
                - "STST"
                - "SUPM"
                - "SURP"
                - "TCOP"
                - "TE"
                - "TRAN"
                - "TRL"
                - "USCA"
                - "USDL"
                - "WRIT"
            filedBy: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - ""
                - null
            filingDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "Date that this Document was filed."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            index: 
              type: "number"
              flags: 
                presence: "optional"
                description: "Index of this item in the Docket Record list."
              rules: 
                - 
                  name: "integer"
            isFileAttached: 
              type: "boolean"
              flags: 
                presence: "optional"
            isMinuteEntry: 
              type: "boolean"
              flags: 
                presence: "optional"
            isPaper: 
              type: "boolean"
              flags: 
                presence: "optional"
            isSealed: 
              type: "boolean"
              flags: 
                presence: "required"
              invalid: 
                - true
            isStricken: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Indicates the item has been removed from the docket record."
            numberOfPages: 
              type: "number"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "integer"
              allow: 
                - null
            processingStatus: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            receivedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
            servedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
            servedParties: 
              type: "array"
              flags: 
                presence: "optional"
              items: 
                - 
                  type: "object"
                  keys: 
                    name: 
                      type: "string"
                      flags: 
                        presence: "optional"
                        description: "The name of a party from a contact, or \"IRS\""
                      rules: 
                        - 
                          name: "min"
                          args: 
                            limit: 1
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case identifier in XXXXX-YY format."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - null
        - "X"
        - "R"
        - "D"
        - "L"
        - "P"
        - "S"
        - "SL"
        - "W"
    docketNumberWithSuffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Auto-generated from docket number and the suffix."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
    hasIrsPractitioner: 
      type: "boolean"
      flags: 
        presence: "required"
    isSealed: 
      type: "boolean"
    partyType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Party type of the case petitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Conservator"
        - "Corporation"
        - "Custodian"
        - "Donor"
        - "Estate with an executor/personal representative/fiduciary/etc."
        - "Estate without an executor/personal representative/fiduciary/etc."
        - "Guardian"
        - "Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)"
        - "Next friend for a minor (without a guardian, conservator, or other like fiduciary)"
        - "Partnership (as the Tax Matters Partner)"
        - "Partnership (as a partnership representative under the BBA regime)"
        - "Partnership (as a partner other than Tax Matters Partner)"
        - "Petitioner"
        - "Petitioner & deceased spouse"
        - "Petitioner & spouse"
        - "Surviving spouse"
        - "Transferee"
        - "Trust"
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"

 ```
