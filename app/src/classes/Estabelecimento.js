import Comentario from "./Comentario";
class Estabelecimento{
//Classe estabelecimento, contendo o construtor com os itens que serão chamados na classe EstabelecimentoComponent    
    constructor(nome, localizacao, descricao, fotos, videos, comentarios, avaliacao, categoria, imagemCapa, userInstagram, whatsapp, id){
        this.nome=nome;
        this.localizacao=localizacao;
        this.descricao=descricao;
        this.fotos=fotos;
        this.videos=videos;
        //modificando os comentários dentro do construtor para chama-los em forma de lista
        this.comentarios=[];
        this.userInstagram=userInstagram;
        this.whatsapp=whatsapp;
        this.id=id;
        
        for(const item in comentarios){
            this.comentarios.push(new Comentario(comentarios[item][0], comentarios[item][1], comentarios[item][2]));
            ////console.log(item);
        }
        //console.log(comentarios);
        //console.log("C=Estabelecimento avaliacao=");
        //console.log(avaliacao);
        this.avaliacao=avaliacao;
        this.categoria=categoria;
        this.imagemCapa=imagemCapa;
    }
    getNome(){
        return this.nome;
    }
    getLocalizacao(){
        return this.localizacao;
    }
    getDescricao(){
        return this.descricao;
    }
    getFotos(){
        return this.fotos;
    }
    getVideos(){
        return this.videos;
    }
    getComentarios(){
        return this.comentarios;
    }
    getAvaliacao(){
        //Fazendo o calculo para tirar a média das avaliações
        var soma=0;
        //console.log("C=Estabelecimento M=getAvaliacao avaliacoes="+this.avaliacao);
        try{
            for(const element in this.avaliacao){
                //console.log("C=Estabelecimento M=getAvaliacao avaliacao="+this.avaliacao[element].avaliacao);
                soma+= Number(this.avaliacao[element].avaliacao);
            };
            //console.log("C=Estabelecimento M=getAvaliacao soma="+soma);
            const media = soma/this.avaliacao.length;
            return (media.toFixed(1));
        }catch(e){
            //console.log("C=EstabelecimentoComponent.Estabelecimento"+e);
        }
    }
    getCategoria(){
        return this.categoria;
    } 
}
export default Estabelecimento;