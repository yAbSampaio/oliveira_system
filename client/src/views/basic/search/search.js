//React
import React, { useState, useEffect, Component } from "react";
import { useHistory } from "react-router-dom";
//CoreUi
import {
  CBadge,
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
  CDataTable,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
//Api
//Api
import { routeSearchClient } from "../../../util/Api";
import { cpfMask } from "../mask";
import { clearString } from "../validate";
//Style
import "./search.css";
import "../top.css";

const Search = ({ history }) => {
  const fields = ["name", "registered", "role", "status"];

  const [state, setState] = useState({
    cpf: "",
    name: "",
    input_check: false,
    client_list: [],
    list_check: false,
  });

  const handlechange = (e) => {
    setState({ ...state, cpf: cpfMask(e.target.value) });
  };

  const handleClick = (id) => {
    history.push("/profile/" + id);
  };
  const researched = () => {
    if (state.cpf != "") {
      var index = 1;
      var search = clearString(state.cpf);
      state.cpf = "";
      state.input_check = true;
    } else if (state.name != "") {
      var index = 2;
      var search = state.name;
      state.input_check = true;
    } else {
      state.input_check = false;
    }

    if (state.input_check) {
      var data = { index, search };
      console.log(data);
      routeSearchClient(data).then(function (data) {
        console.log(data);
        setState({ ...state, client_list: data, list_check: true });
      });
    }
  };

  return (
    <body>
      <div className="search">
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>PESQUISAR</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        <div id="research">
          <CRow>
            <CCol>
              <CCard>
                <CCardBody>
                  <CFormGroup row className="my-0">
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel>Telefone :</CLabel>
                        <CInput
                          id="Input"
                          maxLength="14"
                          name="documentId"
                          value={state.cpf}
                          onChange={(e) => handlechange(e)}
                          placeholder="123.456.789-00"
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel>Trabalho :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          placeholder="Thiago Jasen Sampaio"
                          value={state.name}
                          onChange={(e) => {
                            setState({ ...state, name: e.target.value });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <submit
                    type="submit"
                    class="Button"
                    onClick={() => researched()}
                  >
                    Procurar
                  </submit>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h2>Clientes</h2>
              </CCardHeader>
              <CCardBody>
                <table
                  className="table table-hover table-outline mb-0 d-none d-sm-table"
                  id="list"
                >
                  {state.list_check ? (
                    <thead className="thead-light">
                      <th>Nome: </th>
                      <th>CPF: </th>
                      <th>Endereço: </th>
                      <th>Divida: </th>
                    </thead>
                  ) : null}
                  {state.client_list.map((client, index) => (
                    <tbody>
                      <tr onClick={() => handleClick(client.id)}>
                        <td> {client.name} </td>
                        <td>
                          {" "}
                          {client.cpf.substring(0, 3)}.
                          {client.cpf.substring(3, 6)}.
                          {client.cpf.substring(6, 9)}-{client.cpf.substring(9)}{" "}
                        </td>
                        <td>
                          {" "}
                          {client.street}, {client.home_num}, {client.district}
                        </td>
                        <td> R$ {client.balance * -1} </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </body>
  );
};
export default Search;
