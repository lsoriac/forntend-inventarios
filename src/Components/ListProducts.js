import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class FormProducts extends Component {
    state = {
        products: []
    }

    getProducts = async () => {
        const res = await axios.get('https://backend-inventarios.herokuapp.com/products')
        this.setState({ products: res.data.products })
    }

    //Allow show function, pedir datos
    async componentDidMount() {
        this.getProducts();
    }

    onClickDelete = async (id) => {
        //var mensaje = '';
        var opcion = window.confirm("Está seguro que desea eliminar este producto ?");
        if (opcion === true) {
            const res = await axios.delete('https://backend-inventarios.herokuapp.com/products/' + id)
            //console.log(res);
            this.getProducts();
            //mensaje = "Se ha borrado exitosamente"
        } 
        /*else {
            mensaje = "Se ha cancelado la elimación ";
        }*/
        //alert(mensaje)
    }

    render() {
        return (
            <div className="container">
                <h3>Gestión de Productos</h3>
                <div className="row" >
                    <div className="card card-body">
                        <Link className="btn btn-primary" to={"/manage-product"}>Registrar nuevo producto</Link>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Categoría</th>
                                <th>Nombre</th>
                                <th>Imágen</th>
                                <th>Descripción</th>
                                <th>Precio Compra</th>
                                <th>Margen ganancia</th>
                                <th>Precio Venta</th>
                                <th colSpan="2">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.products.map(op =>
                                    (<tr key={op._id}>
                                        <td >{op.id_product}</td>
                                        <td>{op.category}</td>
                                        <td>{op.name_product}</td>
                                        {/*Load image */}
                                        {/*<td><img src={op.image_product} alt="Imágen" height="140" width="100" /></td>*/}
                                        <td><img src={"data:image/png;base64,"+op.image_product} alt="Imágen" height="140" width="100"/></td>
                                        <td>{op.description_product}</td>
                                        <td>{op.purchase_price.toFixed(2) + "$"}</td>
                                        <td>{op.gain + "%"}</td>
                                        <td>{op.sale_price.toFixed(2) + "$"}</td>
                                        
                                        <td className="list-group-item list group-item-action" > <button className="btn btn-danger" onClick={() => this.onClickDelete(op._id)}>Eliminar</button>
                                        </td> 
                                    </tr>))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}