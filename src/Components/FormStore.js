import React, { Component } from 'react'
import axios from 'axios'

export default class FormStore extends Component {
    state = {
        ////////
        type_store:'',
        place_store: '',
        direction_store: '',
        telf_store: '',
        cel_store: '',

        edit: false,
        _id: '',

        provincias: [
            "Azuay",
        "Bolívar",
        "Cañar",
        "Carchi",
        "Chimborazo",
        "Cotopaxi",
        "El Oro",
        "Esmeraldas",
        "Galápagos",
        "Guayas",
        "Imbabura",
        "Loja",
        "Los Ríos",
        "Manabí",
        "Morona Santiago",
        "Napo",
        "Orellana",
        "Pastaza",
        "Pichincha",
        "Santa Elena",
        "Santo Domingo de los Tsáchilas",
        "Sucumbíos",
        "Tungurahua",
        "Zamora Chinchipe",
        ],
        URLBACK: "https://backend-inventarios.herokuapp.com/"

    }

    //Allow show function, pedir datos
    async componentDidMount() {
        document.getElementById('type_matriz').checked = true;
        
        this.setState({
            type_store: "matriz"
        })
        if (this.props.match.params.id) {

            

            const res = await axios.get(this.state.URLBACK+'store/' + this.props.match.params.id)
            this.setState({
                edit: true,
                _id: this.props.match.params.id,

                type_store: res.data.store.type_store,
                place_store: res.data.store.place_store,
                direction_store: res.data.store.direction_store,
                telf_store: res.data.store.telf_store,
                cel_store: res.data.store.cel_store
            })
            if (res.data.store.type_store==="matriz") {
                document.getElementById('type_matriz').checked = true;
            }else{
                document.getElementById('type_sucursal').checked = true;
            }
            document.getElementById("name").value = res.data.store.place_store
        }else{
            this.setState({
                place_store: this.state.provincias[0]
            })
        }
    }

    //event chance typing
    onChangeUseOperation = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async e => {
        //do no reset when submmit form
        //do not reload on React app (No optimal)
        e.preventDefault()
        const newStore = {
            type_store: this.state.type_store,
            place_store: this.state.place_store,
            direction_store: this.state.direction_store,
            telf_store: this.state.telf_store,
            cel_store: this.state.cel_store
        }

        //UPDATE
        if (this.props.match.params.id) {
            const res = await axios.put(this.state.URLBACK+'store/' + this.state._id, newStore)
        } else { //CREATE
            const res = await axios.post(this.state.URLBACK+'store', newStore)
            this.setState({place_store: this.state.provincias[0]
            })
        }
        window.location.href = '/store'
        
    }

    render() {
        return (
            <div className="row" >
                <div className="container">
                    <h3>Locales</h3>
                    <div className="card card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="type_store" id="type_matriz" value="matriz" 
                                onChange={this.onChangeUseOperation} />
                                <label className="form-check-label" >
                                    Matriz
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="type_store" id="type_sucursal" value="sucursal" 
                                onChange={this.onChangeUseOperation}/>
                                <label className="form-check-label" >
                                    Sucursal
                                </label>
                            </div>
                            {/*
                             <div className="form-group">
                                Lugar de la provincia:
                                <input
                                    name="place_store"
                                    type="text"
                                    className="form-control"
                                    value={this.state.place_store}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            */}
                           

                            <div className="form-group" id = "place_store">
                                Provincia:
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="place_store"
                                id= "name"> 
                                {
                                this.state.provincias.map((v, i, p) =>
                                    (<option key= {i}value= {p[i]} >{p[i]}</option>))
                                }
                                </select> 
                            </div>
                             
                            <div className="form-group">
                                Dirección:
                                <input
                                    name="direction_store"
                                    type="text"
                                    className="form-control"
                                    value={this.state.direction_store}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            <div className="form-group">
                                Teléfono:
                                <input
                                    name="telf_store"
                                    type="number"
                                    min={1000000}
                                    max={9999999}
                                    className="form-control"
                                    value={this.state.telf_store}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            <div className="form-group">
                                Celular:
                                <input
                                    name="cel_store"
                                    type="number"
                                    min={100000000}
                                    max={999999999}
                                    className="form-control"
                                    value={this.state.cel_store}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}