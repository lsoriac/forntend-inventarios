import React, { Component } from 'react'

export default class CloseSession extends Component {
    async componentDidMount() {
       //localStorage.setItem('login', JSON.stringify(data))
    if (localStorage.getItem('login')) {
        localStorage.removeItem('login');   
    }else{
        //window.alert("El usuario no ha iniciado sesión");
        
    }
    
    //console.log(a);
    //localStorage.removeItem('token');
    
    //return index
    window.location.href = '/'
    }
   
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
