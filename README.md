![PARANOID](https://raw.githubusercontent.com/sdesalas/paranoid/master/design/logo.512x256.png)

Paranoid is a cross-platform app for running automated tests.

It is written using node-webkit, with PhantomJS as its core scripting engine.

### Simplified SQL-like Syntax

The thing that sets Paranoid apart from other test frameworks is the simplicity of the syntax for writing tests. It is aimed at testers who are savvy enough to write their own code and want a great degree of precision, but struggle to use more complex frameworks like Selenium.

An example of a test is as follows:

```
 1. GO TO "http://www.valuetrader.net/"
 2. CLICK ON "a.login"
 3. WAIT FOR RESPONSE
 4. CLICK ON "input[name=User.Email]" AND WRITE "joe.smith@gmail.com"
 5. CLICK ON "input[name=User.Password]" AND WRITE "mysecret"
 6. WAIT FOR RESPONSE
 7. CLICK ON "input[name=User.Terms]"
 8. CLICK ON "input[value=Login]"
 9. TAKE SCREENSHOT
10. WAIT FOR RESPONSE
11. CHECK "a#user-nav-link" EXISTS
12. TAKE SCREENSHOT
```
