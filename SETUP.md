# Zapp.ie Setup Guide

Complete setup instructions for configuring Zapp.ie with LNbits and Azure AD authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [LNbits Configuration](#lnbits-configuration)
- [Azure AD App Registration](#azure-ad-app-registration)
- [Environment Configuration](#environment-configuration)
- [Installation Steps](#installation-steps)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** version 16, 18, or 20
  - If using Node 20, see package.json override note in main README
- **npm** (comes with Node.js)
- **Git** for version control
- **Visual Studio Code** (recommended)
  - [Teams Toolkit Extension](https://aka.ms/teams-toolkit) version 5.0.0+

### Required Accounts & Services

1. **Microsoft 365 Tenant**
   - Admin access to upload Teams apps
   - Azure AD tenant access
   - See [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)

2. **LNbits Instance**
   - Version 0.12 or higher
   - Admin access to create wallets and API keys
   - Can use [hosted instance](https://www.lnbits.com) or self-hosted

3. **Azure Subscription** (for deployment)
   - Required only for production deployment
   - Free tier available

### Optional Tools

- **Azure Functions Core Tools** (for local Azure Functions development)
  ```bash
  npm install -g azure-functions-core-tools@4
  ```
- **Teams Toolkit CLI**
  ```bash
  npm install -g @microsoft/teamsfx-cli
  ```

---

## LNbits Configuration

### 1. Access Your LNbits Instance

For KnowAll AI production:
- URL: `https://bank.knowall.ai/`
- Login with your admin credentials

### 2. Retrieve Required Information

You'll need the following from LNbits:

#### A. Admin Key
1. Navigate to your wallet in LNbits
2. Click on wallet settings
3. Copy the **Admin key** (long alphanumeric string)
4. Save this securely - it provides full wallet access

#### B. Invoice/Read Key
1. In the same wallet settings
2. Copy the **Invoice key** (also called "inkey")
3. This key allows creating invoices but not spending funds

#### C. Store ID (Optional - for Nostr Market extension)
1. Go to **Extensions** → **Nostr Market**
2. Find your **Store ID**
3. Only required if using reward products feature

### 3. User Manager Extension

Ensure the **User Manager** extension is enabled in LNbits:
1. Go to **Extensions** in LNbits
2. Enable **User Manager**
3. This allows the app to create and manage user wallets

---

## Azure AD App Registration

### 1. Create App Registration

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Azure Active Directory** → **App registrations**
3. Click **+ New registration**
4. Configure:
   - **Name**: `Zapp.ie` (or your preferred name)
   - **Supported account types**:
     - Select "Accounts in this organizational directory only"
   - **Redirect URI**: Leave blank for now (will add later)
5. Click **Register**

### 2. Note Your Application IDs

After registration, copy these values:
- **Application (client) ID**: Found on the Overview page
- **Directory (tenant) ID**: Also on the Overview page

Example:
```
Client ID: d750d53f-eaba-4f49-b39b-fba19866058c
Tenant ID: f36f6414-cb7d-4545-9cf2-7574f7b5c584
```

### 3. Configure Authentication

1. In your App Registration, click **Authentication** in the left menu
2. Click **+ Add a platform**
3. Select **Single-page application (SPA)**
4. Add these **Redirect URIs**:
   ```
   http://localhost:3000/auth-end
   http://localhost:3000
   ```
5. For production, also add:
   ```
   https://your-production-domain.com/auth-end
   https://your-production-domain.com
   ```
6. Under **Front-channel logout URL**, add:
   ```
   http://localhost:3000
   ```
7. Under **Implicit grant and hybrid flows**, enable:
   - ✅ **Access tokens** (used for implicit flows)
   - ✅ **ID tokens** (used for implicit and hybrid flows)
8. Click **Save**

### 4. Configure API Permissions

1. Click **API permissions** in the left menu
2. Verify **User.Read** permission exists (should be there by default)
3. If not, click **+ Add a permission**:
   - Select **Microsoft Graph**
   - Select **Delegated permissions**
   - Check **User.Read**
   - Click **Add permissions**
4. Click **Grant admin consent** for your organization

### 5. Create Client Secret (Optional - for backend services)

Only needed if using server-side authentication:
1. Click **Certificates & secrets**
2. Click **+ New client secret**
3. Add description and expiry
4. Copy the **Value** immediately (won't be shown again)

---

## Environment Configuration

### 1. Backend Configuration (Bot Service)

File: `env/.env.dev`

```bash
# Built-in environment variables
TEAMSFX_ENV=dev
APP_NAME_SUFFIX=dev

# Azure AD Configuration
AAD_APP_CLIENT_ID=<your-client-id>
AAD_APP_OBJECT_ID=<from-azure-portal>
AAD_APP_TENANT_ID=<your-tenant-id>
AAD_APP_OAUTH_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id>
AAD_APP_OAUTH_AUTHORITY_HOST=https://login.microsoftonline.com

# Teams App Configuration
TEAMS_APP_ID=<generated-during-provision>
BOT_ID=<generated-during-provision>
BOT_DOMAIN=<your-ngrok-or-devtunnel-url>

# LNbits Configuration
LNBITS_NODE_URL=https://bank.knowall.ai
LNBITS_USERNAME=your-lnbits-username
LNBITS_PASSWORD=your-lnbits-password
LNBITS_ADMINKEY=your-admin-key-from-lnbits
LNBITS_INITIAL_ALLOWANCE=15000
LNBITS_POINTS_LABEL="Evo Sats"
```

### 2. Frontend Configuration (React App)

File: `tabs/.env.development`

```bash
# LNbits Configuration
REACT_APP_LNBITS_NODE_URL=https://bank.knowall.ai
REACT_APP_LNBITS_USERNAME=your-lnbits-username
REACT_APP_LNBITS_PASSWORD=your-lnbits-password
REACT_APP_LNBITS_ADMINKEY=your-admin-key-from-lnbits
REACT_APP_LNBITS_STORE_ID=your-store-id-if-using-nostr-market
REACT_APP_LNBITS_STORE_OWNER_EMAIL=your-email@knowall.ai
REACT_APP_LNBITS_POINTS_LABEL="Evo Sats"

# Azure AD Configuration
REACT_APP_TENANT_ID=f36f6414-cb7d-4545-9cf2-7574f7b5c584
REACT_APP_AAD_CLIENT_ID=d750d53f-eaba-4f49-b39b-fba19866058c
```

### 3. Production Configuration

For production, create:
- `env/.env.prod` (backend)
- `tabs/.env.production` (frontend)

Same structure as development, but with production values:
- Production domain URLs instead of localhost
- Production LNbits instance (if different)
- Production Azure AD app registration (if separate)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GetZapl.ie
```

### 2. Install Dependencies

```bash
# Install root dependencies (bot service)
npm install

# Install Azure Functions dependencies
cd functions
npm install
cd ..

# Install React app dependencies
cd tabs
npm install
cd ..
```

### 3. Configure Environment Files

1. Copy example environment files:
   ```bash
   cp env/.env.dev.example env/.env.dev
   cp tabs/.env.development.example tabs/.env.development
   ```

2. Edit the files with your actual values (see [Environment Configuration](#environment-configuration))

### 4. Build the Bot Service

```bash
npm run build
```

This compiles TypeScript to JavaScript and excludes test files.

---

## Running the Application

### Option 1: Run Everything (Recommended for Testing)

```bash
# Terminal 1 - React Frontend + Backend Server
cd tabs
npm start
# This starts both the Express server (port 5000) and React app (port 3000)
```

The bot service and Azure Functions are optional for frontend-only testing.

### Option 2: Run Components Separately

```bash
# Terminal 1 - Bot Service (Teams integration)
npm run start
# Runs on port 3978

# Terminal 2 - Azure Functions (optional)
cd functions
npm run start
# Requires Azure Functions Core Tools

# Terminal 3 - React Frontend
cd tabs
npm start
# Backend server: http://localhost:5000
# React app: http://localhost:3000
```

### Option 3: Run with Teams Toolkit (Full Teams Experience)

```bash
# From VS Code
F5 to start debugging
# Or select "Debug in Teams (Edge)" from Run and Debug panel
```

### Access the Application

- **React App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Bot Service**: http://localhost:3978
- **Teams**: Via Teams Toolkit or manual app upload

---

## Troubleshooting

### Authentication Errors

#### Error: AADSTS50011 - No reply address registered

**Cause**: Redirect URI not configured in Azure AD App Registration

**Solution**:
1. Go to Azure Portal → App registrations
2. Find your app
3. Click Authentication
4. Add `http://localhost:3000/auth-end` to Redirect URIs
5. Save changes
6. Clear browser cache and try again

#### Error: Wrong tenant appearing

**Cause**: Old tenant ID cached in environment

**Solution**:
1. Update `REACT_APP_TENANT_ID` in `tabs/.env.development`
2. Clear browser local storage:
   - Open DevTools (F12)
   - Application → Local Storage
   - Delete all entries for localhost:3000
3. Hard refresh (Ctrl+Shift+R)

### Port Conflicts

#### Error: EADDRINUSE - Port already in use

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill //F //PID <process-id>

# Linux/Mac
lsof -i :3000
kill -9 <process-id>
```

### LNbits Connection Issues

#### Error: Cannot connect to LNbits

**Check**:
1. LNbits URL is correct and accessible
2. Username and password are correct
3. Admin key is valid (not expired)
4. LNbits instance is running
5. No firewall blocking the connection

**Test manually**:
```bash
curl -X POST https://bank.knowall.ai/api/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"your-password"}'
```

Should return an `access_token`.

### Build Errors

#### TypeScript Errors in Test Files

**Cause**: Test files being included in build

**Solution**: Already fixed in `tsconfig.json`:
```json
{
  "exclude": ["node_modules", "tabs", "functions", "**/*.test.ts", "**/*.spec.ts"]
}
```

#### Missing Azure Functions Core Tools

**Error**: `'func' is not recognized`

**Solution**:
```bash
npm install -g azure-functions-core-tools@4
```

---

## Additional Resources

- [Main README](./README.md) - Project overview and basic setup
- [Teams Toolkit Documentation](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [LNbits Documentation](https://github.com/lnbits/lnbits/wiki)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/overview)

---

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review logs in browser DevTools (F12)
- Check background processes with `/bashes` command (if using Claude Code)
- Tag us on Twitter/Nostr

---

**Last Updated**: 2025-01-07
**Version**: 1.0.0
