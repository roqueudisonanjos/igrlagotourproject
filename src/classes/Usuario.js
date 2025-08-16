class Usuario{
    constructor(nome, sobrenome, idade, nascimento, email, telefone){
    //Criação do construtor com informações que será passada pelo usuário com nome, sobrenome, idade, nascimento, email e telefone.
        this.nome=nome;
        this.sobrenome=sobrenome;
        this.idade=idade;
        this.nascimento=nascimento;
        this.email=email;
        this.telefone=telefone;
    }
    getNome(){
        return this.nome;
    }
    getSobrenome(){
        return this.sobrenome;
    }
    getIdade(){
        return this.idade;
    }
    getNascimento(){
        return this.nascimento;
    }
    getEmail(){
        return this.email;
    }
    getTelefone(){
        return this.telefone;
    }
}
export default Usuario;