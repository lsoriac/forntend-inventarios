import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es';
registerLocale('es', es)

export default class ListFacturas extends Component {
    state = {
        facturas: [],
        date: new Date(),///actual date
        URLBACK: "https://restinventarios.herokuapp.com/"
    }

    async componentDidMount() {
        //PURCHASE ORDERS
        const res = await axios.get(this.state.URLBACK+'facturas')
       // console.log(res.data.facturas);
        //define state order
        let facturas = res.data.facturas.map((val, i, arr) => {
            if (arr[i].state === false) {
                arr[i].state = "Pendiente"
            } else {
                arr[i].state = "Entregado"
            }
            return val
        })
        this.setState({
            facturas
        })
        for (let i = 0; i < facturas.length; i++) {
            if (facturas[i].state === "Pendiente") {
                let ide =("factura"+facturas[i].id_factura).toString()
               document.getElementById(ide).style.display='Block'
            } else {
                let ide =("factura"+facturas[i].id_factura).toString()
                document.getElementById(ide).style.display='None'
            }   
        }
        //document.getElementById('1').style.display='None'
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
                <h3>Facturas</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Fecha de Envío</th>
                                <th>Fecha Actual</th>
                                <th>Opción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.facturas.map(op =>
                                    (<tr key={op._id}>
                                        <td>{op.id_factura}</td>
                                        <td>{op.state}</td>
                                        <td>{op.total.toFixed(2)}</td>
                                        <td>{(new Date(op.send_date)).getDate()+"/"+((new Date(op.send_date)).getMonth() + 1)+"/"+(new Date(op.send_date)).getFullYear()}</td>
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
                                        <td id = {("factura"+op.id_factura).toString()}>
                                            <Link className="btn btn-secondary" to={"/list-factura-products/" + op._id}>Despachar</Link> </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
            </div>
        )
    }
}