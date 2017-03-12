# userjs
A REST user module based on Node.js.

### api
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

