#!/usr/bin/env sh
##############################################################################
# Gradle start up script for UN*X
##############################################################################
# attempts to set APP_HOME to the directory this script lives in
PRG="$0"
while [ -h "$PRG" ] ; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`"/$link"
  fi
done
PRGDIR=`dirname "$PRG"`

exec "$PRGDIR/gradle/wrapper/gradle-wrapper.jar" "$@"
