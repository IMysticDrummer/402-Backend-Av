# nodeapp

Copy .env.example to .env

```sh
cp .env.example .env
```

and review your configuration

Start the application:

In production:

On first deploy, load initial data into the database:

```javascript
node initDB.js
```

```sh
npm start
```

In development

```sh
npm run dev
```

## API

### GET /api/agentes

Return a list of agents. Example:

```json
{
  "results": [
    { "name": "Jones", "age": 41 },
    { "name": "Brown", "age": 22 }
  ]
}
```
