import React, { Component } from 'react'
import axios from 'axios'

export default class FormPurchaseOrder extends Component {
    state = {
        category: '',
        name_product: '',
        description_product: '',
        //común

        //product
        id_product: '',
        cant_product: '',
        purchase_price: '',

        gain: '',
        sale_price: '',

        subtotal: '',
        //order
        destination_place: '',///arrayyy
        type_store: '',
        company_provider: '',
        purchased_product: [],
        total: '',

        //list on select
        categories: ["HOMBRE", "MUJER"],

        places: [],
        providers: [],
        productsByCategory: [],
        products: [],
        URLBACK: "https://restinventarios.herokuapp.com/"
    }

    async componentDidMount() {
        //////hacer ifsssssss para cuando esta registrado y cuando no esta registrado, meybe opcioooon 
        //////////////////ojoooooo que solo se pueda comprar desde la matrizzzzzzz
        /*
        let res = ''
        if (localStorage.getItem('login')) {
            let a = JSON.parse(localStorage.getItem('login'))
            var headers = {
                token: a.token
            }
            res = await axios.get(this.state.URLBACK+'users', { headers })
        } else {
            console.log("Este usuario no tiene acceso a la operación");
        }*/
        //USERS
        const res = await axios.get(this.state.URLBACK+'users')
        //PROVIDERS
        const res2 = await axios.get(this.state.URLBACK+'provider')
        //PRODUCTS
        const res3 = await axios.get(this.state.URLBACK+'products')
        if(res.data.users<=0 || res2.data.providers<=0 || res3.data.products<=0){
            window.alert("No hay productos de ninguna clase")
            window.location.href = '/'
        }else{
            this.setState({ products: res3.data.products })

            let plac = res.data.users.map((v, i, arr) => [{ name: arr[i].place.name, type: arr[i].place.type }])
           // console.log(plac);
            //delete duplicates once a place
            //let unicos = Array.from(new Set(plac))
            //uniques on array
            let set = new Set(plac.map(JSON.stringify))
            let unicos = Array.from(set).map(JSON.parse);
            //PROVIDERS     uniques
            let plac2 = res2.data.providers.map((v, i, arr) => [{ name: arr[i].name_provider, id: arr[i]._id }])
            //delete duplicates once a place
            let unicos2 = Array.from(new Set(plac2))
            //////
            let products_provider = this.listProductsByProvider(unicos2[0][0].name)
            let products_category = this.listProductsByCategory(products_provider, "HOMBRE")
            //INICIALIZACIÓN----------------
            this.setState({
                places: unicos,
                destination_place: unicos[0][0].name,
                providers: unicos2,
                company_provider: unicos2[0][0].name,
                category: "HOMBRE",
                id_product: products_category[0].id_product,
                //cant_product: '',
                //name_product
                gain: products_category[0].gain,
                sale_price: products_category[0].sale_price,
                purchase_price: products_category[0].purchase_price,
                //subtotal: '',
                productsByCategory: products_category,
                type_store: res.data.users[0].place.type,
            })
          
        }
        
    }

     onChangeInput = async(e) => {
        this.setState({ [e.target.name]: e.target.value })
        if (e.target.name === 'destination_place') {
            for (let i = 0; i < this.state.places.length; i++) {
                if (this.state.places[i][0].name === e.target.value) {
                    this.setState({ type_store: this.state.places[i][0].type })
                }
            }
        }
        if (e.target.name === "company_provider") {
            let products_provider = this.listProductsByProvider(e.target.value)
            //console.log(products_provider); 
            /*let products_category = */this.listProductsByCategory(products_provider, this.state.category)
            //console.log(products_category);
        }
        if (e.target.name === "category") {
            let products_provider = this.listProductsByProvider(this.state.company_provider)
            //console.log("company_provider", this.state.company_provider);
            /*let products_category = */this.listProductsByCategory(products_provider, e.target.value)
            //console.log(products_category);
        }
        if (e.target.name === "name_product") {
            
            const res = await axios.get(this.state.URLBACK+'products/find/'+e.target.value )
            //console.log(res.data.product);
            this.setState({
                category: res.data.product.category,
                company_provider: res.data.product.company_provider,
                description_product: res.data.product.description_product,
                gain: res.data.product.gain,
                name_product: res.data.product.name_product,
                purchase_price: res.data.product.purchase_price,
                sale_price: res.data.product.sale_price,
                id_product: res.data.product.id_product
                
            })
           
        }
    }

