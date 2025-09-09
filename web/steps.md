# Adithi Web – Run and Build Steps

## Windows PowerShell

```
cd C:\Users\karth\products\adithi-flow\Adithi-web
npm i --no-audit --no-fund
npm run dev
```

Force a specific port (e.g., 3001):
```
$env:PORT=3001; npm run dev
```

Health check:
```
Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/health
```

Clean and reinstall (if cache/module errors):
```
cd C:\Users\karth\products\adithi-flow\Adithi-web
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm i --no-audit --no-fund
npm run dev
```

Production build:
```
cd C:\Users\karth\products\adithi-flow\Adithi-web
npm run build
npm run start
```

## macOS/Linux

```
cd /path/to/Adithi-web
npm i --no-audit --no-fund
npm run dev
```

Specific port:
```
PORT=3001 npm run dev
```

Health check:
```
curl http://localhost:3000/api/health
```

Clean and reinstall:
```
cd /path/to/Adithi-web
rm -rf .next node_modules package-lock.json
npm cache clean --force
npm i --no-audit --no-fund
npm run dev
```

Production build:
```
cd /path/to/Adithi-web
npm run build
npm run start
```

## App URLs
- App: http://localhost:3000 (Next may auto-switch to 3001/3002 if busy)
- Health: http://localhost:3000/api/health

## Demo Credentials
- Owner: owner@demo.com / demo123
- Retailer: retailer@demo.com / demo123

