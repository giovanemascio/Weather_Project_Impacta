import React, { Component } from 'react';

class Membro extends Component {

    constructor(props){
        super(props);
        this.state = {
            //nome do state:
            nome: props.nome
        };
        // Usar bind para poder acessar a função entrar:
        this.entrar = this.entrar.bind(this);
    }

    entrar(nome){
       //Alterar state visitante para Matheus:
       this.setState({nome: nome})
    }
    render() {
        return (
            <div>
                <h2>Bem vindo(a) {this.state.nome}</h2>
                <button onClick={ () => this.entrar("Lucas")}>Entrar no sistema</button>
                <button onClick={ () => this.setState({nome: ""}) }>Sair</button>
            </div>
        );
    }
}

//Exportar Membro para ser usado fora:
export default Membro;