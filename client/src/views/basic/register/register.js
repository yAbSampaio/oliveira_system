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
  CCardBody,
  CCardHeader,
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
import IntlCurrencyInput from "react-intl-currency-input";
import { cpfMask, telMask, cepMask, moneyMask } from "../mask";
import {
  clearString,
  validate_address,
  validate_balance,
  validate_cpf,
  validate_name,
  validate_telephone,
  validate_debt,
} from "../validate";
//Style
import "./register.css";
import "../top.css";

const Register = ({ history }) => {
  const [state, setState] = useState({
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

  const balanceConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

  const register = () => {
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

    const payment = {
      balance: validate_debt(state.payment.balance),
      payday: state.payment.payday,
      due_date: state.payment.due_date,
    };

    var error =
      !validate_cpf(client.cpf) ||
      !validate_name(client.name) ||
      !validate_telephone(client.telephone) ||
      !validate_balance(payment.balance, payment.payday, payment.due_date) ||
      !validate_address(
        client.cep,
        client.street,
        client.home_num,
        client.district
      )
        ? true
        : false;
    console.log(error);
    const data = {
      client: client,
      payment: payment,
    };

    if (!error) {
      routeRegister(data).then(function (data) {
        history.push("/register");
      });
    }
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
  const moneyChange = (e, value, maskedValue) => {
    e.preventDefault();
    let payment = { ...state.payment };
    payment.balance = value;
    setState({ ...state, payment });
  };

  const handleClick = (route) => {
    history.push("/" + route);
  };
  return (
    <div className="register">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>REGISTRANDO CLIENTE</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
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
        <CRow>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader>
                <h5>CLIENTE</h5>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel>Nome :</CLabel>
                  <CInput
                    type="text"
                    placeholder="Thiago Jasen Sampaio"
                    onChange={(e) => {
                      let client = { ...state.client };
                      client.name = e.target.value;
                      setState({ ...state, client });
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel>CPF :</CLabel>
                  <CInput
                    placeholder="123.456.789-00"
                    maxLength="14"
                    name="cpf"
                    value={state.client.cpf}
                    onChange={(e) => handlechange(e)}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="street">Rua :</CLabel>
                  <CInput
                    type="text"
                    placeholder="Rua Elmer"
                    onChange={(e) => {
                      let client = { ...state.client };
                      client.street = e.target.value;
                      setState({ ...state, client });
                    }}
                  />
                </CFormGroup>
                <CFormGroup row className="my-0">
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel>Bairro :</CLabel>
                      <CInput
                        name="district"
                        placeholder="Cidade Nova"
                        onChange={(e) => {
                          let client = { ...state.client };
                          client.district = e.target.value;
                          setState({ ...state, client });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel>Casa :</CLabel>
                      <CInput
                        type="text"
                        placeholder="131"
                        onChange={(e) => {
                          let client = { ...state.client };
                          client.home_num = e.target.value;
                          setState({ ...state, client });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="4">
                    <CFormGroup>
                      <CLabel>CEP :</CLabel>
                      <CInput
                        maxLength="9"
                        name="cep"
                        placeholder="12345-678"
                        value={state.client.cep}
                        onChange={(e) => cepChange(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row className="my-0">
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel>Telefone :</CLabel>
                      <CInput
                        type="tel"
                        maxLength="15"
                        name="tel"
                        value={state.client.telephone}
                        onChange={(e) => telephoneChange(e)}
                        placeholder="(53) 981408183"
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
                    <CFormGroup>
                      <CLabel>Trabalho :</CLabel>
                      <CInput
                        name="job"
                        onChange={(e) => {
                          let client = { ...state.client };
                          client.job = e.target.value;
                          setState({ ...state, client });
                        }}
                        placeholder="Taxista"
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="6">
            <CCard>
              <CCardHeader>
                <h5>CONTA</h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel>Saldo :</CLabel>
                      <IntlCurrencyInput
                        id="inp"
                        currency="BRL"
                        autoFocus={true}
                        autoSelect={true}
                        config={balanceConfig}
                        onChange={moneyChange}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel>Vencimento :</CLabel>
                      <CInput
                        type="date"
                        name="due_date"
                        onChange={(e) => {
                          let payment = { ...state.payment };
                          payment.due_date = e.target.value;
                          setState({ ...state, payment });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel>Ultima data :</CLabel>
                      <CInput
                        type="date"
                        name="payday"
                        onChange={(e) => {
                          let payment = { ...state.payment };
                          payment.payday = e.target.value;
                          setState({ ...state, payment });
                        }}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        {/* <div id="tables">
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
          <table id="debt">
            <h1>Débito</h1>
            <tr id="tr">
              <td>Saldo :</td>
              <td>
                <IntlCurrencyInput
                  id="inp"
                  currency="BRL"
                  autoFocus={true}
                  autoSelect={true}
                  config={balanceConfig}
                  onChange={moneyChange}
                />
              </td>
            </tr>
            <tr>
              <td>Vencimento :</td>
              <td>
                <CInput
                  type="date"
                  name="due_date"
                  onChange={(e) => {
                    let payment = { ...state.payment };
                    payment.due_date = e.target.value;
                    setState({ ...state, payment });
                  }}
                ></CInput>
              </td>
            </tr>
            <tr>
              <td>Ultima data :</td>
              <td>
                <CInput
                  type="date"
                  name="payday"
                  onChange={(e) => {
                    let payment = { ...state.payment };
                    payment.payday = e.target.value;
                    setState({ ...state, payment });
                  }}
                ></CInput>
              </td>
            </tr>
          </table>
        </div> */}
        <div id="divBut">
          <submit type="submit" class="myButton" onClick={() => register()}>
            Registrar
          </submit>
        </div>
      </body>
    </div>
  );
};

export default Register;
