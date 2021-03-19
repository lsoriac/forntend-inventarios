import React, { Component } from 'react'
import axios from 'axios'

export default class Sale extends Component {
    state = {
        sold: [],
        products: [],
        carrito: [],

        id_product: '',
        place: '',
        type_store: '',
        category: '',
        name_product: '',

        description_product: '',
        image_product: '',
        sale_price: 0.0,

        subtotal: 0.0,
        iva: 0.0,
        total: 0.0,

        places: [],

        products_category: [],
        productsByCategory: [],
        categories: ["HOMBRE", "MUJER"],
        URLBACK: "https://backend-inventarios.herokuapp.com/"

    }

    async componentDidMount() {
        const res2 = await axios.get(this.state.URLBACK+'products')
        this.setState({ products: res2.data.products })
        //first[0] => product
        //second[0]=> cant of products for a store
        //console.log(res2.data.products[0].cant_product[0]);
        //STORE
        const res = await axios.get(this.state.URLBACK+'store')
        let plac = res.data.stores.map(pla => [{ name: pla.place_store, type: pla.type_store, _id: pla._id }])
        //delete duplicates once a place
        let unicos = Array.from(new Set(plac))

        let place = this.listProductsByPlace(res2.data.products, unicos[0][0].name, unicos)
        let products_category = this.listProductsByCategory(place, "HOMBRE")
        // console.log(products_category);
        //INICIALIZACIÓN----------------
        this.setState({
            places: unicos,
            place: unicos[0][0].name,
            category: "HOMBRE",
            //id_product: products_category[0].id_product,
            //sale_price: products_category[0].sale_price,
            productsByCategory: products_category,
            type_store: res.data.stores[0].type_store,
        })
    }

    onClicProduct = async (product_ob, index) => {
        //obtain cant
        let cant_product = document.getElementById(product_ob[index].name_product).value;
        const { id_product, category, name_product, description_product, image_product, sale_price } = product_ob[index]
        //Calculated 
        let subtotal = parseInt(cant_product) * parseFloat(sale_price)
        let iva = parseFloat(subtotal) * 0.12 //iva = iva2*cant_product  ////ver decimalessssss
        let total = parseFloat(subtotal) + parseFloat(iva)
        this.setState({ subtotal, iva, total })
        //Insert data
        const newSold = {
            id_product,
            place: this.state.place,
            type: this.state.type_store,
            category,
            name_product,
            cant_product,
            description_product,
            image_product,
            sale_price,
            subtotal,
            iva,
            total
        }

        if (localStorage.getItem('carrito') !== null) {
            let carrito = JSON.parse(localStorage.getItem('carrito'))
            let aux = carrito.products
            //updtae cantidad de objetos agregados al carrito
            let ban = false
            //load "carrito" from Local Storage
            if (aux.length > 0) {
                for (let i = 0; i < aux.length; i++) {
                    if (aux[i].id_product === product_ob[index].id_product) {
                        //increase cant ++
                        aux[i].cant_product = parseInt(aux[i].cant_product) + parseInt(cant_product)
                        aux[i].subtotal = parseFloat(aux[i].subtotal) + parseFloat(subtotal)
                        aux[i].iva = parseFloat(aux[i].iva) + parseFloat(iva)
                        aux[i].total = parseFloat(aux[i].total) + parseFloat(total)
                        ban = true
                    }
                }
            }
            if (ban === false) {
                aux.push(newSold)
            }
            let data = {
                products: aux
            }
            localStorage.setItem('carrito', JSON.stringify(data))
        } else {
            let data = {
                products: [newSold]
            }
            localStorage.setItem('carrito', JSON.stringify(data))
            //console.log("Este usuario no tiene acceso a la operación"); 
        }
        //settear cant
        document.getElementById(product_ob[index].name_product).value = 1
        this.setState({
            cant_product: 1
        })
        window.location.href = '/sale'
    }

    //event chance typing (reload a input cant_product change)
    onChangeUseOperation = (e) => {
        this.setState({ [e.target.name]: e.target.value })
        if (e.target.name === 'place') {
            //define type_store (matriz ||sucursal) on select
            for (let i = 0; i < this.state.places.length; i++) {
                if (this.state.places[i][0].name === e.target.value) {
                    this.setState({ type_store: this.state.places[i][0].type })
                }
            }
            let place = this.listProductsByPlace(this.state.products, e.target.value, this.state.places)
            /*let products_category = */this.listProductsByCategory(place, this.state.category)
        }
        if (e.target.name === "category") {
            let place = this.listProductsByPlace(this.state.products, this.state.place, this.state.places)
            /*let products_category = */this.listProductsByCategory(place, e.target.value)
        }
        //this.updateStock(this.state.products)
        //console.log("verr", this.state.productsByCategory[0].place);
    }

    listProductsByPlace = (arr_p, value, places) => {
        let arr = []
        let sto = 0
        for (let i = 0; i < arr_p.length; i++) {

            //if (arr_p[i].place === value) {
                for (let j = 0; j < places.length; j++) {
                    //console.log(arr_p[i].cant_product[j].place, "==========", value, "????", places.length );
                    if (arr_p[i].cant_product[j].place === value/*document.getElementById("name").value*/) {
                        sto = arr_p[i].cant_product[j].cant
                        //console.log("si entra",sto);
                        
                    }
                }
                //None stock products
                if (sto <= 0) {

                } else {
                    arr.push({
                        id_product: (arr_p[i].id_product),
                        place: (arr_p[i].place),
                        type: (arr_p[i].type_place),
                        category: (arr_p[i].category),
                        name_product: (arr_p[i].name_product),
                        description_product: (arr_p[i].description_product),
                        image_product: (arr_p[i].image_product),
                        sale_price: (arr_p[i].sale_price),
                        cant: (arr_p[i].cant_product),
                        stock: sto
                    })
                }
            //}
        }
        this.setState({ productsByCategory: arr })
        return arr
    }

