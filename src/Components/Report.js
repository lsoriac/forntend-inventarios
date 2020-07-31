import React, { Component } from 'react'
import axios from 'axios'
import {CSVLink} from 'react-csv'

export default class Report extends Component {
    state = {
        outputs: [],
        facturas: [],
        sale_products: [],

        clients: [],

        inputs_outputs:[],
        URLBACK: "https://restinventarios.herokuapp.com/"
    }
    async componentDidMount() {
        const res = await axios.get(this.state.URLBACK+'output')
        //console.log(res.data.outputs[0].factura);
        
        const res2 = await axios.get(this.state.URLBACK+'input')
        //console.log(res2.data.inputs[0].purchase_order);
        //console.log([101, 1, 2, 1001].sort((a, b) => a - b));
        if(res.data.outputs<=0 || res2.data.inputs<=0 ){
            window.alert("No hay entradas/salidas para generar el reporte ")
            window.location.href = '/'
        }else{
            let inputs_outputs=[]
            for (let i = 0; i < res2.data.inputs.length; i++) {
                inputs_outputs.push({
                    id: parseInt(res2.data.inputs[i].id_input), 
                    documento: "Orden de Compra",
                    num_documento: parseInt(res2.data.inputs[i].num_purchase_order),
                    //doc: arseInt(res2.data.inputs[i].purchase_order), 
                    fecha:((new Date(res2.data.inputs[i].createdAt)).getDate()+"/"+((new Date(res2.data.inputs[i].createdAt)).getMonth() + 1)+"/"+(new Date(res2.data.inputs[i].createdAt)).getFullYear()).toString(),
                    entrada: parseFloat(res2.data.inputs[i].total_purchase_order).toFixed(2)+"$",
                    //total_output: parseFloat(0).toFixed(2)+"$"
                    salida: ""
                    
                })
                
    
            }
            for (let i = 0; i < res.data.outputs.length; i++) {
                inputs_outputs.push({
                    id: parseInt(res.data.outputs[i].id_output), 
                    num_documento: parseInt(res.data.outputs[i].num_factura),
                    documento: "Factura",
                    //doc: parseInt(res.data.outputs[i].factura), 
                    fecha: ((new Date(res.data.outputs[i].createdAt)).getDate()+"/"+((new Date(res.data.outputs[i].createdAt)).getMonth() + 1)+"/"+(new Date(res.data.outputs[i].createdAt)).getFullYear()).toString(),
                   // total_input: parseFloat(0).toFixed(2)+"$",
                   entrada:"",
                    salida: parseFloat(res.data.outputs[i].total_factura).toFixed(2)+"$"
                })
            }
            
    
            //console.log("adwwa",inputs_outputs.sort((a, b) => a - b));
    
            inputs_outputs.sort(function (a, b){
                return (a.id - b.id)
            })
           // console.log(inputs_outputs);
    
            
            this.setState({
                inputs_outputs
            })
        }

       
    }

    render() {
        return (
            <div className="container">
                <h3>Reportes</h3>
                <div className="row" >
                    <div className="card card-body">
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id Registro</th>
                                <th>Tipo Documento</th>
                                <th>Número Documento</th>
                                <th>Fecha de Operación</th>
                                <th>Salidas</th>
                                <th>Entradas</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.inputs_outputs.map((v, i, arr) =>
                                    (<tr key={i}>
                                        <td>{i+1} </td>
                                        <td>{arr[i].documento} </td>
                                        <td>{arr[i].num_documento} </td>
                                        <td>{arr[i].fecha} </td>
                                        <td>{arr[i].entrada} </td>
                                        <td>{arr[i].salida} </td>
                                        
                                    </tr>))
                            }
                        </tbody>
                    </table>
                </div>
                <CSVLink data = {this.state.inputs_outputs} filename="Reporte_Ingresos_Salidas.csv" className="btn btn-success"> Exportar a CSV</CSVLink>

            </div>
        )
    }
}