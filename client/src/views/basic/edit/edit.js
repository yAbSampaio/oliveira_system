//React
import React, { useState, useEffect, Component } from "react";
import { useHistory } from "react-router-dom";
//CoreUi
import {
  CContainer,
  CCard,
  CRow,
  CCol,
  CForm,
  CSelect,
  CFormText,
  CListGroup,
  CListGroupItem,
  CModal,
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
import { routeRegister } from "../../../util/Api";
import { cpfMask, telMask, cepMask } from "../mask";
import {
  clearString,
  validate_address,
  validate_balance,
  validate_cpf,
  validate_name,
  validate_telephone,
  validate_debt
} from "../validate";
//Style
import './edit.css';
import "../top.css";


const Edit = ({ history }) => {
  const [state, setState] = useState({
    client: {//setar com valores do banco
      name: "",
      cpf: "",
      street: "",
      home_num: "",
      district: "",
      cep: "",
      telephone: "",
      job: "",
    },
    error: "",
    message: "",
  });

  const editClient = () => {
    const client = {
      name: state.client.name,
      cpf: clearString(state.client.cpf),
      street: state.client.street,
      home_num: state.client.home_num,
      district: state.client.district,
      cep: clearString(state.client.cep),
      telephone: clearString(state.client.telephone),
      job: state.client.job,
    };

    var error =
      !validate_cpf(client.cpf) ||
      !validate_name(client.name) ||
      !validate_telephone(client.telephone) ||
      !validate_address(
        client.cep,
        client.street,
        client.home_num,
        client.district
      )
        ? true
        : false;
    // var error = validate_name(client.name);
    // var error = validate_telephone(client.telephone);
    // var error = validate_balance(
    //   payment.balance,
    //   payment.payday,
    //   payment.due_date
    //   );
    // var error = validate_address(
    //   client.cep,
    //   client.street,
    //   client.home_num,
    //   client.district
    // );
    console.log(error);
    const data = {
      client: client,
    };

    routeRegister(data).then(function (data) {
      history.push("/profile");
    });
  };

  const handlechange = (e) => {
    let client = { ...state.client };
    client.cpf = cpfMask(e.target.value);
    setState({ ...state, client });
  };

  const telephoneChange = (e) => {
    let client = { ...state.client };
    client.telephone = telMask(e.target.value);
    setState({ ...state, client });
  };
  const cepChange = (e) => {
    let client = { ...state.client };
    client.cep = cepMask(e.target.value);
    setState({ ...state, client });
  };

  const handleClick = (route) => {
    history.push("/" + route);
  };

  return (
    <div className="register">
      <body>
        <div id="title">
          <h2>Editando Cliente</h2>
        </div>
        {state.message && (
          <CCard className="border-success" style={{ textAlign: "center" }}>
            {state.message}
          </CCard>
        )}
        {state.error && (
          <CCard className="border-danger" style={{ textAlign: "center" }}>
            {state.error}
          </CCard>
        )}
        <div id="tablesEdit">
          <table>
            <h1>Cliente</h1>
            <tr>
              <td>Nome :</td>
              <td>
                <CInput
                  type="text"
                  placeholder="Thiago Jasen Sampaio"
                  onChange={(e) => {
                    let client = { ...state.client };
                    client.name = e.target.value;
                    setState({ ...state, client });
                  }}
                ></CInput>
              </td>
            </tr>
            <tr>
              <td>CPF :</td>
              <td>
                <CInput
                  maxLength="14"
                  name="cpf"
                  value={state.client.cpf}
                  placeholder="123.456.789-00"
                  onChange={(e) => handlechange(e)}
                ></CInput>
              </td>
            </tr>
            <tr>
              <td>Endereço :</td>
              <td>
                <CInput
                  type="text"
                  placeholder="Rua Elmer"
                  onChange={(e) => {
                    let client = { ...state.client };
                    client.street = e.target.value;
                    setState({ ...state, client });
                  }}
                ></CInput>
              </td>
            </tr>
            <tr>
              <td>Numero :</td>
              <td>
                <CInput
                  type="text"
                  placeholder="131"
                  onChange={(e) => {
                    let client = { ...state.client };
                    client.home_num = e.target.value;
                    setState({ ...state, client });
                  }}
                ></CInput>
              </td>
            </tr>
            <tr>
              <td>Bairo</td>
              <td>
                <CInput
                  maxLength="9"
                  name="district"
                  placeholder="Cidade Nova"
                  onChange={(e) => {
                    let client = { ...state.client };
                    client.district = e.target.value;
                    setState({ ...state, client });
                  }}
                ></CInput>
              </td>
            </tr>
            <tr>
              <td>CEP :</td>
              <td>
                <CInput
                  maxLength="9"
                  name="cep"
                  placeholder="12345-678"
                  value={state.client.cep}
                  onChange={(e) => cepChange(e)}
                ></CInput>
              </td>
            </tr>

            <tr>
              <td>Telefone :</td>
              <td>
                <CInput
                  type="tel"
                  maxLength="15"
                  name="tel"
                  value={state.client.telephone}
                  onChange={(e) => telephoneChange(e)}
                  placeholder="(53) 981408183"
                ></CInput>
              </td>
            </tr>

            <tr>
              <td>Trabalho :</td>
              <td>
                <CInput
                  name="job"
                  onChange={(e) => {
                    let client = { ...state.client };
                    client.job = e.target.value;
                    setState({ ...state, client });
                  }}
                  placeholder="Taxista"
                ></CInput>
              </td>
            </tr>
          </table>
          
        </div>
        <div id="divBut">
          <CButton class="myButton" onClick={() => editClient()}>
            Editar
          </CButton>
        </div>
      </body>
    </div>
  );
};

export default Edit;
