import init from 'react_native_mqtt';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync : {
  }
});

function onConnect() {
  console.log("onConnect");
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}

let currentTime = +new Date();
let clientID = currentTime + uuid.v1();
clientID = clientID.slice(0, 23);

const MQTTConnection = new Paho.MQTT.Client('2548d6d6a6be466e9c2b5e82d6f5fd10.s1.eu.hivemq.cloud', 8884, clientID);
MQTTConnection.onConnectionLost = onConnectionLost;
MQTTConnection.onMessageArrived = onMessageArrived;
MQTTConnection.connect({ 
    onSuccess: onConnect, 
    userName: 'quocvy152',
    password: 'Anh0205vy1502',
    useSSL: true 
});

export default MQTTConnection;