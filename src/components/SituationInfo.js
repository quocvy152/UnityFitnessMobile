import React from 'react';
import {Image} from 'react-native';

const SituationInfo = ({
  matchInfo,
  widthHaftMatch,
  typeHalf
}) => {
  console.log("🚀 ~ matchInfo:", matchInfo)
  matchInfo = JSON.parse(matchInfo)

  return matchInfo.map(matchInfoElem => {
    const [minuteSituation, secondSituation] = matchInfoElem?.time.split(':');

    if (minuteSituation <= 45 && typeHalf === 'first_half') {
      const positionShowIcon = (minuteSituation / 45) * 100 * widthHaftMatch;

      if (matchInfoElem.type === 'goal') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_football.png')}
            style={{
              position: 'absolute',
              width: 12, 
              height: 12,
              borderRadius: 6,
              backgroundColor: 'white',
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }

      if (matchInfoElem.type === 'fault_yellow') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_yellow_card.png')}
            style={{
              position: 'absolute',
              width: 8,
              height: 12,
              backgroundColor: 'white',
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }

      if (matchInfoElem.type === 'fault_red') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_red_card.png')}
            style={{
              position: 'absolute',
              width: 8,
              height: 12,
              backgroundColor: 'white',
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }

      if (matchInfoElem.type === 'substitution') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_substitution.png')}
            style={{
              position: 'absolute',
              width: 12, 
              height: 12,
              borderRadius: 6,
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }
    } 
    
    if(minuteSituation > 45 && typeHalf === 'second_half') {
      const positionShowIcon = (minuteSituation / 90) * 100 * widthHaftMatch;

      if (matchInfoElem.type === 'goal') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_football.png')}
            style={{
              position: 'absolute',
              width: 12, 
              height: 12,
              borderRadius: 6,
              backgroundColor: 'white',
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }

      if (matchInfoElem.type === 'fault_yellow') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_yellow_card.png')}
            style={{
              position: 'absolute',
              width: 8,
              height: 12,
              backgroundColor: 'white',
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }

      if (matchInfoElem.type === 'fault_red') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_red_card.png')}
            style={{
              position: 'absolute',
              width: 8,
              height: 12,
              backgroundColor: 'white',
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }

      if (matchInfoElem.type === 'substitution') {
        return (
          <Image
            key={matchInfoElem.id}
            source={require('../../src/images/ic_substitution.png')}
            style={{
              position: 'absolute',
              width: 12, 
              height: 12,
              borderRadius: 6,
              top: matchInfoElem.team === 'home' ? -18 : 12,
              left: positionShowIcon,
            }}
          />
        );
      }
    }
  });
};

export default React.memo(SituationInfo)
