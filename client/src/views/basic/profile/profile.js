//React
import React, { useState, useEffect, Component } from "react";
import { useHistory, useParams } from "react-router-dom";
//CoreUi
import {
  CContainer,
  CCard,
  CRow,
  CCol,
  CForm,
  CSelect,
  CCardBody,
  CCardHeader,
  CFormText,
  CListGroup,
  CListGroupItem,
  CModal,
  CDataTable,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CLabel,
  CInput,
  CFormGroup,
  CDropdown,
  CDropdownItem,
  CDropdownToggle,
  CDropdownMenu,
  CImg,
} from "@coreui/react";
//Api
import { cpfMask } from "../mask";
import { routeGetClient, routeHistoric } from "../../../util/Api";
import moment from "moment";
import { alert } from "../../../util/alertApi";
//Style
import "./profile.css";
import "../top.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import

const Profile = ({ history }) => {
  let { id } = useParams();

  const [state, setState] = useState({
    cpf: "",
    fetched: false,
    List: [],
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
  });

  const handlechange = (e) => {
    setState({ ...state, cpf: cpfMask(e.target.value) });
  };

  const handleClick = (route) => {
    history.push("/" + route);
  };

  const NewDate = (data) => {
    var today = new Date();
    var date = moment(today);
    var Lista = new Array(0);

    // console.log(Lista);
    for (let index = 0; index < data.length; index++) {
      // console.log(date);

      var hist = {
        payday: "",
        balance: "",
        due_date: "",
      };
      hist.payday =  moment(data[index].payday).format("DD/MM/YYYY");
      if (data[index].balance == 0 && index !== 0) {
        hist.balance = "Adiou";  
      }
      else{
        hist.balance = data[index].balance;
      }
      hist.due_date = moment(data[index].due_date).format("DD/MM/YYYY");

      Lista.push(hist);
      
    }
    
    pop(Lista);
    return Lista;
  };

  const pop = (dataLis) => {
    
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Historico</h1>
            <table
              className="table table-hover table-outline mb-0 d-none d-sm-table"
              id="list"
            >
              <thead className="thead-light">
                <th>Data Inicial: </th>
                <th>Valor: </th>
                <th>Vencimento: </th>
              </thead>
              {dataLis.map((info, index) => (
                <tbody>
                  <tr>
                    <td> {info.payday} </td>
                    <td>{info.balance}</td>
                    <td>{info.due_date} </td>
                  </tr>
                </tbody>
              ))}
            </table>
            <button class="myBut" onClick={onClose}>Sair</button>
          </div>
        );
      },
    });
  };

  const historic = () => {
    var data = { id };
    routeHistoric(data).then(function (data) {
      // console.log(data);
      setState({
        ...state,
        List: NewDate(data),
      });
    });
    };

  useEffect(() => {
    if (!state.fetched) {
      var data = { id };
      routeGetClient(data).then(function (data) {
        var payday = moment(new Date(data.payday)).format("DD/MM/YYYY");
        var due_date = moment(new Date(data.payday))
          .add(data.deadline, "day")
          .format("DD/MM/YYYY");

        const client = {
          name: data.name,
          cpf: data.cpf,
          street: data.street,
          home_num: data.home_num,
          district: data.district,
          cep: data.cep,
          telephone: data.telephone,
          job: data.job,
        };

        const payment = {
          balance:
            data.balance < 0 ? parseFloat(data.balance) * -1 : data.balance,
          payday: payday,
          due_date: due_date,
        };
        setState({ ...state, fetched: true, client, payment });
      });
      
    }
  }, []);

  return (
    <div className="profile">
      <div>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>INFO CLIENTE</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <CRow id="table">
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>CLIENTE</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tbody>
                    <tr>
                      <td>Nome :</td>
                      <td>{state.client.name}</td>
                    </tr>
                    <tr>
                      <td>CPF :</td>
                      <td>
                        {state.client.cpf.substring(0, 3)}.
                        {state.client.cpf.substring(3, 6)}.
                        {state.client.cpf.substring(6, 9)}-
                        {state.client.cpf.substring(9)}
                      </td>
                    </tr>
                    <tr>
                      <td>Endereço :</td>
                      <td>{state.client.street}</td>
                    </tr>
                    <tr>
                      <td>Numero :</td>
                      <td>{state.client.home_num}</td>
                    </tr>
                    <tr>
                      <td>Bairo :</td>
                      <td>{state.client.district}</td>
                    </tr>
                    <tr>
                      <td>CEP :</td>
                      <td>{state.client.cep}</td>
                    </tr>
                    <tr>
                      <td>Telefone :</td>
                      <td>
                        ({state.client.telephone.substring(0, 2)}){" "}
                        {state.client.telephone.substring(2, 7)}-
                        {state.client.telephone.substring(7)}
                      </td>
                    </tr>
                    <tr>
                      <td>Observações :</td>
                      <td>{state.client.job}</td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>CONTA</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tr>
                    <td>Débito Atual :</td>
                    <td> R$ {state.payment.balance}</td>
                  </tr>
                  <tr>
                    <td>Vencimento :</td>
                    <td>{state.payment.due_date}</td>
                  </tr>
                  <tr>
                    <td>Ultima data :</td>
                    <td>{state.payment.payday}</td>
                  </tr>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <div id="divBut">
          <CButton onClick={() => handleClick("edit/" + id)} class="myButton">
            Editar
          </CButton>
          <CButton onClick={() => handleClick("pay/" + id)} class="myButton">
            Pagamento
          </CButton>
          <CButton onClick={() => historic()} class="myButton">
            Historico
          </CButton>
        </div>
      </div>
    </div>
  );
};

export default Profile;
