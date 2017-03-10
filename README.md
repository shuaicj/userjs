# userjs
A REST user module based on Node.js.

### api

##### POST /users
- request 
    - body: { username, password }
- response:
    - status: 200, body: { username, createdTime }
    - status: 400, body: validation error message
    - status: 500, body: db error

##### GET /users/:username
- request 
    - param: username
- response:
    - status: 200, body: { username, existence[bool] }
    - status: 400, body: validation error message
    - status: 500, body: db error

