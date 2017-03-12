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
    - status: 200, body: { username, createdTime }
    - status: 400, body: { message: 'already exists' }

##### GET /users/:username
- request 
    - param: username
- response:
    - status: 200, body: { username, createdTime }
    - status: 404, body: { message: 'not found' }

##### DELETE /users/:username
- request 
    - param: username
- response:
    - status: 200, body: { message: 'ok' }
    - status: 404, body: { message: 'not found' }

## Auth Config
#### How to create mongodb user
```
use hellouserjs;
db.createUser({
    user: "hellouserjsu", 
    pwd: "hellouserjsp", 
    roles: [{role: "readWrite", db: "hellouserjs"}]
});
```

#### How to modify config
Assuming that mongodb is installed via `brew`. The config file is located
at `/usr/local/etc/mongod.conf`. Append to the config file with:
`security.authorization: enabled`

#### How to start
`mongod --config /usr/local/etc/mongod.conf`

#### How to connect via `mongo`
`mongo -u hellouserjsu -p hellouserjsp hellouserjs`

#### Note 
If there is already a collecton named 'users', drop it by `db.users.drop()`; Or
the unique index will not work.
