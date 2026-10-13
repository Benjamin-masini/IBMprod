@echo off
setlocal
set DIRNAME=%~dp0
"%JAVA_HOME%\bin\java" -jar "%DIRNAME%gradle\wrapper\gradle-wrapper.jar" %*
