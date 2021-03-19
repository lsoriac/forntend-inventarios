import React, { Component } from 'react'
import axios from 'axios'
export default class FormProvider extends Component {
    state = {
        ////////
        name_provider:'',
        ruc_provider: '',
        direction_provider: '',
        telf_provider: '',
        cel_provider: '',

        edit: false,
        _id: '',
        URLBACK: "https://backend-inventarios.herokuapp.com/"
    }

    //Allow show function, pedir datos
    async componentDidMount() {
        if (this.props.match.params.id) {
            const res = await axios.get(this.state.URLBACK+'provider/' + this.props.match.params.id)
            this.setState({
                edit: true,
                _id: this.props.match.params.id,

                name_provider: res.data.provider.name_provider,
                ruc_provider: res.data.provider.ruc_provider,
                direction_provider: res.data.provider.direction_provider,
                telf_provider: res.data.provider.telf_provider,
                cel_provider: res.data.provider.cel_provider
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
        const newProvider = {
            name_provider: this.state.name_provider,
            ruc_provider: this.state.ruc_provider,
            direction_provider: this.state.direction_provider,
            telf_provider: this.state.telf_provider,
            cel_provider: this.state.cel_provider
        }

        //UPDATE
        if (this.props.match.params.id) {
            await axios.put(this.state.URLBACK+'provider/' + this.state._id, newProvider)

        } else { //CREATE
            await axios.post(this.state.URLBACK+'provider', newProvider)
        }
        window.location.href = '/provider'
        
    }

    render() {
        return (
            <div className="row" >
                <div className="container">
                    <h3>Locales</h3>
                    <div className="card card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                Proveedor:
                                <input
                                    name="name_provider"
                                    type="text"
                                    className="form-control"
                                    value={this.state.name_provider}
                                    onChange={this.onChangeUseOperation} 
                                    required
                                    placeholder="Nombre del proveedor"/>
                            </div>
                            <div className="form-group">
                                RUC:
                                <input
                                    name="ruc_provider"
                                    type="text"
                                    className="form-control"
                                    value={this.state.ruc_provider}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            <div className="form-group">
                                Dirección:
                                <input
                                    name="direction_provider"
                                    type="text"
                                    className="form-control"
                                    value={this.state.direction_provider}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            <div className="form-group">
                                Teléfono:
                                <input
                                    name="telf_provider"
                                    type="number"
                                    min={1000000}
                                    max={9999999}
                                    className="form-control"
                                    value={this.state.telf_provider}
                                    onChange={this.onChangeUseOperation} />
                            </div>
                            <div className="form-group">
                                Celular:
                                <input
                                    name="cel_provider"
                                    type="number"
                                    min={100000000}
                                    max={999999999}
                                    className="form-control"
                                    value={this.state.cel_provider}
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