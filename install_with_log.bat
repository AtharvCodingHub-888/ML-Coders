@echo off
echo Starting installation... > install.log
npm install @floating-ui/react >> install.log 2>&1
npm install >> install.log 2>&1
echo Finished installation. >> install.log
