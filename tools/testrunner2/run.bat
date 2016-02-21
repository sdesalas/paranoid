@if (1==1) @if(1==0) @ELSE
@echo off
@SETLOCAL ENABLEEXTENSIONS
:: CHECK IF WE NEED TO MODIFY PATH
ECHO ;%PATH%; | find /C /I ";%~dp0tools\phantomjs;" > NUL
IF %ERRORLEVEL% GTR 0 (
	:: ECHO Adding phantom and casper to PATH
	SET "path=%path%;%~dp0tools\phantomjs;%~dp0tools\casperjs\batchbin"
 ) 
:: EXECUTE AFTER REPARSING BATCH INPUT
IF "%SPECIALPARSE%"=="*%~f0" (
    :: SECOND RUN - EXECUTE
    ECHO del /q "%targetdir%..\results\*.*"
    del /q "%targetdir%..\results\*.*" >NUL
    ECHO casperjs.bat test "%installdir%tools\run.js" --testrunner-target=%target% "--xunit=%targetdir%..\results\latest.xunit.xml" %~2 %~3 %~4 %~5 %~6 %~7 %~8 %~9
    casperjs.bat test "%installdir%tools\run.js" --testrunner-target=%target% "--xunit=%targetdir%..\results\latest.xunit.xml" %~2 %~3 %~4 %~5 %~6 %~7 %~8 %~9 
    ECHO mkdir "%targetdir%..\results\%timestamp%__%targetfile%"
    mkdir "%targetdir%..\results\%timestamp%__%targetfile%" >NUL
    ECHO copy /y "%targetdir%..\results\*.*" "%targetdir%..\results\%timestamp%__%targetfile%"
    copy /y "%targetdir%..\results\*.*" "%targetdir%..\results\%timestamp%__%targetfile%" >NUL
) ELSE (
	:: FIRST RUN - SETUP
	SET target=%1
    SET targetfile=%~n1%~x1
    SET installdir=%~dp0
	SET targetdir=%~dp1
    DEL /Q %~dp0results\*.*
    FOR /F "DELIMS=" %%A IN ('%~dp0tools\getdate.cmd') DO SET "timestamp=%%A"
    SET "SPECIALPARSE=*%~f0"
    cscript //E:JScript //nologo "%~f0" %*
)
@goto :EOF
@end @ELSE
w=WScript,wa=w.Arguments,al=wa.length,Sh=w.CreateObject("WScript.Shell"),p="";
for(i=0;i<al;++i)p+="\"--"+wa.Item(i)+"\" ";
function PipeStream(i,o){for(;!i.AtEndOfStream;)o.Write(i.Read(1))}
function Exec(cmd,e){
    try{
        e=Sh.Exec(cmd);
        while(e.Status==0){
            w.Sleep(99);
            PipeStream(e.StdOut,w.StdOut);
            PipeStream(e.StdErr,w.StdErr);
        }
        return e.ExitCode;
    }catch(e){return e.number;}
}
w.Quit(Exec("\""+WScript.ScriptFullName+"\" "+p));
@end
