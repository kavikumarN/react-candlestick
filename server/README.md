### Development

```shell
npm start

# websocket access at ws://localhost:8999

# compile flatbuffer
flatc --js packet.fbs
```

```shell
# test
npm test

env $(cat .env) node src/mock-pub.js
env $(cat .env) node src/index.js
```
