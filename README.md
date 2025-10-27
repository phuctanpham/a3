# Valumind

## Working flow: Upload redbook image then receive home's valuation  

```
site: appraiser.pages.dev  
app: vpbank.pages.dev  
api: api.vpbank.workers.dev  
auth: auth.vpbank.workers.dev  
```

### I/ source tree:  

```
valumind/  
├── site/ # website, documents, public statics  
│   └── wrangler.toml  
├── app/ # frontend  
│   └── wrangler.toml  
├── api/ # backend  
│   ├── wrangler.toml  
│   ├── package.json
│   ├── dist/
│   └── src/  
│       └── main.ts  
└── auth/ # authencation service   
│   ├── wrangler.toml  
│   ├── package.json
│   ├── dist/
│   └── src/  
│       └── main.ts  
```

### II/ Used Techologies:  
```
Frontend: React.js    
Backend: Express.js / AWS Bedrock  / AWS SES  
Database: NeonSQL  / AWS S3  
devsecops: github, cloudflare    
```
