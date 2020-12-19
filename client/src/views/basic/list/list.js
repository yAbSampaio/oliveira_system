//React
import React, { useEffect, useState } from "react";
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
import { routeListClient } from "../../../util/Api";
import { cpfMask, telMask, cepMask, moneyMask } from "../mask";
//Style
import "./list.css";
import "../top.css";

const DueDate = ({ history }) => {
  const [state, setState] = useState({
    fetched: false,
    clientList: [],
    today: "",
  });

  const handleClick = (id) => {
    history.push("/profile/" + id);
  };

  useEffect(() => {
    if (!state.fetched) {
      var today = new Date();
      var date =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear();
      var data = { today: date };
      routeListClient(data).then(function (data) {
        console.log(data);
        setState({ ...state, fetched: true, clientList: data, today: date });
      });
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
            {state.clientList.map((client, index) => (
              <CCard>
                <CCardHeader>
                  <h2>Clientes</h2>
                </CCardHeader>
                <CCardBody>
                  <table
                    className="table table-hover table-outline mb-0 d-none d-sm-table"
                    id="list"
                  >
                    <thead className="thead-light">
                      <th>Nome: </th>
                      <th>CPF: </th>
                      <th>Endereço: </th>
                      <th>Divida: </th>
                    </thead>

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
                  </table>
                </CCardBody>
              </CCard>
            ))}
          </CCol>
        </CRow>
      </body>
    </div>
  );
};

export default DueDate;
