import React, { Component } from 'react'
import axios from 'axios'

export default class Carrito extends Component {
    state = {
        products_added: [],
        subtotal:0.0,
        iva: 0.0,
        total: 0.0,
        
        name_client: "",
        email_client: ""
    }

    componentDidMount() {
        //obtain name client
        let session= JSON.parse(localStorage.getItem('login'))
        if(session!==null){
            console.log("session",session.user.name_user);
        
            this.setState({
                name_client: session.user.name_user,
                email_client: session.user.email_user
            })
    
            if (localStorage.getItem('carrito') !== null) {
                let carrito = JSON.parse(localStorage.getItem('carrito'))
                let aux = carrito.products
                this.setState({
                    products_added: aux
                })
                let subtotal=0.0
                let iva=0.0
                let total=0.0
                for (let i = 0; i < aux.length; i++) {
                    subtotal = subtotal + aux[i].subtotal;
                    iva = iva + aux[i].iva;
                    total = total + aux[i].total;
                }
                this.setState({subtotal, iva, total})
            } else {
                console.log("No ha añadido productos al carrito");
            }
    
        }else{
            console.log("No se ha loggeado y no puede acceder a la compra de artículos");
            //window.location.href = '/'
        }
       
    }

    onClickFactura = async () => {

        if (localStorage.getItem('carrito') !== null) {
            let carrito = JSON.parse(localStorage.getItem('carrito'))
            let aux = carrito.products
            let client = {name_client: this.state.name_client,
            email_client: this.state.email_client}
           //FACTURACIÓN
            //Calculated on Backend (total)
            const res = await axios.post('https://backend-inventarios.herokuapp.com/facturas', { sale_product: aux, client })
            console.log(res);
            //this.getProducts();
            /////////////////////aqui puedo añadir datos del cliente :
            localStorage.removeItem('carrito');  
            
            window.location.href = '/'
        } 
        //else {
          //  alert("No ha añadido productos al carrito");
        //}
        
    }
    onClickDeleteProduct = (product_ob, index) => {
        let pos = 0
        for (let i = 0; i < this.state.products_added.length; i++) {
            //compare codes or ids
            if (this.state.products_added[i].id_product === product_ob[index].id_product) {
                pos = i
            }
        }
        this.state.products_added.splice(pos, 1)
        this.setState({ products_added: this.state.products_added })

        let data = {
            products: this.state.products_added
        }
        localStorage.setItem('carrito', JSON.stringify(data))
        window.location.href = '/carrito'
    }

    render() {
        return (
            <div className="row" >
                <div className="col-md-8">
                    <div className="card card-body">
                        <h3>Añadidos al carrito :</h3>
                        {
                            this.state.products_added.map((v, i, pp) =>
                                (<ul className="list-group" key={i}>
                                    <li className="list-group-item list group-item-action"
                                    >
                                        {pp[i].name_product}
                                        <div className="form-group">
                                            Lugar
                                <input
                                                type="text"
                                                className="form-control"
                                                value={pp[i].place}
                                                onChange={this.onChangeUseOperation}
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            Tipo
                                <input

                                                type="text"
                                                className="form-control"
                                                value={pp[i].type}
                                                onChange={this.onChangeUseOperation}
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            Categoría
                                <input
                                                type="text"
                                                className="form-control"
                                                value={pp[i].category}
                                                onChange={this.onChangeUseOperation}
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            Cantidad
                                <input
                                                type="number"
                                                min="1"
                                                className="form-control"
                                                value={pp[i].cant_product}
                                                onChange={this.onChangeUseOperation}
                                                placeholder="Número"
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            Descripción
                                <input
                                                name="description_product"
                                                type="text"
                                                className="form-control"
                                                value={pp[i].description_product}
                                                placeholder="Descripcion"
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            <img src={pp[i].image_product} alt="Imágen" />
                                        </div>
                                        <div className="form-group">
                                            Precio Unitario
                                <input
                                                name="sale_price"
                                                type="text"
                                                className="form-control"
                                                value={pp[i].sale_price.toFixed(2)}
                                                placeholder="Número decimal"
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            Subtotal
                                <input
                                                name="subtotal"
                                                type="text"
                                                className="form-control"
                                                value={pp[i].subtotal.toFixed(2)}
                                                placeholder="Número decimal"
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            IVA
                                <input
                                                name="iva"
                                                type="text"
                                                className="form-control"
                                                value={pp[i].iva.toFixed(2)}
                                                placeholder="Número decimal"
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            Total
                                <input
                                                name="total"
                                                type="text"
                                                className="form-control"
                                                value={pp[i].total.toFixed(2)}
                                                placeholder="Número decimal"
                                                required
                                                disabled />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => this.onClickDeleteProduct(pp, i)}
                                                value="Eliminar" />
                                        </div>
                                    </li>
                                </ul>))
                        }
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card card-body">
                        <h3>Finalizar compra :</h3>
                        <div className="form-group">
                            Subtotal
                                <input
                                name="subtotal"
                                type="number"
                                className="form-control"
                                value={this.state.subtotal.toFixed(2)}
                                placeholder="Número decimal"
                                required
                                disabled />
                        </div>
                        <div className="form-group">
                            IVA
                                <input
                                name="iva"
                                type="number"
                                className="form-control"
                                value={this.state.iva.toFixed(2)}
                                placeholder="Número decimal"
                                required
                                disabled />
                        </div>
                        <div className="form-group">
                            Total
                                <input
                                name="total"
                                type="number"
                                className="form-control"
                                value={this.state.total.toFixed(2)}
                                placeholder="Número decimal"
                                required
                                disabled />
                        </div>
                        <button className="btn btn-primary" onClick={this.onClickFactura}>Finalizar Compra</button>
                    </div>
                </div>
            </div>
        )
    }
}
