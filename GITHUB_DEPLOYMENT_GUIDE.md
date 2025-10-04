# GitHub Pages Deployment Guide

This guide will help you deploy the FlowCreate project to GitHub Pages successfully.

## Prerequisites

1. A GitHub account
2. This repository forked or cloned to your account
3. Basic knowledge of Git and GitHub

## Deployment Steps

### 1. Repository Setup

1. Create a new repository on GitHub (or use an existing one)
2. If using an existing repository, ensure it's empty or you're okay with overwriting its contents
3. Note your repository name - you'll need it for configuration

### 2. Update Configuration

Before deploying, you need to update the configuration to match your repository name:

1. Open `next.config.mjs`
2. Update the `basePath` and `assetPrefix` values to match your repository name:
   ```javascript
   // If your repository is named "my-flowcharts", change to:
   basePath: process.env.NODE_ENV === 'production' ? '/my-flowcharts' : '',
   assetPrefix: process.env.NODE_ENV === 'production' ? '/my-flowcharts/' : '',
   ```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. In the left sidebar, click on "Pages"
4. Under "Build and deployment":
   - Select "GitHub Actions" as the source
   - Click "Save"

### 4. Push Your Code

If you haven't already, push your code to GitHub:

```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

### 5. Trigger Deployment

The deployment will automatically start when you push to the `main` branch. You can also trigger it manually:

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Deploy to GitHub Pages" workflow
4. Click "Run workflow" button

## Troubleshooting Common Issues

### Error: "Creating Pages deployment failed" or "Not Found"

This error typically occurs when GitHub Pages is not properly enabled:

1. Double-check that you've enabled GitHub Pages in your repository settings
2. Ensure you've selected "GitHub Actions" as the source
3. Verify that your repository is public (private repositories require GitHub Pro for GitHub Pages)

### Path Issues (404 errors after deployment)

If your site deploys but pages return 404 errors:

1. Check that the `basePath` in `next.config.mjs` matches your repository name exactly
2. Ensure the path is case-sensitive (e.g., `/FlowCreate` vs `/flowcreate`)
3. Verify that the `out` directory is being generated correctly during build

### Custom Domain Issues

If you're using a custom domain:

1. Add your domain to the "Custom domain" field in GitHub Pages settings
2. Ensure your DNS is properly configured
3. Add a `CNAME` file to the `public` directory with your domain

### Build Failures

If the build fails during deployment:

1. Check the Actions tab for detailed error messages
2. Ensure all dependencies are properly listed in `package.json`
3. Verify that the build command (`npm run build`) works locally

## Repository Settings Checklist

Before deployment, ensure your repository settings are correct:

- [ ] Repository is public (or you have GitHub Pro)
- [ ] GitHub Pages is enabled
- [ ] Source is set to "GitHub Actions"
- [ ] `next.config.mjs` basePath matches repository name
- [ ] No typos in repository name or configuration

## Post-Deployment

After successful deployment:

1. Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`
2. The first deployment may take a few minutes to go live
3. Subsequent deployments will be faster

## Need Help?

If you're still experiencing issues:

1. Check the GitHub Actions logs for detailed error messages
2. Verify all configuration files are correct
3. Ensure your repository settings match the requirements
4. Open an issue in this repository for assistance

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)