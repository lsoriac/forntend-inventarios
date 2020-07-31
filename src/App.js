import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
//import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'; // Archivo Javascript de Bootstrap 4 

import Navigation from './Components/Navigation'
import IndexTemp from './Components/IndexTemp'

import FormLogin from './Components/FormLogin'
import CloseSession from './Components/CloseSession'

import FormUser from './Components/FormUser'
import FormProduct from './Components/FormProduct'
import FormStore from './Components/FormStore'
import FormProvider from './Components/FormProvider'


import ListUsers from './Components/ListUsers'
import ListProducts from './Components/ListProducts'
import ListStores from './Components/ListStores'
import ListProviders from './Components/ListProviders'


import Sale from './Components/Sale'
import PurchaseOrder from './Components/PurchaseOrder'

import ListPurchaseOrders from './Components/ListPurchaseOrders'
import ListProductsPO from './Components/ListProductsPO'

import ListFacturas from './Components/ListFacturas'
import ListProductsFact from './Components/ListProductsFact'

import Carrito from './Components/Carrito'

import Report from './Components/Report'
import Graphic from './Components/Graphic'

import Footer from './Components/Footer'

function App() {
  return (
  <Router>
    <Navigation/>
    <div className="container p-4" style = {{minHeight: "85vh"}}>
    <Route path="/" exact component={IndexTemp}/>

    <Route path="/login" component={FormLogin}/>
    <Route path="/close" component={CloseSession}/>

    <Route path="/user" component={ListUsers}/>
    <Route path="/manage-user" component={FormUser}/>
    <Route path="/edit-user/:id" component={FormUser}/>

    <Route path="/product" component={ListProducts}/>
    <Route path="/manage-product" component={FormProduct}/>
    <Route path="/edit-product/:id" component={FormProduct}/>
  
    <Route path="/sale" component={Sale}/>
    <Route path="/purchase-order" component={PurchaseOrder}/>
    
    <Route path="/store" component={ListStores}/>
    <Route path="/manage-store" component={FormStore}/>
    <Route path="/edit-store/:id" component={FormStore}/>

    <Route path="/provider" component={ListProviders}/>
    <Route path="/manage-provider" component={FormProvider}/>
    <Route path="/edit-provider/:id" component={FormProvider}/>

    <Route path="/report" component={Report}/>
    <Route path="/graphic" component={Graphic}/>
    
    <Route path="/list-purchase-order" component={ListPurchaseOrders}/>
    <Route path="/list-purchase-order-products/:id" component={ListProductsPO}/>

    <Route path="/list-factura" component={ListFacturas}/>
    <Route path="/list-factura-products/:id" component={ListProductsFact}/>


    <Route path="/carrito" component={Carrito}/>

    </div>
    <Footer/>
  </Router>
    );
}

export default App;
