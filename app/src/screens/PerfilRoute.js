//classe PerfilRoute
import app from '@/app/firebaseConfig';
import { getAuth, signOut } from "firebase/auth";
import { Button, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import Usuario from '../classes/Usuario';

const PerfilRoute=({navigation})=>{
    const usuario = new Usuario("Nome:", "Sobrenome:", 25, "11/08/1998", "wesley@gmail.com", 94999030066)

    const auth = getAuth(app);

    const signOutPress = () =>{
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.navigate('Login');
        }).catch((error) => {
            // An error happened.
        });    
    }
    
    //const usuario, responsavel por chamar o construtor usuario instanciando as suas informações
    return(
        <View style={styles.informacoesPessoais}>
            <Avatar.Image size={100} style={styles.imagem} source={require('../midia/avatar-icon.png')} />
            {/*View responsável pelo avatar*/}
            <View style={styles.containerText}>
            {/* View responsável pelos textos de informação do usuário, 
            chamando o construtor com as informações do usuário*/}
                <Text style={styles.texto}>{usuario.getNome()}</Text>
                <Text style={styles.texto}>{usuario.getSobrenome()}</Text>
                <Text style={styles.texto}>{usuario.getIdade()}</Text>
                <Text style={styles.texto}>{usuario.getNascimento()}</Text>
                <Text style={styles.texto}>{usuario.getEmail()}</Text>
                <Text style={styles.texto}>{usuario.getTelefone()}</Text>

                <View>
                <Text>Novidades</Text>
                <Text>Preferências</Text>
                <Text>Histórico</Text>
                
                <Button onPress={()=>signOutPress()} title="Sair"/>
            </View>
                
            </View>

            

        </View>
    )
}   
const styles = StyleSheet.create({
//criando um construtor com stylesheet, para realizar modificações com informações pessoais, imagem e texto.
    informacoesPessoais:{
        flexDirection:"row",
        alignItems:"center",
    },   
    imagem:{
        marginTop: 10,
        marginLeft: 20,
    },
    texto:{
        fontSize:16,
        color:"black",
    },
    containerText:{
        marginLeft: 20,
    }
})
export default PerfilRoute;