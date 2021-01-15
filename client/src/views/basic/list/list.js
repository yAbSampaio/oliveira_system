//React
import React, { useEffect, useState } from "react";
//CoreUi
import {
  CCard,
  CRow,
  CButton,  
  CCol,
  CCardBody,
  CCardHeader,
  CBadge,
  CDataTable,
} from "@coreui/react";
//Api
import { routeListClient } from "../../../util/Api";
import { cpfMask, telMask, cepMask, moneyMask } from "../mask";
import moment from "moment";

//Style
import "./list.css";
import "../top.css";

const DueDate = ({ history }) => {
  const [state, setState] = useState({
    fetched: false,
    clientList: [],
    today: "",
    fields: ["Nome", "Vencimento", "Endereço", "Divida", "Mais-Info"],
    list_check: false,
  });

  const getBadge = (due)=>{
    var today = new Date();
    today = moment(today);

    const duration = moment.duration(today.diff(due));
      
    var days = duration.asDays();
    if (days <= 1) {
      return 'success';
    }
    if (days >= 30) {
      return 'danger';
    } else {
      return 'warning';
    } 
  }
  const handleClick = (id) => {
    history.push("/profile/" + id);
  };
  const NewDate = (data) => {
    var today = new Date();
    var date = moment(today);
    var Lista = new Array(0);
    
    // console.log(Lista);
    for (let index = 0; index < data.length; index++) {
      // console.log(date);
      if (moment(data[index].due_date) > (date) || data[index].balance === 0) {
        console.log("teste");
      }else{
        var cliente = {
          Id: "",
          Nome: "",
          // Cpf: "",
          Vencimento: "",
          Endereço: "",
          Divida: "",
          Perfil: "",
        };  
        cliente.Id = data[index].id;
        cliente.Nome = data[index].name;
        // cliente.Cpf = data[index].cpf;
        cliente.Vencimento = moment(data[index].due_date);
        cliente.Endereço =
          data[index].street +
          ", " +
          data[index].home_num +
          ", " +
          data[index].district;
        cliente.Divida = -1*data[index].balance;
        // console.log(cliente);
        Lista.push(cliente);
        // console.log(Lista);
      }
    }
    // console.log(Lista);
    return Lista;
  };
  useEffect(() => {
    if (!state.fetched) {
      var today = new Date();
      var date = moment(today).format("DD/MM/YYYY");
      var data = { today: date };
      routeListClient(data).then(function (data) {
        setState({
          ...state,
          fetched: true,
          list_check: true,
          clientList: NewDate(data),
          today: date,
        });
      });

      state.list_check = state.clientList != "" ? true : false;
    }
  }, []);

  return (
    <div className="dueDate">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>VENCIMENTOS</h2>
            </CCardHeader>
            <CCardBody>
              <h1>Data: {state.today}</h1>
            </CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        <CRow>
          <CCol>
            <CCard>
              <CCardHeader>
                <h2>Clientes</h2>
              </CCardHeader>
              <CCardBody>
                {/* <table
                  className="table table-hover table-outline mb-0 d-none d-sm-table"
                  id="list"
                >
                  <thead className="thead-light">
                    <th>Nome: </th>
                    <th>Vencimento: </th>
                    <th>Endereço: </th>
                    <th>Divida: </th>
                  </thead>
                  {state.clientList.map((client, index) => (
                    <tbody>
                      <tr onClick={() => handleClick(client.id)}>
                        <td> {client.name} </td>
                        <td></td>
                        <td>
                          {client.street}, {client.home_num}, {client.district}
                        </td>
                        <td> R$ {client.balance * -1} </td>
                      </tr>
                    </tbody>
                  ))}
                </table> */}
                {state.list_check ? (
                  <CDataTable
                    items={state.clientList}
                    fields={state.fields}
                    tableFilter
                    footer
                    striped
                    itemsPerPageSelect
                    itemsPerPage={10}
                    pagination
                    scopedSlots={{
                      'Mais-Info': (item, index) => {
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
                              Info
                            </CButton>
                          </td>
                        );
                      },
                      Vencimento: (item) => (
                        <td>
                          <CBadge color={getBadge(item.Vencimento)} id="tamanho">
                            {item.Vencimento.format("DD/MM/YYYY")}
                          </CBadge>
                        </td>
                      ),
                      Divida: (item) => (
                        <td id="outros">
                            R$: {item.Divida}
                        </td>
                      ),
                      Endereço: (item) => (
                        <td id="outros">
                            {item.Endereço}
                        </td>
                      ),
                      Nome: (item) => (
                        <td id="outros">
                            {item.Nome}
                        </td>
                      ),
                      
                    }}
                  />
                ) : null}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </body>
    </div>
  );
};

export default DueDate;
