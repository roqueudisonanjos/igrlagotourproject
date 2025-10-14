class Comentario{
    // Construtor que inicializa as variaveis dos comentarios
    //https://excalidraw.com/#room=02a25c89f98c540d891a,mNg35PAMISYuY27CORTnxw

    constructor(nome, texto, data){
        this.nome=nome;
        this.data=data;
        this.texto=texto;
    }
    getNome(){
        return this.nome;
    }
    //pegando a data do comentário e convertendo para o formato que conhecemos
    getDataFormatada(){
        const segundos=this.data.seconds;
        const nanoSegundos=this.data.nanoseconds;
        const data = new Date(segundos*1000 + nanoSegundos/1000000);
        const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth()+1).toString().padStart(2, '0')}/${data.getFullYear()}  ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`

        return dataFormatada;
    }
    getTexto(){
        return this.texto;
    }     
}
// Futuramente criar um comentário dentro de users, em storage no banco de dados, para facilitar a inserção de comentários

export default Comentario;