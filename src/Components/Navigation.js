//rcc React Class Component
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navigation extends Component {
    state = {
        role_1: 'GERENTE_ROLE',
        role_2: 'JEFE_BODEGA_ROLE',
        role_3: 'ENCARGADO_BODEGA_ROLE',
        role_4: 'USER_ROLE',
        cant_carrito: 0,
    }
    async componentDidMount() {
        //exist token
        let session = ''
        if (localStorage.getItem('login')) {
            session = JSON.parse(localStorage.getItem('login'))
            //console.log("zzz", session.user);
            //console.log("holaaaaa");
            if (session.user.type_user === this.state.role_4) {
                //obtener cantidad de objetos agregados al carrito
                if (localStorage.getItem('carrito') !== null) {
                    let carrito = JSON.parse(localStorage.getItem('carrito'))
                    // if(carrito){
                    let aux = carrito.products
                    this.setState({
                        cant_carrito: aux.length
                    })
                    //}
                } else {
                    this.setState({
                        cant_carrito: 0
                    })
                }
            }
        } else {
            //console.log("Este usuario no está loggeado");
        }

        //init navigation None options
        if (session.user === undefined) {
            document.getElementById('input').style.display = 'None'
            document.getElementById('product').style.display = 'None'
            document.getElementById('user').style.display = 'None'
            document.getElementById('store').style.display = 'None'
            document.getElementById('provider').style.display = 'None'
            document.getElementById('login').style.display = 'Block'//Block
            document.getElementById('close').style.display = 'None'
            document.getElementById('output').style.display = 'None'
            document.getElementById('sale').style.display = 'None'
            document.getElementById('purchase_order').style.display = 'None'
            document.getElementById('carrito').style.display = 'None'
            document.getElementById('graphic').style.display = 'None'
            document.getElementById('report').style.display = 'None'
        } else {
            //console.log(session.user.type_user);
            if (session.user.type_user === this.state.role_1) {

                document.getElementById('input').style.display = 'None'
                document.getElementById('product').style.display = 'Block'
                document.getElementById('user').style.display = 'Block'
                document.getElementById('store').style.display = 'Block'//bloxk
                document.getElementById('provider').style.display = 'Block'//block
                document.getElementById('login').style.display = 'None'
                document.getElementById('close').style.display = 'Block'//block
                document.getElementById('output').style.display = 'None'
                document.getElementById('sale').style.display = 'None'
                document.getElementById('purchase_order').style.display = 'Block'//block
                document.getElementById('carrito').style.display = 'None'
                document.getElementById('register').style.display = 'None'
                document.getElementById('graphic').style.display = 'Block'
                document.getElementById('report').style.display = 'Block'
            }
            if (session.user.type_user === this.state.role_2) {
                document.getElementById('input').style.display = 'Block'
                document.getElementById('product').style.display = 'Block'
                document.getElementById('user').style.display = 'Block'
                document.getElementById('store').style.display = 'None'
                document.getElementById('provider').style.display = 'None'
                document.getElementById('login').style.display = 'None'
                document.getElementById('close').style.display = 'Block'
                document.getElementById('output').style.display = 'Block'
                document.getElementById('sale').style.display = 'None'
                document.getElementById('purchase_order').style.display = 'None'
                document.getElementById('carrito').style.display = 'None'
                document.getElementById('register').style.display = 'None'
                document.getElementById('graphic').style.display = 'None'
                document.getElementById('report').style.display = 'None'
            }
            if (session.user.type_user === this.state.role_3) {
                document.getElementById('input').style.display = 'Block'
                document.getElementById('product').style.display = 'None'
                document.getElementById('user').style.display = 'None'
                document.getElementById('store').style.display = 'None'//bloxk
                document.getElementById('provider').style.display = 'None'//block
                document.getElementById('login').style.display = 'None'
                document.getElementById('close').style.display = 'Block'//block
                document.getElementById('output').style.display = 'Block'
                document.getElementById('sale').style.display = 'None'
                document.getElementById('purchase_order').style.display = 'None'//block
                document.getElementById('carrito').style.display = 'None'
                document.getElementById('register').style.display = 'None'
                document.getElementById('graphic').style.display = 'None'
                document.getElementById('report').style.display = 'None'
            }
            if (session.user.type_user === this.state.role_4) {
                document.getElementById('input').style.display = 'None'
                document.getElementById('product').style.display = 'None'
                document.getElementById('user').style.display = 'None'
                document.getElementById('store').style.display = 'None'
                document.getElementById('provider').style.display = 'None'
                document.getElementById('login').style.display = 'None'
                document.getElementById('close').style.display = 'Block'
                document.getElementById('output').style.display = 'None'
                document.getElementById('sale').style.display = 'Block'
                document.getElementById('purchase_order').style.display = 'None'
                document.getElementById('carrito').style.display = 'Block'
                document.getElementById('register').style.display = 'None'
                document.getElementById('graphic').style.display = 'None'
            document.getElementById('report').style.display = 'None'
            }
        }

    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/">Gestión de Inventarios
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active" id="input">
                            <Link className="navbar-brand" to="/list-purchase-order">Entradas
                        </Link>
                        </li>
                        <li className="nav-item" id="output">
                            <Link className="navbar-brand" to="/list-factura">Salidas
                        </Link>
                        </li>
                        <li className="nav-item active" id="product">
                            <Link className="navbar-brand" to="/product">Gestionar Productos
                        </Link>
                        </li>
                        <li className="nav-item" id="user">
                            <Link className="navbar-brand" to="/user">Gestionar Usuarios
                        </Link>
                        </li>
                        <li className="nav-item" id="store">
                            <Link className="navbar-brand" to="/store">Gestionar Locales
                        </Link>
                        </li>
                        <li className="nav-item" id="provider">
                            <Link className="navbar-brand" to="/provider">Gestionar Proveedores
                        </Link>
                        </li>
                        <li className="nav-item" id="sale">
                            <Link className="navbar-brand" to="/sale">Comprar
                        </Link>
                        </li>
                        <li className="nav-item" id="purchase_order">
                            <Link className="navbar-brand" to="/purchase-order">Orden compra
                        </Link>
                        </li>
                        <li className="nav-item" id="login">
                            <Link className="navbar-brand" to="/login">Iniciar Sesión
                        </Link>
                        </li>
                        <li className="nav-item" id="graphic">
                            <Link className="navbar-brand" to="/graphic">Gráfica
                        </Link>
                        </li>
                        <li className="nav-item" id="report">
                            <Link className="navbar-brand" to="/report">Reportes
                        </Link>
                        </li>
                        <li className="nav-item" id="register">
                            <Link className="navbar-brand" to="/edit-user/1">Registrarse
                        </Link>
                        </li>
                        <li className="nav-item" id="close">
                            <Link className="navbar-brand" to="/close">Cerrar Sesión
                        </Link>
                        </li>
                        <li id = "carrito">
                            <Link className="navbar-brand" to="/carrito">
                                <img src="./car.png" alt="" width="30" height="30" /> <span className="badge badge-light">{this.state.cant_carrito}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}
