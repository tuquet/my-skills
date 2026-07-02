# Automa Nodes Manual

This manual contains the exact JSON schema and descriptions for all Automa blocks (nodes). Use this reference when building or auditing Automa JSON workflows to ensure node payloads are structurally correct.

---

## Part 1: Core & Browser Nodes

### `trigger`
**What it does:** Block where workflow will start executing
**Inputs:** 0 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "type": "manual",
  "interval": 60,
  "delay": 5,
  "date": "",
  "time": "00:00",
  "url": "",
  "shortcut": "",
  "activeInInput": false,
  "isUrlRegex": false,
  "days": [],
  "contextMenuName": "",
  "contextTypes": [],
  "parameters": [],
  "preferParamsInTab": false,
  "observeElement": {
    "selector": "",
    "baseSelector": "",
    "matchPattern": "",
    "targetOptions": {
      "subtree": false,
      "childList": true,
      "attributes": false,
      "attributeFilter": [],
      "characterData": false
    },
    "baseElOptions": {
      "subtree": false,
      "childList": true,
      "attributes": false,
      "attributeFilter": [],
      "characterData": false
    }
  }
}
```

### `ai-workflow`
**What it does:** A workflow that is created by AI-Power
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "flowUuid": "",
  "flowLabel": "",
  "description": "",
  "inputs": [],
  "outputs": [],
  "assignVariable": false,
  "variableName": "",
  "saveData": false,
  "dataColumn": ""
}
```

### `execute-workflow`
**What it does:** Executes a specific workflow.
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "executeId": "",
  "workflowId": "",
  "globalData": "",
  "description": "",
  "insertAllVars": false,
  "insertAllGlobalData": false
}
```

### `active-tab`
**What it does:** Set current tab that you're in as an active tab
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false
}
```

### `new-tab`
**What it does:** Create a new tab
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "url": "",
  "userAgent": "",
  "active": true,
  "tabZoom": 1,
  "inGroup": false,
  "waitTabLoaded": false,
  "updatePrevTab": false,
  "customUserAgent": false
}
```

### `switch-tab`
**What it does:** Switch active tab
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "url": "",
  "tabIndex": 0,
  "tabTitle": "",
  "matchPattern": "",
  "activeTab": true,
  "createIfNoMatch": false,
  "findTabBy": "match-patterns"
}
```

### `new-window`
**What it does:** Create a new window
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "top": 0,
  "left": 0,
  "width": 0,
  "url": "",
  "height": 0,
  "type": "normal",
  "incognito": false,
  "windowState": "normal"
}
```

### `proxy`
**What it does:** Set the proxy of the browser
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "description": "",
  "disableBlock": false,
  "scheme": "https",
  "host": "",
  "port": 443,
  "bypassList": "",
  "clearProxy": false
}
```

### `go-back`
**What it does:** Go back to the previous page
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false
}
```

### `forward-page`
**What it does:** Go forward to the next page
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false
}
```

### `close-tab`
**What it does:** Close tab/window
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "url": "",
  "description": "",
  "activeTab": true,
  "closeType": "tab",
  "allWindows": false
}
```

### `take-screenshot`
**What it does:** Take a screenshot of current active tab
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "description": "",
  "disableBlock": false,
  "fileName": "",
  "ext": "png",
  "quality": 100,
  "dataColumn": "",
  "variableName": "",
  "selector": "",
  "fullPage": false,
  "saveToColumn": false,
  "saveToComputer": true,
  "assignVariable": false,
  "captureActiveTab": true
}
```

### `browser-event`
**What it does:** Wait until the selected event is triggered
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "timeout": 10000,
  "eventName": "tab:loaded",
  "setAsActiveTab": true,
  "activeTabLoaded": true,
  "tabLoadedUrl": "",
  "tabUrl": "",
  "fileQuery": ""
}
```

### `delay`
**What it does:** Add delay before executing the next block
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "time": 500
}
```

