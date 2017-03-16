# userjs
A REST user module based on Node.js.

## API
- general response:
    - status: 400, body: { message: validation error detail }
    - status: 500, body: { message: 'db error' }

##### POST /users
- request 
    - body: { username, password }
- response:
    - status: 200, body: { username, createdAt }
    - status: 400, body: { message: 'already exists' }

##### GET /users/:username
- request 
    - param: username
- response:
    - status: 200, body: { username, createdAt }
    - status: 404, body: { message: 'not found' }

##### PUT /users/:username
- request 
    - param: username
    - body: { oldPassword, newPassword }
- response:
    - status: 200, body: { username, updatedAt }
    - status: 404, body: { message: 'not found' }

##### DELETE /users/:username
- request 
    - param: username
    - body: { password }
- response:
    - status: 200, body: { message: 'ok' }
    - status: 404, body: { message: 'not found' }

##### POST /users/:username/sessions
- request 
    - param: username
    - body: { password }
- response:
    - status: 200, body: { username, sessionId, sessionCreatedAt }
    - status: 404, body: { message: 'not found' }

##### DELETE /users/:username/sessions/:sessionId
- request 
    - param: username, sessionId
- response:
    - status: 200, body: { message: 'ok' }
    - status: 404, body: { message: 'not found' }

## Mongodb Auth Config
#### Create mongodb user in no auth mode
```
use hellouserjs;
db.createUser({
    user: "hellouserjsu", 
    pwd: "hellouserjsp", 
    roles: [{role: "readWrite", db: "hellouserjs"}]
});
```

#### Modify mongodb config
Assuming that mongodb is installed via `brew`. The config file is located
at `/usr/local/etc/mongod.conf`. Append to the config file with:
`security.authorization: enabled`

#### Start mongodb in auth mode
`mongod --config /usr/local/etc/mongod.conf`