    listProductsByProvider = (value) => {
        let arr = []
        for (let i = 0; i < this.state.products.length; i++) {
            if (this.state.products[i].company_provider === value) {
                arr.push({
                    id_product: (this.state.products[i].id_product),
                    category: (this.state.products[i].category),
                    name_product: (this.state.products[i].name_product),
                    description_product: (this.state.products[i].description_product),
                    purchase_price: (this.state.products[i].purchase_price),

                    gain: (this.state.products[i].gain),
                    sale_price: (this.state.products[i].sale_price),

                    company_provider: (this.state.products[i].company_provider)
                })
            }
        }
        this.setState({ productsByCategory: arr })
        return arr
    }

    listProductsByCategory = (arr, value) => {
        let arr_send = []
        let gain = []
        let cat_1 = []
        let cat_2 = []
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].category === "HOMBRE") {
                cat_1.push({
                    id_product: (arr[i].id_product),
                    name_product: (arr[i].name_product),
                    description_product: (arr[i].description_product),
                    purchase_price: (arr[i].purchase_price),
                    gain: (arr[i].gain),
                    sale_price: (arr[i].sale_price),
                    company_provider: (arr[i].company_provider)
                })
                gain = (arr[i].gain)
            }
            if (arr[i].category === "MUJER") {
                cat_2.push({
                    id_product: (arr[i].id_product),
                    name_product: (arr[i].name_product),
                    description_product: (arr[i].description_product),
                    purchase_price: (arr[i].purchase_price),
                    gain: (arr[i].gain),
                    sale_price: (arr[i].sale_price),
                    company_provider: (arr[i].company_provider)
                })
                gain = (arr[i].gain)
            }
            //console.log("antes del iffff", this.state.category);
            if (value === "HOMBRE") {
                arr_send = cat_1
            }
            if (value === "MUJER") {
                arr_send = cat_2
            }
            if (arr_send.length <= 0) {
                //console.log("debeeee entrarrr");
                this.setState({
                    productsByCategory: [{
                        id_product: 0,
                        name_product: "No hay productos registrados",
                        description_product: '',
                        purchase_price: '',
                        gain: '',
                        sale_price: ''
                    }],
                    id_product: 0,
                    name_product: "", ////////////////////////ojoooooooo ver esto 
                    description_product: '',
                    purchase_price: '',
                    gain: '',
                    sale_price: ''
                })
                document.getElementById('name_product_1').style.display = 'None'
                gain = 30
                //defaultttttt----------------
            } else {
                this.setState({
                    productsByCategory: arr_send,
                    id_product: arr_send[0].id_product,
                    name_product: arr_send[0].name_product, /////////ojoooooooo ver esto 
                    description_product: arr_send[0].description_product,
                    purchase_price: arr_send[0].purchase_price,
                    gain: arr_send[0].gain,
                    sale_price: arr_send[0].sale_price
                })
                document.getElementById('name_product_1').style.display = 'Block'
                gain = arr_send[0].gain
            }
        }
        this.setState({
            gain})
        return arr_send
    }

    onSubmit = async e => {
        e.preventDefault()
        let subtotal = (this.state.cant_product * this.state.purchase_price)
        //for buy
        let name_product = ''
        let gain = 0
            name_product = this.state.name_product
            gain = this.state.gain
        
/*
        let id = 0
        if (this.state.id_product === 0) {
            const res = await axios.get(this.state.URLBACK+'products')
            id = res.data.products.length + 1
        } else {
            id = this.state.id_product
        }*/
        let newBuy = {
            //category:this.state.category,
            id_product: this.state.id_product,
            place: this.state.destination_place,
            name_product,
            description_product: this.state.description_product,
            cant_product: this.state.cant_product,
            purchase_price: this.state.purchase_price, ///este precio ya debería contener IVAAA ??
            total: subtotal
        }

        //for register
        const newProduct = {
            category: this.state.category,
            place: this.state.destination_place,
            type_place: this.state.type_store,
            company_provider: this.state.company_provider,
            name_product,
            description_product: this.state.description_product,
            //image_product: this.state.image_product,
            purchase_price: this.state.purchase_price,
            gain
        }

        //CREATE PURCHASE ORDER
        const newPurchaseOrder = {
            company_provider: this.state.company_provider,
            destination_place: this.state.destination_place,
            purchased_product: [newBuy],
            //total: subtotal
        }

        /*const res2 = */await axios.post(this.state.URLBACK+'purchase-order', newPurchaseOrder)
        if (this.state.id_product === 0) {
            //inserto nuevo producto con imagen pendiente a registrar
            /*const res3 = */await axios.post(this.state.URLBACK+'products', newProduct)
        }
        window.location.href = '/'//////////////ver a donde redireccionar
    }

    render() {
        return (
            <div className="row" >
                <div className="container">
                    <div className="card card-body">
                        <h3>Compra de inventario Simulación</h3>
                        <form onSubmit={this.onSubmit} >
                            <div className="form-group" id="place">
                                Lugar de destino:
                                <select className="form-control" onChange={this.onChangeInput}
                                    name="destination_place"
                                    id="name">
                                    {
                                        this.state.places.map((v, i, p) =>
                                            (<option key={p[i][0].name} value={p[i][0].name} >{p[i][0].name}</option>))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                Tipo
                                <input
                                    name="type_store"
                                    type="text"
                                    className="form-control"
                                    value={this.state.type_store}
                                    onChange={this.onChangeInput}
                                    disabled />
                            </div>
                            <div className="form-group">
                                Nombre del Proveedor
                                <select className="form-control"
                                    onChange={this.onChangeInput}
                                    name="company_provider"
                                >
                                    {
                                        this.state.providers.map((v, i, prov) =>
                                            (<option key={prov[i][0].id} value={prov[i][0].name}>{prov[i][0].name}</option>))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                Categoría:
                                    <select className="form-control" onChange={this.onChangeInput}
                                    name="category"
                                    id="category">
                                    {
                                        this.state.categories.map((p) =>
                                            (<option key={p} value={p} >{p}</option>))
                                    }
                                </select>
                            </div>
                            <div className="form-group"
                                id="name_product_1">
                                Nombre del Producto
                                <select className="form-control"
                                    onChange={this.onChangeInput}
                                    name="name_product">
                                    {
                                        this.state.productsByCategory.map(prod =>
                                            (<option key={prod.id_product} value={prod.name_product}>{prod.name_product}</option>))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                Cantidad
                                <input
                                    type="number"
                                    min="1"
                                    name="cant_product"
                                    className="form-control"
                                    value={this.state.cant_product}
                                    onChange={this.onChangeInput}
                                    placeholder="Número"
                                    required />
                            </div>
                            <div className="form-group">
                                Descripción
                                <input
                                    name="description_product"
                                    type="text"
                                    className="form-control"
                                    placeholder="Descripcion"
                                    value={this.state.description_product}
                                    required 
                                    disabled/>
                            </div>
                            <div className="form-group">
                                Precio de compra $
                                <input
                                    name="purchase_price"
                                    type="number"
                                    className="form-control"
                                    value={parseFloat(this.state.purchase_price).toFixed(2)}
                                    placeholder="Número decimal"
                                    required
                                    disabled />
                            </div>
                            <div className="form-group">
                                Margen de Ganancia %
                                <input disabled className="form-control" 
                                    name="gain"
                                    id="gain"
                                    value={this.state.gain}
                                    />
                                    
                            </div>
                            <div className="form-group">
                                Precio de venta $
                                <input
                                    name="sale_price"
                                    type="number"
                                    className="form-control"
                                    value={parseFloat(this.state.sale_price).toFixed(2)}
                                    placeholder="Número decimal"
                                    required
                                    disabled />
                            </div>
                            
                            <button type="submit" className="btn btn-primary">Comprar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}