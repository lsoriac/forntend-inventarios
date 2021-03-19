import React, { Component } from 'react'
import axios from 'axios'

export default class FormProduct extends Component {
    state = {
        place: '',
        company_provider: '',
        category: '',
        name_product: '',
        description_product: '',
        image_product: '', //sale_price: '' calculate internal
        purchase_price: '',
        gain: '',

        categories: ["HOMBRE", "MUJER"],
        places: [],
        type_place: '',

        providers: [],

        edit: false,
        _id: ''

    }
    //Allow show function, pedir datos
    async componentDidMount() {
        //STORE places
        document.getElementById('all').style.display = 'none'
        let headers = this.verifyAccessToken()
        const res = await axios.get('https://backend-inventarios.herokuapp.com/store', {headers})
        const res2 = await axios.get('https://backend-inventarios.herokuapp.com/provider')
        //console.log(res2.data.providerslength);
        if (res.data.stores.length !== 0 & res2.data.providers.length !== 0) {
            document.getElementById('all').style.display = 'block'
           // console.log(res2);
            let plac = res.data.stores.map(pla => [{ name: pla.place_store, type: pla.type_store, _id: pla._id }])
            //delete duplicates once a place
            let unicos = Array.from(new Set(plac))
            //providers

            let plac2 = res2.data.providers.map((v, i, arr) => [{ name: arr[i].name_provider, id: arr[i]._id }])
            //delete duplicates once a provider
            let unicos2 = Array.from(new Set(plac2))

            if (this.props.match.params.id) {
                const res1 = await axios.get('https://backend-inventarios.herokuapp.com/products/' + this.props.match.params.id)
                this.setState({
                    edit: true,
                    _id: this.props.match.params.id,

                    places: unicos,
                    providers: unicos2,

                    place: res1.data.product.place,
                    type_place: res1.data.product.type_place,

                    company_provider: res1.data.product.company_provider,//////////////////
                    category: res1.data.product.category,
                    name_product: res1.data.product.name_product,
                    description_product: res1.data.product.description_product,
                    // image_product: res1.data.product.image_product,
                    purchase_price: res1.data.product.purchase_price,
                    //sleect gain
                    gain: res1.data.product.gain,
                })
                //selected item on place  //set element
                document.getElementById("name_place").value = res1.data.product.place
                document.getElementById("company_provider").value = res1.data.product.company_provider
                document.getElementById("category").value = res1.data.product.category
                document.getElementById("gain").value = res1.data.product.gain
            } else {
                this.setState({
                    gain: 40,
                    category: this.state.categories[0],
                    places: unicos,
                    providers: unicos2,
                    place: res.data.stores[0].place_store,
                    company_provider: res2.data.providers[0].name_provider,
                    type_place: res.data.stores[0].type_store,
                })
            }
        }
        //if (res.data.stores !== null & res2.data.providers !==null) {
        if (res.data.stores.length === 0) {
            window.alert("Verifique que existan locales ingresados")
            window.location.href = '/'
        }

        if (res2.data.providers.length === 0) {
            window.alert("Verifique que existan Proveedores ingresados")
            window.location.href = '/'
        }
    }

    //event chance typing
    onChangeUseOperation = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        if (e.target.name === 'place') {
            for (let i = 0; i < this.state.places.length; i++) {
                if (this.state.places[i][0].name === e.target.value) {
                    this.setState({ type_place: this.state.places[i][0].type })
                }
            }
        }
    }

    onSubmit = async e => {
        //do no reset when submmit form
        //do not reload on React app (No optimal)
        e.preventDefault()
        //UPDATE
        if (this.props.match.params.id) {
            const newProduct = new FormData();
            for (let name in this.state) {
                newProduct.append(name, this.state[name]);
            }
            const res = await axios.put('https://backend-inventarios.herokuapp.com/products/' + this.state._id, newProduct)
           // console.log(res);
        } else {//CREATE
            const newProduct = new FormData();
            for (let name in this.state) {
                newProduct.append(name, this.state[name]);
            }
            await axios.post('https://backend-inventarios.herokuapp.com/products', newProduct)
        }
        window.location.href = '/product'
    }

    handleFileChange = e => {
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }

    verifyAccessToken = () => {
        var headers = {}
        if (localStorage.getItem('login')) {
            let a = JSON.parse(localStorage.getItem('login'))
            headers = {
                token: a.token
            }
        }
        else {
            window.alert("El usuario no tiene permisos para acceder a esta operación")
        }
        return headers
    }

    render() {
        return (
            <div className="row" id="all">
                <div className="card card-body">
                    <h3>Registrar Nuevo Producto</h3>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group" id="place">
                            Lugar:
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="place"
                                id="name_place">
                                {
                                    this.state.places.map((v, i, p) =>
                                        (<option key={i} value={p[i][0].name} >{p[i][0].name}</option>))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            Tipo
                                <input
                                name="type_place"
                                id="type_place"
                                type="text"
                                className="form-control"
                                value={this.state.type_place}
                                onChange={this.onChangeUseOperation}
                                disabled />
                        </div>

                        <div className="form-group" >
                            Nombre Proveedor:
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="company_provider"
                                id="company_provider">
                                {
                                    this.state.providers.map((v, i, prov) =>
                                        (<option key={i} value={prov[i][0].name}>{prov[i][0].name}</option>))
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            Categoría:
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="category"
                                id="category">
                                {
                                    this.state.categories.map((p) =>
                                        (<option key={p} value={p} >{p}</option>))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            Nombre Producto
                                <input
                                name="name_product"
                                type="text"
                                className="form-control"
                                value={this.state.name_product}
                                onChange={this.onChangeUseOperation}
                                placeholder="Nombre"
                                required />
                        </div>
                        <div className="form-group">
                            Descripción
                                <input
                                name="description_product"
                                type="text"
                                className="form-control"
                                value={this.state.description_product}
                                onChange={this.onChangeUseOperation}
                                placeholder="Descripcion"
                                required />
                        </div>
                        <div className="form-group">
                            Imágen
                                    <input required name="image_product" type="file" className="form-control-file" onChange={this.handleFileChange} />
                        </div>
                        <div className="form-group">
                            Precio de Compra Unitario
                                <input
                                name="purchase_price"
                                type="number"
                                min={1}
                                step="0.01"
                                className="form-control"
                                value={this.state.purchase_price}
                                onChange={this.onChangeUseOperation}
                                placeholder="0.00"
                                required />
                        </div>
                        <div className="form-group">
                            Margen de Ganancia
                                <select className="form-control" onChange={this.onChangeUseOperation}
                                name="gain"
                                id="gain">
                                <option value={30}>30</option>
                                <option value={35}>35</option>
                                <option value={40}>40</option>
                                <option value={45}>45</option>
                                <option value={50}>50</option>
                                <option value={55}>55</option>
                                <option value={60}>60</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Registrar
                    </button>
                    </form>
                </div>
            </div>
        )
    }
}