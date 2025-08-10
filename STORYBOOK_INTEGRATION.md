# Storybook Integration

This project now has Storybook integrated into the main application build, allowing you to access Storybook under the same domain at the `/storybook` path.

## Development

### Option 1: Run Storybook and Main App Separately
```bash
# Terminal 1: Main app
pnpm dev

# Terminal 2: Storybook
pnpm storybook
```

### Option 2: Run Both Concurrently
```bash
pnpm run dev:storybook
```
This will start both the main app (http://localhost:5173) and Storybook (http://localhost:6006) simultaneously.

## Production Build

The build process now automatically includes Storybook:

```bash
pnpm build
```

This command:
1. Builds the main Vite application
2. Builds Storybook static files
3. Copies Storybook files to `dist/storybook/`

## Deployment

After deployment, Storybook will be available at:
- **Production**: `https://yourdomain.com/storybook`
- **Local Preview**: `http://localhost:4173/storybook`

### Vercel Configuration

The `vercel.json` has been updated to properly route Storybook requests:

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/storybook/(.*)", "dest": "/storybook/$1" },
    { "src": "/storybook", "dest": "/storybook/index.html" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## Testing the Integration

### Local Preview
```bash
pnpm build
pnpm preview
```

Then visit:
- Main app: http://localhost:4173
- Storybook: http://localhost:4173/storybook

### Verify Build Output
After building, check that the `dist/` directory contains:
```
dist/
├── assets/          # Main app assets
├── index.html       # Main app
└── storybook/       # Storybook files
    ├── index.html
    ├── assets/
    └── ...
```

## Benefits

1. **Single Domain**: Storybook and main app share the same domain
2. **Simplified Deployment**: One deployment process for both
3. **Consistent Environment**: Same build and deployment pipeline
4. **Easy Access**: No need to remember separate Storybook URLs

## Scripts Reference

- `pnpm dev` - Start main app only
- `pnpm storybook` - Start Storybook only
- `pnpm run dev:storybook` - Start both concurrently
- `pnpm build` - Build both main app and Storybook
- `pnpm preview` - Preview the built application with Storybook