# a3
a3 - appraisal asset assistant  
Working flow: Upload redbook image then receive home's valuation  

I/ source tree:  
a3/
├── site/ # website, documents, public statics
│   └── wrangler.toml
├── app/ # frontend
│   └── wrangler.toml
├── api/ # backend
│   ├── wrangler.toml
│   ├── package.json
│   └── src/
│       └── index.js
└── auth/ # authencation service
    ├── wrangler.toml
    ├── package.json
    └── src/
        └── index.js

2/ Used Techologies:  
Frontend: React.js  
Backend: Express.js / AWS Bedrock  
Database: NeonSQL  
devsecops: github, cloudflare   