# Welcome to the Test Director wiki!

_A simple GUI for testing websites and web applications._

## Our Mission: 

Anyone should be able to write tests easily.

Test Director takes the complexity out of testing. You are given some tools to write simple scripts using SQL-like syntax. This test script is then compiled into other languages (such as JavaScript) and executed using different browser implementations (TestDirector Free comes bundled with a WebKit engine, Firefox and IE are available on the PRO version).

### SAMPLE TEST

    TEST SUITE "Google.com IPhone Test Suite"
    -- SETTINGS
    SET SCREENSIZE TO 320 BY 480
    SET USERAGENT TO "Apple-iPhone3C1/803.148"
    -- TEST NAME
    TEST "Search Google.com for Testing"
    -- COMMENCE
    GO TO "http://www.google.com"
    CLICK "input#query" AND WRITE "testing"
    WAIT FOR 5 SECONDS
    CLICK "button#submit"
    CHECK LOCATION IS "https://www.google.com.au/search?q=testing"
    CHECK "div#result-box" IS VISIBLE
    CHECK "H2.result-entry" EXISTS 10 TIMES
    CHECK "div#result-box" TEXT CONTAINS "total results"
    CHECK "div#result-box" HTML CONTAINS "<sub>%d%</sub>"
    CHECK "div#result-box" STYLE "background" IS "white"

### ANOTHER SAMPLE
```
#!SQL
 EXECUTE SUITE "Login.joy"

 SET @MyDevelopmentPlan = "#NavigationMenu > ul > li:nth-child(4) > a"
 SET @Status = "#MainContent_DevPlanGridView_StatusLabel_0"
 SET @Edit = "#MainContent_DevPlanGridView > tbody > tr:nth-child(2) > td:nth-child(7) > a"
 SET @Dropdown1 = "#MainContent_DeliveryDropDownList"

 CLICK @MyDevelopmentPlan
 CHECK @Status TEXT IS "Pending Approval"
 CLICK @Edit
 CLICK @Dropdown1 AND SELECT "Approved"
 CLICK @MyDevelopmentPlan
 CHECK @Status TEXT IS "Approved"
```

### DEFINTION

* [TEST SUITE "string"](Definitions#test-suite-string)
* [TEST "string"](Definitions#test-string)

### VARIABLES

* SET @variable = "string"

### EXECUTION

* EXECUTE "string"
* EXECUTE "string" WITH @variable1 = "string" [AND @variable2 = "string", ...]

### NAVIGATION

* [GO TO "url"](Navigation#go-to-url)
* [GO BACK](Navigation#go-back)
* POST "string" TO "url"
* [REFRESH](Navigation#refresh)
* [SET COOKIE "string" TO "string" [FOR "url"]](Navigation#set-cookie-string-to-string-for-url)
* [SET SCREENSIZE TO number BY number](Navigation#set-screensize-to-number-by-number)
* [SET USERAGENT TO "string"](Navigation#set-useragent-to-string)
* [CLEAR CACHE](Navigation#clear-cache)
* [CLEAR COOKIES](Navigation#clear-cookies)

### INTERACTION

* WAIT FOR number SECONDS
* WAIT FOR RESPONSE
* PRESS key (AND key (..))
* [CLICK "selector"](Interaction#click-selector)
* CLICK "selector" AND WRITE "string" [AND PRESS key]
* CLICK "selector" AND DRAG TO "selector" 
* CLICK "selector" AND SELECT "string"
* [RIGHT CLICK "selector"](Interaction#right-click-selector)
* EXECUTE "scriptlet"
* TAKE SCREENSHOT

### ASSERTIONS

* [CHECK LOCATION IS [NOT] "string"](Assertions)
* [CHECK LOCATION [NOT] LIKE "string"](Assertions)
* [CHECK LOCATION [NOT] MATCHES "expression"](Assertions)
* [CHECK "selector" [NOT] EXISTS](Assertions)
* CHECK "selector" [NOT] EXISTS number TIMES
* CHECK "selector" [NOT] EXISTS INSIDE "selector"
* CHECK "selector" IS [NOT] VISIBLE
* CHECK "selector" TEXT IS [NOT] "string"
* CHECK "selector" TEXT [NOT] LIKE "string"
* CHECK "selector" TEXT [NOT] MATCHES "expression"
* CHECK "selector" STYLE "string" IS [NOT] "string"
* CHECK "selector" STYLE "string" [NOT] LIKE "string"
* CHECK "selector" STYLE "string" [NOT] MATCHES "string"
* CHECK "selector" ATTRIBUTE "string" IS [NOT] "string"
* CHECK "selector" ATTRIBUTE "string" [NOT] LIKE "string"
* CHECK "selector" ATTRIBUTE "string" [NOT] MATCHES "string"

### FUNCTIONS

* LOAD([FILE])
* NOW([STRING])

### DATATYPES

* [selector](DataTypes#selector)
* [string](DataTypes#string)
* number
* url
* file
* expression
* key

## Wiki features

This wiki uses the [Markdown](http://daringfireball.net/projects/markdown/) syntax.

The wiki itself is actually a git repository, which means you can clone it, edit it locally/offline, add images or any other file type, and push it back to us. It will be live immediately.

Go ahead and try:

```
$ git clone https://sdesalas@bitbucket.org/sdesalas/testrunner.git/wiki
```

Wiki pages are normal files, with the .md extension. You can edit them locally, as well as creating new ones.

## Syntax highlighting


You can also highlight snippets of text (we use the excellent [Pygments][] library).

[Pygments]: http://www.pygments.org/


Here's an example of some Python code:

```
#!python

def wiki_rocks(text):
    formatter = lambda t: "funky"+t
    return formatter(text)
```


You can check out the source of this page to see how that's done, and make sure to bookmark [the vast library of Pygment lexers][lexers], we accept the 'short name' or the 'mimetype' of anything in there.
[lexers]: http://pygments.org/docs/lexers/


Have fun!