    listProductsByCategory = (arr, value) => {
        let arr_send = []
        //let gain = []
        let cat_1 = []
        let cat_2 = []
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].category === "HOMBRE") {
                cat_1.push({
                    id_product: (arr[i].id_product),
                    category: (arr[i].category),
                    name_product: (arr[i].name_product),
                    place: (arr[i].place),
                    type: (arr[i].type),
                    description_product: (arr[i].description_product),
                    image_product: (arr[i].image_product),
                    sale_price: (arr[i].sale_price),
                    cant: (arr[i].cant),
                    stock: (arr[i].stock)
                })
            }
            if (arr[i].category === "MUJER") {
                cat_2.push({
                    id_product: (arr[i].id_product),
                    category: (arr[i].category),
                    name_product: (arr[i].name_product),
                    place: (arr[i].place),
                    type: (arr[i].type),
                    description_product: (arr[i].description_product),
                    image_product: (arr[i].image_product),
                    sale_price: (arr[i].sale_price),
                    cant: (arr[i].cant),
                    stock: (arr[i].stock)
                })
            }
            if (value === "HOMBRE") {
                arr_send = cat_1
            }
            if (value === "MUJER") {
                arr_send = cat_2
            }
            if (arr_send.length <= 0) {
                //console.log("debeeee entrarrr");
                this.setState({
                    productsByCategory: [/*{
                        id_product: 0,
                        name_product: "No hay productos registrados",
                        description_product: '',
                        sale_price: ''
                    }*/],
                    id_product: 0,
                    name_product: "", ////////////////////////ojoooooooo ver esto 
                    description_product: '',
                    sale_price: ''
                })
            } else {
                this.setState({
                    productsByCategory: arr_send,
                    id_product: arr_send[0].id_product,
                    name_product: arr_send[0].name_product,
                    description_product: arr_send[0].description_product,
                    sale_price: arr_send[0].sale_price
                })
            }
        }
        return arr_send
    }

    onClickCant = (product_ob, index, p) => {
        //console.log(product_ob[index].stock);
        let cont = parseInt(document.getElementById(product_ob[index].name_product).value)
        if (p === "+") {
            if (product_ob[index].stock > cont) {
                document.getElementById(product_ob[index].name_product).value = cont + 1
            }
        } else {
            if (cont > 1) {
                document.getElementById(product_ob[index].name_product).value = cont - 1
            }
        }
        //console.log(this.state.productsByCategory);
    }

    render() {
        return (
            <div className="container">
                <div className="row" >
                
                    <div className="col-md-12">
                    <h2>Búsqueda</h2>
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
                        </div>
                        <div className="form-group">
                            Tipo
                                <input
                                name="type_store"
                                type="text"
                                className="form-control"
                                value={this.state.type_store}
                                onChange={this.onChangeUseOperation}
                                disabled />
                        </div>
                        <div className="form-group">
                            Categoría:
                                    <select className="form-control" onChange={this.onChangeUseOperation}
                                name="category"
                                id="category">
                                {
                                    this.state.categories.map((v, i, p) =>
                                        (<option key={i} value={p[i]} >{p[i]}</option>))
                                }
                            </select>
                        </div>
                        <h2>Listado de Productos</h2>
                        {
                            this.state.productsByCategory.map((v, i, product_ob) =>
                                (<div className="container" key={i}>
                                    <h2 >{product_ob[i].name_product}</h2>
                                    
                                    <div className="form-group">
                                        Stock Disponible
                                <input
                                            name="cant"
                                            type="number"
                                            className="form-control"
                                            // value={this.state.stock}
                                            value={product_ob[i].stock}
                                            required
                                            disabled />
                                    </div>
                                    <div className="form-group">
                                        Cantidad
                                <input
                                            id={product_ob[i].name_product}
                                            type="number"
                                            //min="1"
                                            value={1}
                                            //implementar maximo
                                            className="form-control"
                                            placeholder="Número"
                                            required
                                            disabled />

                                        <input
                                            id="inc"
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => this.onClickCant(product_ob, i, "+")}
                                            value="+" />
                                        <input
                                            id="dec"
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => this.onClickCant(product_ob, i, "-")}
                                            value="-" />

                                    </div>
                                    <div className="form-group">
                                        Descripción
                                <input
                                            name="description_product"
                                            type="text"
                                            className="form-control"
                                            value={product_ob[i].description_product}
                                            placeholder="Descripcion"
                                            required
                                            disabled />
                                    </div>
                                    <div className="form-group">
                                        <td><img src={"data:image/png;base64,"+product_ob[i].image_product} alt="Imágen" height="300" width="250"/></td>
                                    </div>
                                    <div className="form-group">
                                        Precio
                                <input
                                            name="sale_price"
                                            type="number"
                                            className="form-control"
                                            value={product_ob[i].sale_price.toFixed(2)}
                                            placeholder="Número decimal"
                                            required
                                            disabled />
                                    </div>

                                    <button className="btn btn-primary" onClick={() => this.onClicProduct(product_ob, i)}>Añadir al carrito</button>
                                </div>))

                        }

                    </div>
                </div>
            </div>
        )

    }


}