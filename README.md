![PARANOID](https://raw.githubusercontent.com/sdesalas/paranoid/master/design/logo.512x256.png)

Paranoid is a cross-platform desktop app for running automated tests.

It is written using node-webkit, with PhantomJS as its core engine.

## Simplified SQL-like Syntax

The thing that sets Paranoid apart from other test frameworks is the simplicity of the syntax for writing tests. 

It is aimed at testers who want total control and are savvy enough to write their own code, but struggle to use more complex frameworks like Selenium.

An example of a test is as follows:

```
 1. GO TO "http://www.valuetrader.net/"
 2. TAKE SCREENSHOT
 3. CLICK ON "a.login"
 4. WAIT FOR RESPONSE
 5. CLICK ON "input[name=User.Email]" AND WRITE "joe.smith@gmail.com"
 6. CLICK ON "input[name=User.Password]" AND WRITE "mysecret"
 7. CLICK ON "input[name=User.Terms]"
 8. CLICK ON "input[value=Login]"
 9. TAKE SCREENSHOT
10. WAIT FOR RESPONSE
11. CHECK "a#user-nav-link" EXISTS
```

## User Interface

The user interface simplifies a lot of the workflows around creating and running various suites of tests.

![PARANOID](https://raw.githubusercontent.com/sdesalas/paranoid/master/design/screenshots/2016-02-22.History.png)

## Download Releases

#### [`v0.4.0`](https://github.com/sdesalas/paranoid/releases/tag/v0.4.0) aka 'TestDirector'