### `export-data`
**What it does:** Export data
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "name": "",
  "refKey": "",
  "type": "json",
  "description": "",
  "variableName": "",
  "csvDelimiter": ",",
  "addBOMHeader": true,
  "onConflict": "uniquify",
  "dataToExport": "data-columns"
}
```

### `webhook`
**What it does:** make an HTTP request
**Inputs:** 1 | **Outputs:** 2
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "url": "",
  "body": "{}",
  "headers": [],
  "method": "POST",
  "timeout": 10000,
  "dataPath": "",
  "contentType": "json",
  "variableName": "",
  "assignVariable": false,
  "saveData": false,
  "dataColumn": "",
  "responseType": "json"
}
```

### `blocks-group`
**What it does:** Grouping blocks
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "name": "",
  "blocks": []
}
```

### `clipboard`
**What it does:** Get the copied text from the clipboard
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "type": "get",
  "assignVariable": false,
  "variableName": "",
  "saveData": true,
  "dataColumn": "",
  "dataToCopy": "",
  "copySelectedText": false
}
```

### `handle-dialog`
**What it does:** Accepts or dismisses a JavaScript initiated dialog.
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "accept": true,
  "promptText": ""
}
```

### `handle-download`
**What it does:** Handle downloaded file
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "filename": "",
  "timeout": 20000,
  "onConflict": "uniquify",
  "waitForDownload": true,
  "dataColumn": "",
  "saveData": true,
  "assignVariable": false,
  "variableName": "",
  "downloadId": ""
}
```

### `reload-tab`
**What it does:** Reload the active tab
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false
}
```

### `wait-connections`
**What it does:** Wait for all connections before continuing
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "timeout": 10000,
  "specificFlow": false,
  "flowBlockId": ""
}
```

### `notification`
**What it does:** Display a notification
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "message": "",
  "iconUrl": "",
  "imageUrl": "",
  "title": "Hello world!"
}
```

### `tab-url`
**What it does:** Get the tab URL
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "type": "active-tab",
  "dataColumn": "",
  "saveData": true,
  "assignVariable": false,
  "variableName": "",
  "qTitle": "",
  "qMatchPatterns": ""
}
```

### `cookie`
**What it does:** Get, set, or remove cookies
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "type": "get",
  "jsonCode": "{\n\n}",
  "useJson": false,
  "getAll": false,
  "domain": "",
  "expirationDate": "",
  "path": "",
  "sameSite": "",
  "name": "",
  "url": "",
  "value": "",
  "httpOnly": false,
  "secure": false,
  "session": false,
  "assignVariable": false,
  "variableName": "",
  "saveData": true,
  "dataColumn": ""
}
```

### `note`
**What it does:** Add a descriptive note (based on component `BlockNote`)
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "note": "",
  "drawing": false,
  "width": 280,
  "height": 168,
  "color": "white",
  "fontSize": "regular"
}
```

### `workflow-state`
**What it does:** Manage workflows states
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "type": "stop-current",
  "exceptCurrent": false,
  "workflowsToStop": [],
  "throwError": false,
  "errorMessage": ""
}
```

### `parameter-prompt`
**What it does:** Prompt for parameters at runtime
**Inputs:** 1 | **Outputs:** 1
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "timeout": 60000,
  "parameters": []
}
```

---

## Part 2: Interaction & Conditions Nodes

### `event-click`
**What it does:** Simulates a click on an element.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "multiple": false
}
```

### `get-text`
**What it does:** Extracts text from a specified element.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "multiple": false,
  "regex": "",
  "prefixText": "",
  "suffixText": "",
  "regexExp": [],
  "dataColumn": "",
  "saveData": true,
  "includeTags": false,
  "addExtraRow": false,
  "assignVariable": false,
  "useTextContent": false,
  "variableName": "",
  "extraRowValue": "",
  "extraRowDataColumn": ""
}
```

### `element-scroll`
**What it does:** Scrolls a specific element or the main page.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "html",
  "markEl": false,
  "multiple": false,
  "scrollY": 0,
  "scrollX": 0,
  "incX": false,
  "incY": false,
  "smooth": false,
  "scrollIntoView": false
}
```

### `link`
**What it does:** Opens a link element.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "disableMultiple": true,
  "openInNewTab": false
}
```

