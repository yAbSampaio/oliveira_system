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
import { routeGetClient } from "../../../util/Api";
import { routeEdit } from "../../../util/Api";
import { cpfMask, telMask, cepMask } from "../mask";
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
import "./edit.css";
import "../top.css";

const Edit = ({ history }) => {
  let { id } = useParams();
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
    error: "",
    message: "",
  });
  useEffect(() => {
    if (!state.fetched) {
      var data = { id };
      routeGetClient(data).then(function (data) {
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
        setState({ ...state, fetched: true, client });
      });
    }
  }, []);

  const editClient = () => {
    setState({
      ...state, error: "", message: ""
    })
    var msg = "";
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

    msg = validate_cpf(client.cpf, msg);
    msg = validate_name(client.name, msg);
    msg = validate_telephone(client.telephone, msg);
    msg = validate_address(
      client.cep,
      client.street,
      client.home_num,
      client.district,
      msg
    );
    var err = msg != "" ? false : true;
    setState({
      ...state, error: err, message: msg
    });
    
    const data = {
      client: client,
      index: id
    };
    if (err) {
      routeEdit(data)
        .then(function (data) {
          history.push("/profile/" + id);
          // history.go(0);
        })
        .catch((err) => {
          setState({
            ...state,
            error: false,
            message: " Aconteceu um erro Tente Novamente",
          });

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

  const handleClick = (route) => {
    history.push("/" + route);
  };

  return (
    <div className="register">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>EDITANDO CLIENTE</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        {state.error && (
          <CCard className="border-success" style={{ textAlign: "center" }}>
            Successs
          </CCard>
        )}
        {!state.error && state.message != "" && (
          <CCard className="border-danger" style={{ textAlign: "center" }}>
            Erros :{state.message}
          </CCard>
        )}
        <CRow id="tablesEdit">
          <CCol sm="12">
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
                    value={state.client.name}
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
                    value={state.client.street}
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
                        value={state.client.district}
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
                        value={state.client.home_num}
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
                        value={state.client.job}
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
        </CRow>

        <div id="divBut">
          <submit type="submit" class="myButton" onClick={() => editClient()}>
            Editar
          </submit>
        </div>
      </body>
    </div>
  );
};

export default Edit;
