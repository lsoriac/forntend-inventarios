import React, { Component } from 'react'
import axios from 'axios'

export default class ListProductsPO extends Component {
    state={
        products:[],
        purchase_order: {},
        places: [],
        ides:[],
        URLBACK: "https://restinventarios.herokuapp.com/"
    }
    async componentDidMount() {
        document.getElementById('send').style.display = 'None'
        const res = await axios.get(this.state.URLBACK+'purchase-order/'+this.props.match.params.id)
        //console.log(res.data);
        this.setState({
            products: res.data.purchase_order.purchased_product,
            purchase_order: res.data.purchase_order
        })
        //STORE
        const res2 = await axios.get(this.state.URLBACK+'store')
        let plac = res2.data.stores.map(pla => [{ name: pla.place_store, type: pla.type_store, _id: pla._id }])
        //delete duplicates once a place
        let unicos = Array.from(new Set(plac))
        //.name, .type
       // console.log(unicos[0][0]);
        this.setState({
            places:unicos
        })
        //console.log("veeeeeeeeeer-",res.data.purchase_order);
        for (let i = 0; i < res.data.purchase_order.purchased_product.length; i++) {
            //console.log(res.data.factura.sale_product[i])
            this.state.ides.push({id_product: res.data.purchase_order.purchased_product[i].id_product,
            place: res.data.purchase_order.purchased_product[i].place, 
            cant: res.data.purchase_order.purchased_product[i].cant_product})
        }
       // console.log("ideeees", this.state.ides);
    }

    onClickInput = async () => {
        const newInput = {
            num_purchase_order: this.state.purchase_order.id_purchase_order,
            purchase_order: this.state.purchase_order,
            total_purchase_order: this.state.purchase_order.total
        }
        //console.log(newInput)
        
        const res = await axios.post(this.state.URLBACK+'input',newInput )
        //console.log(res)
     
        const res2 = await axios.put(this.state.URLBACK+'purchase-order/'+ this.state.purchase_order.id_purchase_order)
        //console.log(res2)

        let cant_product = []
        for (let i = 0; i < this.state.places.length; i++) {
            for (let j = 0; j < this.state.ides.length; j++) {
                //console.log(this.state.places[i][0].name,"===========",this.state.ides[j].place);
                if(this.state.places[i][0].name===this.state.ides[j].place){
                    
                    //send positive to increase stock/////////////////////////////////////
                    cant_product.push({place: this.state.places[i][0].name, cant: parseInt(this.state.ides[j].cant)})
                }else{
                    cant_product.push({place: this.state.places[i][0].name, cant: 0})
                }  
            }    
        }  
       // console.log("canttttt", cant_product);
        //console.log("fffff",this.state.ides[0].id_product);
        let cant_product_aux=[]
        for (let i = 0; i < cant_product.length; i++) {
            if (cant_product[i].cant===0) {    
            }else{
                cant_product_aux.push(cant_product[i])
            }
        }
        
        //console.log("auuuuuux",cant_product_aux);
        for (let i = 0; i < cant_product_aux.length; i++) {
            /*const res3 = */
            await axios.put(this.state.URLBACK+'products/stock/'+ this.state.ides[i].id_product, cant_product_aux[i])
        }

        window.location.href = '/list-purchase-order'
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
                                <th>Precio de Compra</th>
                                <th>Subtotal</th>
                                <th>Seleccionar</th>                 
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
                                        <td>{op.purchase_price.toFixed(2)} </td>
                                        <td>{op.total.toFixed(2)} </td>
                                        <td>
                                        <input id={op.id_product} className="form-check-input" type="checkbox" value={op.id_product} onChange={() => this.onChangeP(op.id_product)}></input>
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    <button id="send" className="btn btn-primary" onClick={() => this.onClickInput()}>Confirmar Ingreso de Productos</button>
                    </div>
        ) 
    }
}