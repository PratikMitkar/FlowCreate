#!/bin/bash

# Script to deploy FlowCreate to GitHub and set up GitHub Pages

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI could not be found. Please install it from https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null
then
    echo "Please log in to GitHub CLI first:"
    gh auth login
fi

# Get repository name from user
read -p "Enter GitHub repository name (e.g., flowcreate): " REPO_NAME

# Get GitHub username
GH_USERNAME=$(gh api user | jq -r '.login')

echo "Creating repository $REPO_NAME under $GH_USERNAME..."

# Create repository
gh repo create $GH_USERNAME/$REPO_NAME --public --push --source=. --remote=origin

echo "Repository created successfully!"

echo "Setting up GitHub Pages..."

# Enable GitHub Pages
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/$GH_USERNAME/$REPO_NAME/pages \
  -f source="gh-pages"

echo "GitHub Pages configured!"

echo "Deployment complete!"
echo "Your site will be available at: https://$GH_USERNAME.github.io/$REPO_NAME/"
echo "The first deployment may take a few minutes to complete."