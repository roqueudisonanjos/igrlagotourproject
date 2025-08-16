import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Icon} from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const IconesCategorias = ({index}) =>{

    const icones = [
        <Ionicons name="restaurant-outline" size={24} color="black" />,
        <FontAwesome name="soccer-ball-o" size={24} color="black" />,
        <Icon source="bed-outline" size={24} color="black"/>,
        <MaterialIcons name="healing" size={24} color="black" />,
        //<Icon source="storefront-outline" size={24} color="black"/>,
        <MaterialIcons name="cleaning-services" size={24} color="black" />,
        <MaterialIcons name="sports-gymnastics" size={24} color="black" />,
        <Entypo name="drink" size={24} color="black" /> ,
        <MaterialIcons name="food-bank" size={24} color="black" />,
        <MaterialIcons name="park" size={24} color="black" />,
        <MaterialCommunityIcons name="pool" size={24} color="black" />,
        <Ionicons name="school-outline" size={24} color="black" />
    ]

    return (
        icones[index]
    )
}

export default IconesCategorias;