### `attribute-value`
**What it does:** Retrieves a HTML attribute's value.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "multiple": false,
  "attributeValue": "",
  "attributeName": "",
  "assignVariable": false,
  "variableName": "",
  "dataColumn": "",
  "saveData": true,
  "action": "get",
  "addExtraRow": false,
  "extraRowValue": "",
  "extraRowDataColumn": ""
}
```

### `forms`
**What it does:** Manipulates form elements.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "multiple": false,
  "selected": true,
  "clearValue": true,
  "getValue": false,
  "saveData": false,
  "dataColumn": "",
  "selectOptionBy": "value",
  "optionPosition": "1",
  "assignVariable": false,
  "variableName": "",
  "type": "text-field",
  "value": "",
  "delay": 0,
  "events": []
}
```

### `repeat-task`
**What it does:** Repeats the subsequent workflow path.
**Data Schema:**
```json
{
  "disableBlock": false,
  "repeatFor": "1"
}
```

### `javascript-code`
**What it does:** Executes custom JavaScript code.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "timeout": 20000,
  "context": "website",
  "code": "console.log(\"Hello world!\");\nautomaNextBlock()",
  "preloadScripts": [],
  "everyNewTab": false,
  "runBeforeLoad": false
}
```

### `trigger-event`
**What it does:** Triggers a specific DOM event.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "html",
  "markEl": false,
  "multiple": false,
  "eventName": "",
  "eventType": "",
  "eventParams": {
    "bubbles": true,
    "cancelable": false
  }
}
```

### `conditions`
**What it does:** Branches the workflow based on configured rules.
**Data Schema:**
```json
{
  "description": "",
  "disableBlock": false,
  "conditions": [],
  "retryConditions": false,
  "retryCount": 10,
  "retryTimeout": 1000
}
```

### `element-exists`
**What it does:** Checks if an element exists on the page.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "selector": "",
  "tryCount": 1,
  "timeout": 500,
  "markEl": false,
  "throwError": false
}
```

### `while-loop`
**What it does:** Executes a sequence repeatedly.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "conditions": null
}
```

### `loop-data`
**What it does:** Loops through structured data.
**Data Schema:**
```json
{
  "disableBlock": false,
  "loopId": "",
  "maxLoop": 0,
  "toNumber": 10,
  "fromNumber": 1,
  "startIndex": 0,
  "loopData": "[]",
  "description": "",
  "variableName": "",
  "referenceKey": "",
  "reverseLoop": false,
  "elementSelector": "",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "resumeLastWorkflow": false,
  "loopThrough": "data-columns"
}
```

### `loop-elements`
**What it does:** Loops through multiple elements.
**Data Schema:**
```json
{
  "disableBlock": false,
  "loopId": "",
  "selector": "",
  "maxLoop": "0",
  "description": "",
  "reverseLoop": false,
  "actionElSelector": "",
  "findBy": "cssSelector",
  "actionElMaxWaitTime": 5,
  "actionPageMaxWaitTime": 10,
  "loadMoreAction": "none",
  "scrollToBottom": true,
  "waitForSelector": false,
  "waitSelectorTimeout": 5000
}
```

### `loop-breakpoint`
**What it does:** Boundary point where a loop finishes.
**Data Schema:**
```json
{
  "disableBlock": false,
  "loopId": "",
  "clearLoop": false
}
```

### `switch-to`
**What it does:** Switches the browsing frame.
**Data Schema:**
```json
{
  "disableBlock": false,
  "findBy": "cssSelector",
  "selector": "",
  "windowType": "main-window"
}
```

### `upload-file`
**What it does:** Uploads specified files.
**Data Schema:**
```json
{
  "disableBlock": false,
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "filePaths": []
}
```

