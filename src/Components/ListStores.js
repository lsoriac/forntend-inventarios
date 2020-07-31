import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
export default class ListStores extends Component {
    state = {
        stores: [],
        URLBACK: "https://restinventarios.herokuapp.com/"
    }

    getStores = async () => {
        const res = await axios.get(this.state.URLBACK+'store')
        this.setState({ stores: res.data.stores })
        
    }

    //Allow show function, pedir datos
    async componentDidMount() {
        this.getStores();
    }

    onClickDelete = async (id) => {
        var opcion = window.confirm("Está seguro que desea eliminar este producto ?");
        if (opcion === true) {
            const res = await axios.delete(this.state.URLBACK+'store/' + id)
        this.getStores(); 
            //mensaje = "Se ha borrado exitosamente"
        } 
    }

    render() {
        return (
                        <div className="container">
                <h3>Gestión de Locales</h3>
                <div className="row" >
                    <div className="card card-body">
                    <Link className="btn btn-primary" to={"/manage-store"}>Registrar nuevo Local</Link>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Lugar</th>
                                <th>Tipo</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Celular</th>
                                <th colSpan="2">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            this.state.stores.map((val, i, op) =>
                                (<tr key={i}>
                                    <td>{op[i].id_store} </td>
                                    <td>{op[i].place_store} </td>
                                    <td>{op[i].type_store} </td>
                                    <td>{op[i].direction_store} </td>
                                    <td>{op[i].telf_store} </td>
                                    <td>{op[i].cel_store} </td>
                                    <td className="list-group-item list group-item-action" > 
                                    <button className="btn btn-danger" onClick={() => this.onClickDelete(op[i]._id)}>Eliminar</button>
                                    </td>
                                    <td>
                                    <Link className="btn btn-secondary" to={"/edit-store/" + op[i]._id}>Editar</Link> </td>
                                </tr>))
                         }
                         </tbody>
                     </table>
                 </div>
             </div>
         )
     }
 }