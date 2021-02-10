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
import moment from "moment";
//Style
import "./search.css";
import "../top.css";

const Search = ({ history }) => {
  const [state, setState] = useState({
    cpf: "",
    name: "",
    street: "",
    due_date: "",
    district: "",
    job: "",
    inpTxt: "",
    case: "",
    input_check: false,
    fields: ["Nome", "Vencimento", "Endereço", "Divida", "Perfil"],
    client_list: [],
    list_check: false,
  });

  const getBadge = (due) => {
    var today = new Date();
    today = moment(today);

    const duration = moment.duration(today.diff(due));

    var days = duration.asDays();
    if (days <= 3) {
      return "success";
    }
    if (days >= 30) {
      return "danger";
    } else {
      return "warning";
    }
  };
  const handlechange = (e) => {
    setState({ ...state, cpf: cpfMask(e.target.value), inpTxt: cpfMask(e.target.value), case: 1 });
  };

  const handleClick = (id) => {
    history.push("/profile/" + id);
    history.go(0);
  };
  const NewDate = (data) => {
    var Lista = new Array(0);
    for (let index = 0; index < data.length; index++) {
      var cliente = {
        Id: "",
        Nome: "",
        Vencimento: "",
        Endereço: "",
        Divida: "",
        Perfil: "",
      };
      cliente.Id = data[index].id;
      cliente.Nome = data[index].name;
      cliente.Vencimento = moment(data[index].due_date);
      cliente.Endereço =
        data[index].street +
        ", " +
        data[index].home_num +
        ", " +
        data[index].district;
      cliente.Divida = -1 * data[index].balance;
      Lista.push(cliente);
    }
    // console.log(Lista);
    return Lista;
  };
  const researched = () => {
    console.log(state.inpTxt)
    if (state.cpf != "") {
      var index = state.case;
      var search = clearString(state.cpf);
      state.cpf = "";
      state.inpTxt = "";
      state.input_check = true;
    } else if (state.inpTxt != "") {
      var index = state.case;
      var search = state.inpTxt;
      console.log(search)
      state.inpTxt = "";
      state.input_check = true;
    // } else if (state.due_date != "") {
    //   var index = 3;
    //   var search = state.due_date;
    //   state.due_date = "";
    //   state.input_check = true;
    // } else if (state.street != "") {
    //   var index = 4;
    //   var search = state.street;
    //   state.street = "";
    //   state.input_check = true;
    // } else if (state.district != "") {
    //   var index = 5;
    //   var search = state.district;
    //   state.district = "";
    //   state.input_check = true;
    // }  else if (state.job != "") {
    //   var index = 6;
    //   var search = state.job;
    //   state.job = "";
    //   state.input_check = true;
    }  else {
      state.input_check = false;
    }

    if (state.input_check) {
      var data = { index, search };
      console.log(data);
      routeSearchClient(data).then(function (data) {
        // console.log(data);
        setState({ ...state, client_list: NewDate(data), list_check: true });
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
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>CPF :</CLabel>
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
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Nome :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="nome"
                          placeholder="Thiago Jasen Sampaio"
                          // value={state.inpTxt}
                          onChange={(e) => {
                            setState({ ...state, inpTxt: e.target.value, case: 2 });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Vencimento :</CLabel>
                        <CInput
                          type="date"
                          name="due_date"
                          onChange={(e) => {
                            setState({ ...state, inpTxt: e.target.value, case: 3 });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Rua :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="street"
                          placeholder="Elmer Lawsorense"
                          // value={state.inpTxt}
                          onChange={(e) => {
                            setState({ ...state, inpTxt: e.target.value, case: 4 });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="my-0">
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Bairro</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="district"
                          placeholder="Cidade Nova"
                          // value={state.district}
                          onChange={(e) => {
                            setState({ ...state, inpTxt: e.target.value, case: 5 });
                          }}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs="3">
                      <CFormGroup>
                        <CLabel>Observações :</CLabel>
                        <CInput
                          id="Input"
                          type="text"
                          name="ob"
                          placeholder="Trabalho ou Erros"
                          value={state.job}
                          onChange={(e) => {
                            setState({ ...state, inpTxt: e.target.value, case: 6 });
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
                {state.list_check ? (
                  <CDataTable
                    items={state.client_list}
                    fields={state.fields}
                    tableFilter
                    footer
                    striped
                    itemsPerPageSelect
                    itemsPerPage={10}
                    pagination
                    scopedSlots={{
                      "Perfil": (item, index) => {
                        return (
                          <td className="py-2">
                            <CButton
                              color="primary"
                              variant="outline"
                              id="outros"
                              shape="square"
                              size="sm"
                              onClick={() => {
                                handleClick(item.Id);
                              }}
                            >
                              Perfil
                            </CButton>
                          </td>
                        );
                      },
                      Vencimento: (item) => (
                        <td>
                          <CBadge
                            color={getBadge(item.Vencimento)}
                            id="tamanho"
                          >
                            {item.Vencimento.format("DD/MM/YYYY")}
                          </CBadge>
                        </td>
                      ),
                      Divida: (item) => <td id="outros">R$: {item.Divida}</td>,
                      Endereço: (item) => <td id="outros">{item.Endereço}</td>,
                      Nome: (item) => <td id="outros">{item.Nome}</td>,
                    }}
                  />
                ) : null}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </body>
  );
};
export default Search;
