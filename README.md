# Appraiser

## Working flow: Upload redbook image then receive home's valuation  

appraiser.dev.pages
vpbank.dev.pages
api.vpbank.workers.dev
auth.vpbank.workers.dev

### I/ source tree:  

```
a3/  
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

Frontend: React.js  
Backend: Express.js / AWS Bedrock  
Database: NeonSQL  
devsecops: github, cloudflare  
