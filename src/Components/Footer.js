import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Footer extends Component {
    render() {
        return (
            <footer className="container">
            <p className="float-right"></p>
            <p>&copy; {(new Date().getFullYear())} Sistema de Inventarios, Inc. &middot; <Link to="#">Política de Privacidad</Link> &middot; <Link to="#">Términos</Link></p>
            <p><b>Desarrollado por:</b>  Alexander Pogo - Bryan Sinchiguano - Santiago Soria</p>
        </footer>
        )
    }
}
