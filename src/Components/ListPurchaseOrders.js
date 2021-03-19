import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
registerLocale('es', es)


export default class ListPurchaseOrders extends Component {
    state = {
        purchase_orders: [],
        URLBACK: "https://backend-inventarios.herokuapp.com/",
        date: new Date()///actual date
    }

    async componentDidMount() {
        //PURCHASE ORDERS
        const res = await axios.get(this.state.URLBACK+'purchase-order')
        //define state order
        let purchase_orders = res.data.purchase_orders.map((val, i, arr) => {
            if (arr[i].state === false) {
                arr[i].state = "Pendiente"
            } else {
                arr[i].state = "Recibido"
            }
            return val
        })
        this.setState({
            purchase_orders
        })
        for (let i = 0; i < purchase_orders.length; i++) {
            if (purchase_orders[i].state === "Pendiente") {
                let ide =("purchase_order"+purchase_orders[i].id_purchase_order).toString()
               document.getElementById(ide).style.display='Block'
            } else {
                let ide =("purchase_order"+purchase_orders[i].id_purchase_order).toString()
                document.getElementById(ide).style.display='None'
                
            }
            
        }
    } 

    onChangeUseOperation = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //set actual date
    onChangeDate = (date) => {
        this.setState({
            date
        })
    }

    render() {
        return (
            <div className="Container">
                <h3>Órdenes de Compra</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Proveedor</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Fecha de LLegada</th>
                                <th>Fecha</th>
                                <th>Ingreso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.purchase_orders.map(op =>
                                    (<tr key={op._id}>
                                        <td>{op.id_purchase_order}</td>
                                        <td>{op.company_provider}</td>
                                        <td>{op.state}</td>
                                        <td>{op.total.toFixed(2)}</td>
                                        <td>{(new Date(op.receive_date)).getDate()+"/"+((new Date(op.receive_date)).getMonth() + 1)+"/"+(new Date(op.receive_date)).getFullYear()}</td>
                                        <td>
                                            <DatePicker
                                                className="form-control"
                                                selected={this.state.date}
                                                locale="es"
                                                onChange={this.onChangeDate}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="dd/mm/yyyy"
                                                disabled
                                            />
                                        </td>
                                        <td id = {("purchase_order"+op.id_purchase_order).toString()}>
                                            <Link className="btn btn-secondary" to={"/list-purchase-order-products/" + op._id}>Ingresar</Link> </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
            </div>
        )
    }
}