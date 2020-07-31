import React, { Component } from 'react'
import axios from 'axios'

export default class ListProductsFact extends Component {
    state = {
        products: [],
        factura: {},
        ides:[],
        places:[],
        URLBACK: "https://restinventarios.herokuapp.com/"
    }
    async componentDidMount() {
        document.getElementById('send').style.display = 'None'
        //FACTURAS
        const res = await axios.get(this.state.URLBACK+'facturas/' + this.props.match.params.id)
        //console.log(res.data);
        //STORE
        const res2 = await axios.get(this.state.URLBACK+'store')
        let plac = res2.data.stores.map(pla => [{ name: pla.place_store, type: pla.type_store, _id: pla._id }])
        //delete duplicates once a place
        let unicos = Array.from(new Set(plac))
        //.name, .type
        ///console.log(unicos[0][0]);
        this.setState({
            places:unicos
        })
        this.setState({
            products: res.data.factura.sale_product,
            factura: res.data.factura
        })
        for (let i = 0; i < res.data.factura.sale_product.length; i++) {
            //console.log(res.data.factura.sale_product[i])
            this.state.ides.push({id_product: res.data.factura.sale_product[i].id_product,
            place: res.data.factura.sale_product[i].place, 
            cant: res.data.factura.sale_product[i].cant_product})
        }
    }

    onClickInput = async () => {
        //cuando sea un array debo crear un foprmulario y hacer cada boton ingresar un radio button
        const newOutput = {
            num_factura: this.state.factura.id_factura,
            factura: this.state.factura,
            total_factura: this.state.factura.total
        }
        //insert output
        /*const res = */await axios.post(this.state.URLBACK+'output',newOutput )
        //console.log(res)
        //update state factura
        /*const res2 = */await axios.put(this.state.URLBACK+'facturas/'+ this.state.factura.id_factura)
        //console.log(res2)
        //update stock
        let cant_product = []
        for (let i = 0; i < this.state.places.length; i++) {
            for (let j = 0; j < this.state.ides.length; j++) {
                if(this.state.places[i][0].name===this.state.ides[j].place){
                    //send negative to decrease stock/////////////////////////////////////
                    cant_product.push({place: this.state.places[i][0].name, cant: parseInt(-this.state.ides[j].cant)})
                }else{
                    cant_product.push({place: this.state.places[i][0].name, cant: 0})
                }  
            }    
        }  
        //console.log("fffff",this.state.ides[0].id_product);
        let cant_product_aux=[]
        for (let i = 0; i < cant_product.length; i++) {
            if (cant_product[i].cant===0) {    
            }else{
                cant_product_aux.push(cant_product[i])
            }
        }
        for (let i = 0; i < cant_product_aux.length; i++) {
            /*const res3 = */await axios.put(this.state.URLBACK+'products/stock/'+ this.state.ides[i].id_product, cant_product_aux[i])
        }
        window.location.href = '/list-factura'
    }

    onChangeP = (id) => {
        var chkBox = document.getElementById(id);
        if (chkBox.checked) {
            //console.log("golaadwadaw");
            var cont = 0
            for (let i = 0; i < this.state.products.length; i++) {
                var chkBox1 = document.getElementById(this.state.products[i].id_product);
                if (chkBox1.checked) {
                    cont++
                }
            }
            if (cont === this.state.products.length) {
                document.getElementById('send').style.display = 'Block'
            }
        }else{
            var cont2 = 0
            for (let i = 0; i < this.state.products.length; i++) {
                var chkBox2 = document.getElementById(this.state.products[i].id_product);
                if (chkBox2.checked) {
                    cont2++
                }
            }
            if (cont2 !== this.state.products.length) {
                document.getElementById('send').style.display = 'None'
            }  
        }
    }

    render() {
        return (
            <div className="Container">
                <h3>Detalle Compra Productos</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Cantidad </th>
                            <th>Descripción</th>
                            <th>Subtotal</th>
                            <th>Opción</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map(op =>
                                (<tr key={op.id_product}>
                                    <td>{op.id_product} </td>
                                    <td>{op.name_product} </td>
                                    <td>{op.cant_product} </td>
                                    <td>{op.description_product} </td>
                                    <td>{op.subtotal.toFixed(2)} </td>
                                    <td>
                                        {/*<button className="btn btn-primary" onClick={() => this.onClickInput(op._id)}>Ingresar</button>*/}

                                        <input id={op.id_product} className="form-check-input" type="checkbox" value={op.id_product} onChange={() => this.onChangeP(op.id_product)}></input>
                                    </td>
                                </tr>))
                        }
                    </tbody>
                </table>

                <button id="send" className="btn btn-primary" onClick={() => this.onClickInput()}>Confirmar Despacho de Productos</button>
            </div>
        )
    }
}