# Storybook Deployment to Vercel

This guide explains how to deploy the Storybook documentation to Vercel.

## Prerequisites

1. **Vercel CLI**: Install the Vercel CLI globally
   ```bash
   npm install -g vercel
   ```

2. **Vercel Account**: Make sure you have a Vercel account and are logged in
   ```bash
   vercel login
   ```

## Deployment Methods

### Method 1: Using the Deployment Script (Recommended)

The easiest way to deploy Storybook is using the provided deployment script:

```bash
# Using npm script
pnpm run deploy-storybook

# Or directly
./deploy-storybook.sh
```

This script will:
1. Build the Storybook static files
2. Deploy to Vercel using the custom configuration
3. Provide you with the deployment URL

### Method 2: Manual Deployment

1. **Build Storybook**:
   ```bash
   pnpm build-storybook
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --config vercel-storybook.json --prod
   ```

### Method 3: GitHub Integration

For automatic deployments on every push:

1. Connect your repository to Vercel
2. Create a new project in Vercel dashboard
3. Set the following build settings:
   - **Build Command**: `pnpm build-storybook`
   - **Output Directory**: `storybook-static`
   - **Install Command**: `pnpm install`

## Configuration Files

- `vercel-storybook.json`: Custom Vercel configuration for Storybook deployment
- `deploy-storybook.sh`: Automated deployment script
- `.storybook/`: Storybook configuration directory

## Troubleshooting

### Build Failures
- Ensure all dependencies are installed: `pnpm install`
- Check that Storybook builds locally: `pnpm build-storybook`
- Verify Node.js version compatibility (22.x)

### Deployment Issues
- Make sure you're logged into Vercel: `vercel login`
- Check your Vercel account has sufficient resources
- Verify the `vercel-storybook.json` configuration is correct

### Access Issues
- Storybook will be deployed as a separate project from your main app
- The deployment URL will be different from your main application
- You can set up a custom domain in Vercel dashboard if needed

## Environment Variables

If your Storybook requires environment variables:
1. Add them to your Vercel project settings
2. Update the `vercel-storybook.json` if needed
3. Ensure they're prefixed correctly for client-side access

## Custom Domain

To set up a custom domain for your Storybook:
1. Go to your Vercel dashboard
2. Select the Storybook project
3. Navigate to Settings > Domains
4. Add your custom domain (e.g., `storybook.yourdomain.com`)

## Maintenance

- Redeploy after significant component changes
- Keep Storybook dependencies updated
- Monitor deployment logs for any issues
- Consider setting up automatic deployments for main branch