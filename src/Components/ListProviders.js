import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
export default class ListProviders extends Component {
    state = {
        providers: [],
        URLBACK: "https://backend-inventarios.herokuapp.com/"
    }

    getProviders = async () => {
        const res = await axios.get(this.state.URLBACK+'provider')
        this.setState({ providers: res.data.providers })
        
    }

    //Allow show function, pedir datos
    async componentDidMount() {
        this.getProviders();
    }

    onClickDelete = async (id) => {
        var opcion = window.confirm("Está seguro que desea eliminar este producto ?");
        if (opcion === true) {
            const res = await axios.delete(this.state.URLBACK+'provider/' + id)
            this.getProviders(); 
            //mensaje = "Se ha borrado exitosamente"
        }     
    }

    render() {
        return (
            <div className="container">
                <h3>Gestión de Proveedores</h3>
                <div className="row" >
                    <div className="card card-body">
                    <Link className="btn btn-primary" to={"/manage-provider"}>Registrar nuevo Proveedor</Link>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Proveedor</th>
                                <th>RUC</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Celular</th>
                                <th colSpan="2">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                        
                        
                            this.state.providers.map(op =>
                                (<tr key={op._id}>
                                    <td>{op.id_provider} </td>
                                    <td>{op.name_provider} </td>
                                    <td>{op.ruc_provider} </td>
                                    <td>{op.direction_provider} </td>
                                    <td>{op.telf_provider} </td>
                                    <td>{op.cel_provider} </td>
                                    <td> 
                                    <button className="btn btn-danger" onClick={() => this.onClickDelete(op._id)}>Eliminar</button>
                                    </td>
                                    <td>
                                    
                                    <Link className="btn btn-secondary" to={"/edit-provider/" + op._id}>Editar</Link> </td>
                                </tr>))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}