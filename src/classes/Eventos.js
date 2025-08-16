class Eventos{
    //iniciando o construtor dos com os itens utilizados para a criação e com as informações dos eventos 
    constructor(id, nome, localizacao, contatos, descricao, imagem, videos, entrada, tipo, nomeDoLocal, data, imagemCapa){
        this.nome=nome;
        this.localizacao=localizacao;
        this.contatos=contatos;
        this.descricao=descricao;
        this.imagem=imagem;
        this.videos=videos;
        this.entrada=entrada;
        this.tipo=tipo;
        this.nomeDoLocal=nomeDoLocal;
        this.data=data;
        this.imagemCapa=imagemCapa;
        this.id = id;
    }
    getNome(){
        return this.nome;
    }
    getLocalizacao(){
        return this.localizacao;
    }
    getContatos(){
        return this.contatos;
    }
    getDescricao(){
        return this.descricao;
    }
    getImagem(){
        return this.imagem;
    }
    getVideos(){
        return this.videos;
    }
    getEntrada(){
        return this.entrada;
    }
    getTipo(){
        return this.tipo;
    }
    getNomeDoLocal(){
        return this.nomeDoLocal;
    }
    getData(){
        //coloando a data do evento no formato 
        const data = this.getDataInFormatDate();
        const dataFormatada = `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth()+1).toString().padStart(2, '0')}/${data.getFullYear()}`  
        return dataFormatada;
    }
    getDataInFormatDate(){
        const segundos=this.data.seconds;
        const nanoSegundos=this.data.nanoseconds;
        const data = new Date(segundos*1000 + nanoSegundos/1000000);

        return data;
    }
    getHora(){
        const segundos=this.data.seconds;
        const nanoSegundos=this.data.nanoseconds;
        const data = new Date(segundos*1000 + nanoSegundos/1000000);
        const horaFormatada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`
        return horaFormatada;
    }
    getImagemCapa(){
        return this.imagemCapa;
    }
}
export default Eventos;