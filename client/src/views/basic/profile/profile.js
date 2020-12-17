//React
import React, { useState,useEffect,Component } from 'react';
import { useHistory,useParams } from "react-router-dom";
//CoreUi
//Api
import { cpfMask } from '../mask'
import { CButton } from '@coreui/react';
import {routeGetClient} from "../../../util/Api";
import moment from "moment";
//Style
import './profile.css';
import '../top.css';


const Profile = ({history}) => {
  let { id } = useParams();

    const [state,setState] = useState({
        cpf: '',
        fetched:false,
        client: {
          name: "",
          cpf: "",
          street: "",
          home_num: "",
          district: "",
          cep: "",
          telephone: "",
          job: "",
        },
        payment: {
          balance: "",
          payday: "",
          due_date: "",
        },
        error: "",
        message: "",
      })
    
      const handlechange = (e) => {
        setState({ ...state, cpf: cpfMask(e.target.value) })
      }
    
      const handleClick = (route) => {
        history.push("/" + route);
      };
    
      useEffect(()=>{
        if(!state.fetched){
            var data = {id}
            routeGetClient(data).then(function (data){

            var payday = moment(new Date(data.payday)).format('DD/MM/YYYY')
            var due_date = moment(new Date(data.payday)).add(data.deadline,'day').format('DD/MM/YYYY')
  
            const client = {
              name: data.name,
              cpf: data.cpf,
              street: data.street,
              home_num: data.home_num,
              district: data.district,
              cep: data.cep,
              telephone: data.telephone,
              job: data.job,
            }
            
            const payment = {
              balance: data.balance < 0 ? parseFloat(data.balance)*-1 : data.balance,
              payday: payday,
              due_date: due_date,
            }
            setState({ ...state, fetched: true, client , payment});
            })
        }
      },[])
    
      return ( 
        <div className="search">
          <div>
            <div id="title"><h2>Informações do Cliente</h2></div>
            <div id="tables">
              <table>
                  <h1>Cliente</h1>
                  <tr><td>Nome :</td>
                      <td>{state.client.name}
                      </td></tr>
                  <tr><td>CPF :</td>
                      <td>{state.client.cpf.substring(0,3)}.{state.client.cpf.substring(3,6)}.{state.client.cpf.substring(6,9)}-{state.client.cpf.substring(9)}
                      </td></tr>
                  <tr><td>Endereço :</td>
                      <td>{state.client.street}
                      </td></tr>
                  <tr><td>Numero :</td>
                      <td>{state.client.home_num}
                      </td></tr>
                  <tr><td>Bairo :</td>
                      <td>{state.client.district}
                      </td></tr>
                  <tr><td>CEP :</td>
                      <td>{state.client.cep}
                      </td></tr>
                  <tr><td>Telefone :</td>
                      <td>({state.client.telephone.substring(0,2)}) {state.client.telephone.substring(2,7)}-{state.client.telephone.substring(7)}
                      </td></tr>
                  <tr><td>Trabalho :</td>
                      <td>{state.client.job}
                      </td></tr>
              </table>
              <table>
              <h1>Débito</h1>
                  <tr><td>Débito Atual :</td>
                      <td>{state.payment.balance}
                      </td></tr>
                  <tr><td>Vencimento :</td>
                      <td>{state.payment.due_date}
                      </td></tr>
                  {/* <tr><td>Ultimo Pagamento :</td>
                      <td><p>200.00</p>
                      </td></tr> */}
                  <tr><td>Ultima data :</td>
                      <td>{state.payment.payday}
                      </td></tr>
              </table>
            </div>
            <div id="divBut">
              <CButton onClick={() => handleClick("edit")} class="myButton">Editar</CButton>
              <CButton onClick={() => handleClick("pay")} class="myButton">Pagamento</CButton>
            </div>
          </div>
        </div>
      )
}



export default Profile;