### `hover-element`
**What it does:** Simulates a mouse hover.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "multiple": false
}
```

### `save-assets`
**What it does:** Saves media assets.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "findBy": "cssSelector",
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "",
  "markEl": false,
  "multiple": false,
  "type": "element",
  "url": "",
  "filename": "",
  "saveDownloadIds": false,
  "onConflict": "uniquify",
  "dataColumn": "",
  "saveData": true,
  "assignVariable": false,
  "variableName": "",
  "saveToGDrive": false
}
```

### `press-key`
**What it does:** Triggers a specific keypress.
**Data Schema:**
```json
{
  "disableBlock": false,
  "keys": "",
  "selector": "",
  "pressTime": "0",
  "description": "",
  "keysToPress": "",
  "action": "press-key"
}
```

### `create-element`
**What it does:** Injects custom HTML.
**Data Schema:**
```json
{
  "disableBlock": false,
  "description": "",
  "javascript": "",
  "html": "",
  "css": "",
  "preloadScripts": [],
  "findBy": "cssSelector",
  "insertAt": "after",
  "runBeforeLoad": false,
  "waitForSelector": false,
  "waitSelectorTimeout": 5000,
  "selector": "body"
}
```

---

## Part 3: Data & Services Nodes

### `google-sheets`
**Description**: Read Google Sheets data.
**Data Schema**:
```json
{
  "disableBlock": false,
  "range": "",
  "refKey": "",
  "type": "get",
  "customData": "",
  "description": "",
  "spreadsheetId": "",
  "dataColumn": "",
  "saveData": true,
  "assignVariable": false,
  "variableName": "",
  "firstRowAsKey": false,
  "keysAsFirstRow": true,
  "valueInputOption": "RAW",
  "InsertDataOption": "INSERT_ROWS",
  "dataFrom": "data-columns"
}
```

### `google-sheets-drive`
**Description**: Read Google Sheets data (via Google Drive connection).
**Data Schema**:
```json
{
  "disableBlock": false,
  "range": "",
  "refKey": "",
  "type": "get",
  "customData": "",
  "description": "",
  "spreadsheetId": "",
  "dataColumn": "",
  "inputSpreadsheetId": "connected",
  "saveData": true,
  "sheetName": "",
  "assignVariable": false,
  "variableName": "",
  "firstRowAsKey": false,
  "keysAsFirstRow": true,
  "valueInputOption": "RAW",
  "InsertDataOption": "INSERT_ROWS",
  "dataFrom": "data-columns"
}
```

### `google-drive`
**Description**: Upload files to Google Drive.
**Data Schema**:
```json
{
  "disableBlock": false,
  "action": "upload",
  "filePaths": []
}
```

### `insert-data`
**Description**: Insert data into table or variable.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "dataList": []
}
```

### `delete-data`
**Description**: Delete table or variable data.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "deleteList": []
}
```

### `log-data`
**Description**: Get the latest log data of a workflow.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "workflowId": "",
  "dataColumn": "",
  "saveData": true,
  "assignVariable": false,
  "variableName": ""
}
```

### `slice-variable`
**Description**: Extracts a section of a variable value.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "endIdxEnabled": false,
  "startIdxEnabled": true,
  "endIndex": 0,
  "startIndex": 0,
  "variableName": ""
}
```

### `increase-variable`
**Description**: Increase the value of a variable by a specific amount.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "increaseBy": 1,
  "variableName": ""
}
```

### `regex-variable`
**Description**: Matching a variable value against a regular expression.
**Data Schema**:
```json
{
  "disableBlock": false,
  "method": "match",
  "replaceVal": "",
  "description": "",
  "expression": "",
  "flag": []
}
```

### `data-mapping`
**Description**: Map data of a variable or table.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "dataSource": "table",
  "sources": [],
  "varSourceName": "",
  "dataColumn": "",
  "saveData": false,
  "assignVariable": false,
  "variableName": ""
}
```

### `sort-data`
**Description**: Sort the items of data.
**Data Schema**:
```json
{
  "disableBlock": false,
  "description": "",
  "sortByProperty": false,
  "itemProperties": [],
  "dataSource": "table",
  "varSourceName": "",
  "dataColumn": "",
  "saveData": false,
  "assignVariable": false,
  "variableName": ""
}
```
