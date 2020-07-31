import React, { Component } from 'react'
import axios from 'axios'
import Highcharts from 'highcharts'
import drilldown from 'highcharts/modules/drilldown'
import HighchartsReact from 'highcharts-react-official'
drilldown(Highcharts)

export default class Graphic extends Component {
    state = {
        options: {},
        options2: {},
        place: "",
        places: [],
        type_store: "",
        inputs: [],
        outputs: [],
        i_p:[],
        o_p:[],
        URLBACK: "https://restinventarios.herokuapp.com/"
    }
    async componentDidMount() {
        const res3 = await axios.get(this.state.URLBACK+'store')
        let plac = res3.data.stores.map(pla => [{ name: pla.place_store, type: pla.type_store, _id: pla._id }])
        //delete duplicates once a place
        let unicos = Array.from(new Set(plac))
        
      //  console.log(unicos);

        const res = await axios.get(this.state.URLBACK+'output')
        //console.log(res.data.outputs[0].factura);

        const res2 = await axios.get(this.state.URLBACK+'input')
        //console.log(res2.data.inputs[0].purchase_order);
       

        if (res.data.outputs <= 0 || res2.data.inputs <= 0) {
            window.alert("No hay entradas/salidas para generar la gráfica ")
            window.location.href = '/'
        } else {
            this.setState({
                places: unicos,
                place: unicos[0][0].name,
                type_store: res3.data.stores[0].type_store,
                i_p:res2.data.inputs,
                o_p:res.data.outputs
            })
            this.updateGraphic(res2.data.inputs, res.data.outputs, unicos[0][0].name)

        }


    }
    onChangeUseOperation = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        if (e.target.name === 'place') {
            //define type_store (matriz ||sucursal) on select
            for (let i = 0; i < this.state.places.length; i++) {
                if (this.state.places[i][0].name === e.target.value) {
                    this.setState({ type_store: this.state.places[i][0].type })
                }
               // console.log(e.target.value);
                this.updateGraphic(this.state.i_p, this.state.o_p, e.target.value)
            }
        }
    }
    updateGraphic = (arr_i, arr_o, place) => {
        //console.log([101, 1, 2, 1001].sort((a, b) => a - b));
        //console.log((new Date(res2.data.inputs[0].createdAt)).getDate()+"/"+((new Date(res2.data.inputs[0].createdAt)).getMonth() + 1)+"/"+(new Date(res2.data.inputs[0].createdAt)).getFullYear())

        let inputs = []
        for (let i = 0; i < arr_i.length; i++) {
               // console.log(place, "===", arr_i[i].purchase_order.destination_place);
                if (place === arr_i[i].purchase_order.destination_place) {
                    inputs.push(
                        [((new Date(arr_i[i].createdAt)).getDate() + "/" + ((new Date(arr_i[i].createdAt)).getMonth() + 1) + "/" + (new Date(arr_i[i].createdAt)).getFullYear()) + "-Reg." + (i + 1),
                        parseFloat(arr_i[i].total_purchase_order)],
                    )
                }
            
        }

        let outputs = []
        for (let i = 0; i < arr_o.length; i++) {
           // console.log(place, " ===", arr_o[i].factura.sale_product[0].place);
                if (place === arr_o[i].factura.sale_product[0].place) {
                    outputs.push(
                        [((new Date(arr_o[i].createdAt)).getDate() + "/" + ((new Date(arr_o[i].createdAt)).getMonth() + 1) + "/" + (new Date(arr_o[i].createdAt)).getFullYear()) + "-Reg." + (i + 1),
                        parseFloat(arr_o[i].total_factura)]
                    )
                }
            
            
        }

        //graphic
        const options = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Compras Mensuales'
            },
            subtitle: {
                text: 'Resumen'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Compras (miles)'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
            },
            series: [{
                name: 'Ventas $',
                data: [
                ],
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.2f}$', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        }
        options.series[0].data = inputs


        //graphic
        const options2 = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ventas Mensuales'
            },
            subtitle: {
                text: 'Resumen'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: 0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Ventas (miles)'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
            },
            series: [{
                name: 'Ventas $',
                data: [
                ],
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.2f}$', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        }
        options2.series[0].data = outputs
        console.log(outputs);
        this.setState({
            options,
            options2,
            inputs,
            outputs
        })

    }
    render() {
        return (
            <div>
                <div className="form-group" id="place">
                    Lugar:
                                <select className="form-control" onChange={this.onChangeUseOperation}
                        name="place"
                        id="name">
                        {
                            this.state.places.map((v, i, p) =>
                                (<option key={i} value={p[i][0].name} >{p[i][0].name}</option>))
                        }
                    </select>
                            Tipo
                                <input
                        name="type_store"
                        type="text"
                        className="form-control"
                        value={this.state.type_store}
                        onChange={this.onChangeUseOperation}
                        disabled />
                </div>
                <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.options}
                    />
                </div>
                <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.options2}
                    />
                </div>
            </div>

        )
    }
}
