import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import * as Progress from 'react-native-progress';
import moment from 'moment/min/moment-with-locales';
import { Buffer } from 'buffer';
import MQTTConnection from './MQTTConnection';
import SituationInfo from './src/components/SituationInfo';

moment.locale('vi');
global.Buffer = Buffer;

const { width: widthProgress, height: heightProgress } = Dimensions.get('screen');
const widthHaftMatch = (widthProgress * 94 / 100 / 2) - 8; // Chiều rộng thanh progress bar của mỗi hiệp

const LiveScoreWidget = () => {
  const [score, setScore] = useState({home: 0, away: 0});
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [secondsHalf, setSecondsHalf] = useState(0);
  const [minutesHalf, setMinutesHalf] = useState(0);
  const [matchInfo, setMatchInfo] = useState([]);
  const matchRes = useRef([]);

  useEffect(() => {
    const intervalTime = setInterval(() => {
      setSeconds(prevSecond => {
        if(prevSecond >= 59) {
          setMinutes(prevMinute => prevMinute + 1);
          return 0;
        } else {
          return prevSecond + 1;
        }
      })
    }, 1000);

    return () => {
      clearInterval(intervalTime);
    };
  }, []);

  /**
   * MQTT
   */
  useEffect(() => {
    const mqttConnect = new MQTTConnection();

    mqttConnect.connect('2548d6d6a6be466e9c2b5e82d6f5fd10.s1.eu.hivemq.cloud', 8884, {
      userName: 'quocvy152',
      password: 'Anh0205vy1502',
      useSSL: true 
    });

    mqttConnect.onMQTTConnect = () => {
      console.log('App onMQTTConnect');
      mqttConnect.subcribeChannel('/match/events');
    };

    mqttConnect.onMQTTLost = () => {
      console.log('App onMQTTLost');
    };;

    mqttConnect.onMQTTMessageArrived = (message) => {
      const payload = message._getPayloadString();
      const matchInfoItem = JSON.parse(payload);
      matchRes.current.push(matchInfoItem);
      setMatchInfo(matchRes.current)
    };

    mqttConnect.onMQTTMessageDelivered = (message) => {
      console.log("onMQTTMessageDelivered:", message)
    };

    return () => {
      mqttConnect.close();
    }
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle={'light-content'}
        showHideTransition={'fade'}
      />
      <ImageBackground
        source={require('./src/images/bg_ip_15.png')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.timeAndCharging}>
          <Text style={styles.battery}>Đã sạc 100%</Text>
          <Text style={styles.time}>{moment().format('LT')}</Text>
        </View>
        
        <View>
          <View style={styles.bannerLiveScore}>
            <Image
              source={require('./src/images/bg_live_score.png')}
              resizeMode='cover'
              style={styles.imageLiveScore}
            />

            <View style={styles.card}>
              <Image
                source={require('./src/images/ic_sac_club.png')}
                style={styles.logo}
              />
              <View style={styles.scoreContainer}>
                <Text style={styles.leaugeName}>US OPEN CUP</Text>
                <Text style={styles.score}>
                  {matchInfo.filter(matchInfoElem => matchInfoElem.team === 'home' && matchInfoElem.type === 'goal').length} - {matchInfo.filter(matchInfoElem => matchInfoElem.team === 'away' && matchInfoElem.type === 'goal').length}
                </Text>
                <Text style={styles.timeText}>
                  {minutes + minutesHalf < 10 ? `0${minutes + minutesHalf}` : minutes + minutesHalf}:
                  {seconds + secondsHalf < 10 ? `0${seconds + secondsHalf}` : seconds + secondsHalf}
                </Text>
              </View>
              <Image
                source={require('./src/images/ic_sea_club.png')}
                style={styles.logo}
              />
            </View>

            <View style={styles.matchProgress}>
              <View 
                style={styles.containerFirstHalf}
              >
                <Progress.Bar 
                  animated={true}
                  progress={(minutes * 60 + seconds) / (45 * 60)} 
                  width={widthHaftMatch} 
                  color={'rgba(253,95,0,255)'}
                  unfilledColor={'rgba(66,66,66,255)'}
                  borderColor={'rgba(66,66,66,255)'}
                />
                <SituationInfo
                  matchInfo={JSON.stringify(matchInfo)}
                  widthHaftMatch
                  typeHalf={'first_half'}
                />
              </View>
              <View 
                style={styles.containerSecondHalf}
              >
                <Progress.Bar 
                  animated={true}
                  progress={(minutesHalf * 60 + secondsHalf) / (90 * 60)} 
                  width={widthHaftMatch} 
                  color={'rgba(253,95,0,255)'}
                  unfilledColor={'rgba(66,66,66,255)'}
                  borderColor={'rgba(66,66,66,255)'}
                />
                <SituationInfo
                  matchInfo={JSON.stringify(matchInfo)}
                  widthHaftMatch
                  typeHalf={'second_half'}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 13}}>Cho phép Hoạt động trực tiếp từ LiveScore?</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 45,
                  marginVertical: 20
                }}>
                <TouchableOpacity>
                  <Text style={{color: '#fff'}}>Từ chối</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={{color: '#fff'}}>Cho phép</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonFeature}>
            <TouchableOpacity 
              activeOpacity={0.5}
              style={styles.wrapIconFeature}>
              <Image
                source={require('./src/images/ic_flash.png')}
                style={styles.iconFeature}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.5}
              style={styles.wrapIconFeature}>
              <Image
                source={require('./src/images/ic_camera.png')}
                style={styles.iconFeature}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  time: {
    fontSize: 85,
    fontWeight: 'bold',
    color: '#fff',
  },
  battery: {
    fontSize: 16,
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  logo: {
    width: 40,
    height: 40,
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 7,
  },
  leaugeName: {
    fontSize: 12,
    color: '#fff',
  },
  timeText: {
    fontSize: 14,
    color: 'orange',
  },
  buttonContainer: {
    marginTop: 20,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  timeAndCharging: {
    alignItems: 'center',
    marginTop: 20,
  },
  bannerLiveScore: {
    backgroundColor: '#000000',
    marginLeft: '3%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: '94%'
  },
  imageLiveScore: {
    position: 'absolute',
    height: 120,
    width: '100%',
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonFeature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginHorizontal: 45,
  },
  iconFeature: {
    width: 30,
    height: 30,
  },
  wrapIconFeature: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30
  },
  matchProgress: {
    backgroundColor: 'rgba(23,23,23,255)',
    height: 60,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  containerFirstHalf: {
    
  },
  containerSecondHalf: {

  },
});

export default LiveScoreWidget;
