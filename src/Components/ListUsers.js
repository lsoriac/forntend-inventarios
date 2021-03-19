import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class ListUsers extends Component {
    state = {
        users: [],
        cont: 1,
        URLBACK: "https://backend-inventarios.herokuapp.com/"
    }

    getUsers = async () => {
        //localStorage.setItem('login', JSON.stringify(data))
        if (localStorage.getItem('login')) {
            let a = JSON.parse(localStorage.getItem('login'))
            var headers = {
                token: a.token
            }
            // console.log("zzz", a);
            const res = await axios.get(this.state.URLBACK+'users', { headers })
           // console.log(res.data);
            this.setState({
                users: res.data.users,
                cont: this.state.cont++
            })
            
            
        } else {
            window.alert("El usuario no tiene permisos para acceder a esta operación")
            window.location.href = '/'
            //document.getElementById("send").style.display ="None"

        }
        //console.log(a);
        //localStorage.removeItem('token');
        //localStorage.clear();
    }

    //Allow show function, pedir datos
    async componentDidMount() {
        this.getUsers();
    }

    onClickDelete = async (id) => {
        var opcion = window.confirm("Está seguro que desea eliminar este usuario ?");
        if (opcion === true) {
            let headers = this.verifyAccessToken()
            if(headers!==null){
                const res = await axios.delete(this.state.URLBACK+'users/' + id, { headers })
                //console.log(res);
                this.getUsers();
            }
            //mensaje = "Se ha borrado exitosamente"
        }
    }

    verifyAccessToken = () => {
        var headers = {}
        if (localStorage.getItem('login')) {
            let a = JSON.parse(localStorage.getItem('login'))
            headers = {
                token: a.token
            }
        }
        else {
            window.alert("El usuario no tiene permisos para acceder a esta operación")
        }
        return headers
    }

    render() {
        return (
            <div className="Container">
                <h3>Gestión de Usuarios</h3>
                <div className="row" >
                    <div id="send" className="card card-body">
                        <Link className="btn btn-primary" to={"/manage-user"}>Registrar nuevo Usuario</Link>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Lugar</th>
                                <th>Tipo</th>
                                <th>Nombre Usuario</th>
                                <th>Correo Usuario</th>
                                <th>Tipo Usuario </th>
                                <th colSpan="2">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map(op =>
                                    (<tr key={op._id}>
                                        <td>{op.id_user} </td>
                                        <td>{op.place.name} </td>
                                        <td>{op.place.type} </td>
                                        <td>{op.name_user} </td>
                                        <td>{op.email_user} </td>
                                        <td>{op.type_user} </td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => this.onClickDelete(op._id)}>Eliminar</button>
                                        </td>
                                        <td>
                                            <Link className="btn btn-secondary" to={"/edit-user/" + op._id}>Editar</Link> </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}