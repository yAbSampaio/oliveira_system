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
import "./payment.css";
import "../top.css";

const Payment = ({ history }) => {
  const [state, setState] = useState({
    client: {
      name: "",
      cpf: "",
    },
    payment: {
      balance: "",
      payday: "",
      due_date: "",
    },
    error: "",
    message: "",
  });

  const payAtt = () => {
    const client = {
      name: state.client.name,
      cpf: clearString(state.client.cpf),
    };

    const payment = {
      balance: validate_debt(state.payment.balance),
      payday: state.payment.payday,
      due_date: state.payment.due_date,
    };

    var error = !validate_balance(payment.balance, payment.payday, payment.due_date);
 
    const data = {
      client: client,
      payment: payment,
    };

    routeRegister(data).then(function (data) {
      history.push("/profile");
    });
  };
  const handleClick = (route) => {
    history.push("/" + route);
  };
  return (
    <div className="register">
      <body>
        <div id="title">
          <h2>Atualizando Pagamento</h2>
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
        <div id="tablesPay">
          <table>
            <h1>Débito</h1>
            <tr>
              <td>Saldo :</td>
              <td>
                <CInput
                  type="number"
                  name="balance"
                  placeholder="000.00"
                  onChange={(e) => {
                    let payment = { ...state.payment };
                    payment.balance = e.target.value;
                    setState({ ...state, payment });
                  }}
                ></CInput>
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
        </div>
        <div id="divBut">
          <CButton class="myButton" onClick={() => payAtt()}>
            Atualizar
          </CButton>
        </div>
      </body>
    </div>
  );
};

export default Payment;
