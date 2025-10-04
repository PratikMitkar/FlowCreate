@echo off
echo Deploying FlowCreate to GitHub...

REM Check if GitHub CLI is installed
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo GitHub CLI could not be found. Please install it from https://cli.github.com/
    pause
    exit /b 1
)

REM Check if user is logged in to GitHub CLI
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo Please log in to GitHub CLI first:
    gh auth login
)

REM Get repository name from user
set /p REPO_NAME="Enter GitHub repository name (e.g., flowcreate): "

REM Get GitHub username
for /f "delims=" %%i in ('gh api user ^| jq -r ".login"') do set GH_USERNAME=%%i

echo Creating repository %REPO_NAME% under %GH_USERNAME%...

REM Create repository
gh repo create %GH_USERNAME%/%REPO_NAME% --public --push --source=. --remote=origin

echo Repository created successfully!

echo Setting up GitHub Pages...

REM Enable GitHub Pages
gh api ^
  --method PUT ^
  -H "Accept: application/vnd.github+json" ^
  -H "X-GitHub-Api-Version: 2022-11-28" ^
  /repos/%GH_USERNAME%/%REPO_NAME%/pages ^
  -f source="gh-pages"

echo GitHub Pages configured!

echo Deployment complete!
echo Your site will be available at: https://%GH_USERNAME%.github.io/%REPO_NAME%/
echo The first deployment may take a few minutes to complete.

pause