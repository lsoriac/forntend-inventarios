import React, { Component } from 'react'
import axios from 'axios'

export default class FormLogin extends Component {
    state = {
        email_user: '',
        pass_user: '',
        users: [],
        store_user: "",
        URLBACK: "https://restinventarios.herokuapp.com/"

    }

    async componentDidMount() {
        const res = await axios.get(this.state.URLBACK+'users')
        if(res.data.users<=0){
            window.alert("No hay usuarios registrados")
            window.location.href = '/'
        }else{
            this.setState({
                users: res.data.users
            })
        }  
    }
    //event chance typing
    onChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        let ban = false
        if (e.target.name === "email_user") {
            for (let i = 0; i < this.state.users.length; i++) {
                if (this.state.users[i].email_user === e.target.value) {
                    ban = true
                }
            }
            if (ban === true) {
                this.setState({
                    store_user: true
                })
            } else {
                this.setState({
                    store_user: false
                })
            }
        }
    }

    onSubmit = async e => {
        //do no reset when submmit form
        //do not reload on React app (No optimal)
        e.preventDefault()
        const login = {
            email_user: this.state.email_user,
            pass_user: this.state.pass_user,
        }
        let data = {}
        let res = {}
        if (this.state.store_user === true) {
            res = await axios.post(this.state.URLBACK+'login', login)
            data = {
                token: res.data.token,
                user: res.data.user
            }

        } else {
            res = await axios.post(this.state.URLBACK+'login/user', login)
            data = {
                token: res.data.token,
                user: res.data.client
            }
        }
        localStorage.setItem('login', JSON.stringify(data))
        window.location.href = '/'
    }

    render() {
        return (
            <div className="row" >
                <div className="container">
                    <h3>Login</h3>
                    <div className="card card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                Correo Electrónico
                                <input
                                    name="email_user"
                                    type="email"
                                    className="form-control"
                                    value={this.state.email_user}
                                    onChange={this.onChangeInput} 
                                    placeholder="email@example.com"/>
                            </div>
                            <div className="form-group">
                                Contraseña
                                <input
                                    name="pass_user"
                                    type="password"
                                    className="form-control"
                                    value={this.state.pass_user}
                                    onChange={this.onChangeInput}
                                    placeholder="Password" />
                            </div>
                            <button type="submit" className="btn btn-primary">Ingresar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}