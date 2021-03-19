import React, { Component } from 'react'
import axios from 'axios'

export default class FormUser extends Component {
    state = {
        role: [],
        role_matriz:  ['GERENTE_ROLE','JEFE_BODEGA_ROLE'],
        role_sucursal :['ENCARGADO_BODEGA_ROLE'],
        place:'',           //implementar codigo de provincia
        name_user: '',
        email_user: '',
        pass_user: '',
        type_user: '',

        type_store:'',  //from Store
        places: [],     //from store

        edit: false,
        _id: '' ,  

        client: false,
        URLBACK: "https://backend-inventarios.herokuapp.com/"
    }

    //Allow show function, pedir datos
    async componentDidMount() {
       // console.log(this.props.match); 
        //console.log(this.props.match.params.id);
        //init states, select and input by DB
        const res = await axios.get(this.state.URLBACK+'store')
        if(res.data.stores<=0){
            window.alert("No hay sucursales ni matrices ingresadas")
            window.location.href = '/store'
        }else{
            let plac = res.data.stores.map(pla => [{name: pla.place_store, type: pla.type_store, _id: pla._id}])
            //delete duplicates once a place
            let unicos = Array.from(new Set(plac))
            let rol=res.data.stores[0].type_store
            //UPDATE--------
            if (this.props.match.params.id) {  
               // console.log(this.props.match.params.id) 
                if(this.props.match.params.id==="1"){
                    document.getElementById('place').style.display='None'
                    document.getElementById('type_u').style.display='None'
                    document.getElementById('type').style.display='None'
                    this.setState({
                        client:true
                    }) 
                }else{//////aqui condicion if para poder modificar solo los usuarios clientes
                    let headers = this.verifyAccessToken()
                    const res1 = await axios.get(this.state.URLBACK+'users/' + this.props.match.params.id, {headers})
                    //set select roles (type_user(value)|role(array with options))
                    this.updateRole(res1.data.user.place.type)
                    this.setState({
                        edit: true,
                        _id: this.props.match.params.id,
                        //
                        place: res1.data.user.place.name,
                        type_store: res1.data.user.place.type,
                        name_user: res1.data.user.name_user,
                        email_user: res1.data.user.email_user,
                        //pass_user: res1.data.user.pass_user,
                        type_user: res1.data.user.type_user,
                        //
                        places: unicos,
                        //role: this.state.role
                    })
                    //selected item on place  //set element
                    document.getElementById("name").value = res1.data.user.place.name
                    document.getElementById("type").value = res1.data.user.type_user
                }
                
            }else{//CREATE-----
                //init state selected
                if(this.state.client===true){

                }else{
                    this.updateRole(rol)
                    this.setState({
                        type_store: res.data.stores[0].type_store,
                        places: unicos,
                        place: unicos[0][0].name,
                        type_user:  this.state.role[0]
                    })
                }
            }
        }
    }

    //event chance typing
    onChangeUseOperation = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
        //change place[type] and upddate (type_user)role
        if (e.target.name==='place'){
            for (let i = 0; i < this.state.places.length; i++) {
                //console.log(unicos[i][0].name) ; 
                if(this.state.places[i][0].name === e.target.value){
                    this.setState({type_store: this.state.places[i][0].type})
                    //change select rol
                    let rol = this.state.places[i][0].type
                    this.updateRole(rol)
                }
            } 
        } 
    }

    updateRole=(value)=>{
        if(value=== "matriz"){
            this.setState({role: this.state.role_matriz,
            type_user: this.state.role_matriz[0]})
        }else{
            this.setState({role: this.state.role_sucursal,
                type_user: this.state.role_sucursal[0]})
        }
    }

    onSubmit = async e => {
        //do no reset when submmit form
        //do not reload on React app (No optimal)
        e.preventDefault()
        let newUser={}
        if(this.state.client===true){
            newUser = {
                name_user: this.state.name_user,
                email_user: this.state.email_user,
                pass_user: this.state.pass_user,
            }
            //UPDATE
           /* if (this.props.match.params.id) {
                const res = await axios.put('http://localhost:4000/users/' + this.state._id, newUser)
                console.log(res);
    */
           // } else { //CREATE
                const res = await axios.post(this.state.URLBACK+'client', newUser)
                //console.log(res);
           // }
           window.location.href = '/'
        }else{
            newUser = {
                place: {name: this.state.place, type: this.state.type_store},
                //type: this.state.type_store, ?? talves para insertar en user ??
                name_user: this.state.name_user,
                email_user: this.state.email_user,
                pass_user: this.state.pass_user,
                type_user: this.state.type_user 
            }
            //console.log(newUser)
    
            //UPDATE
            if (this.props.match.params.id) {
                let headers = this.verifyAccessToken()
                const res = await axios.put(this.state.URLBACK+'users/' + this.state._id, newUser, { headers })
               // console.log(res);
    
            } else { //CREATE
                let headers = this.verifyAccessToken()
                const res = await axios.post(this.state.URLBACK+'users', newUser, { headers })
                //console.log(res);
            }
            window.location.href = '/user'
        }  
    }

    verifyAccessToken = ()=>{
        var headers ={}
        if (localStorage.getItem('login')) {
            let a = JSON.parse(localStorage.getItem('login'))
            headers = {
                token: a.token 
            }
        }
        else{
            window.alert("El usuario no tiene permisos para acceder a esta operación")     
            window.location.href = '/' 
        }
        return headers
    }

    render() {
        return (
            <div className="row" >
            <div className="container">
            <h3>Registro</h3>
                <div className="card card-body">
                        <form onSubmit={this.onSubmit}>
                        <div className="form-group" id = "place">
                                Lugar:
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="place"
                                id= "name"> 
                                {
                                this.state.places.map((v, i, p) =>
                                    (<option key= {p[i][0].name}value= {p[i][0].name} >{p[i][0].name}</option>))
                                }
                                </select> 
                            </div> 
                            <div className="form-group" id="type_u">
                                Tipo
                                <input
                                
                                    name = "type_store"
                                    type="text"
                                    className="form-control"
                                    value={this.state.type_store}
                                    onChange={this.onChangeUseOperation}
                                    disabled />
                            </div>
                            <div className="form-group" id="name_u">
                                Nombre Usuario
                                <input
                                
                                    name = "name_user"
                                    type="text"
                                    className="form-control"
                                    value={this.state.name_user}
                                    onChange={this.onChangeUseOperation} 
                                    placeholder="Nombre Apellido"/>
                            </div>
                            <div className="form-group" id="email_u">
                                Correo Electrónico
                                <input
                                    name = "email_user"
                                    type="email"
                                    className="form-control"
                                    value={this.state.email_user}
                                    onChange={this.onChangeUseOperation} 
                                    placeholder="email@example.com"/>
                            </div>
                            <div className="form-group" id="pass_u">
                                Contraseña
                                <input
                                
                                    name = "pass_user"
                                    type="password"
                                    className="form-control"
                                    //value={this.state.pass_user}
                                    onChange={this.onChangeUseOperation} 
                                    placeholder="Password" />
                            </div>
                            <div className="form-group" id= "type">
                                Rol Usuario 
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="type_user"
                                >
                                {
                                this.state.role.map(rol =>
                                    (<option key={rol} value={rol}>{rol}</option>))
                                }
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>        
        )
    }
}