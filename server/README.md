### Development

```shell
npm start

# websocket access at ws://localhost:8999

# compile flatbuffer
flatc --js packet.fbs
```

```shell
env $(cat .env) node zmq/pub.js
env $(cat .env) node zmq/sub.js
```
