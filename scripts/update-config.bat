@echo off
setlocal

if "%1"=="" (
    echo Please provide a repository name as an argument
    echo Usage: update-config.bat ^<repository-name^>
    exit /b 1
)

set REPO_NAME=%1

echo Updating configuration for repository: %REPO_NAME%

node "%~dp0update-config.js" %REPO_NAME%

if %errorlevel% neq 0 (
    echo Failed to update configuration
    exit /b %errorlevel%
)

echo Configuration updated successfully!
echo.
echo Next steps:
echo 1. Commit these changes: git add . && git commit -m "Update config for %REPO_NAME%"
echo 2. Push to GitHub: git push origin main
echo 3. Enable GitHub Pages in your repository settings

endlocal