import React, {useState } from 'react';
import { useWindowDimensions} from 'react-native';
import { Video, ResizeMode } from 'expo-av';

//Classe para video player dos cards dos estabelecimentos
const CapaVideo = ({ videoURL }) => {
    const video = React.useRef(null);
    const windowDimensions = useWindowDimensions();

    const [status, setStatus] = useState({});

    return (
    //View dos cards
        <Video
            ref={video}
            source={{ uri:  videoURL }}
            style={{width: windowDimensions.width/3-3, height: windowDimensions.width/3-3, borderRadius: 8 }}
            isLooping 
            resizeMode={ResizeMode.COVER}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
            useNativeControls
        />
    );
};

export default CapaVideo;