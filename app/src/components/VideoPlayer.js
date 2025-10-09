import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
//Classe para video player dos estabelecimentos
const VideoPlayer = ({ videoURL }) => {

    const video = React.useRef(null);
    const windowDimensions = useWindowDimensions();

    const [status, setStatus] = useState({});

    const handleVideoPress = () => {
      if (status.isPlaying) {
          video.current.pauseAsync();
      } else {
          video.current.playAsync();
      }
  };
  return (
  //View do estabelecimento
    <TouchableOpacity onPress={handleVideoPress}>
      <Video
          ref={video}
          source={{ uri:  videoURL }}
          style={{width: windowDimensions.width, height: windowDimensions.width}}
          isLooping 
          resizeMode={ResizeMode.COVER}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          useNativeControls
      />
    </TouchableOpacity>
  );
};

export default VideoPlayer;