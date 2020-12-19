//React
import React, { useState, useEffect, Component } from "react";
import { useHistory, useParams } from "react-router-dom";
//CoreUi
import {
  CCard,
  CRow,
  CCol,
  CCardBody,
  CCardHeader,
  CLabel,
  CInput,
  CFormGroup,
  CInputCheckbox,
} from "@coreui/react";
//Api
import { routePay } from "../../../util/Api";
import IntlCurrencyInput from "react-intl-currency-input";
// import { cpfMask, telMask, cepMask } from "../mask";
import { stow_deadline, stow_debt, stow_debt2, stow_payday } from "../stow";
import moment from "moment";
import { validate_date } from "../validate";
//Style
import "./payment.css";
import "../top.css";

const Payment = ({ history }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    payment: {
      balance: "",
      payday: "",
      due_date: "",
      deadline: "",
    },
    error: "",
    message: "",
    buy: "",
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

  const moneyChange = (e, value, maskedValue) => {
    e.preventDefault();
    let payment = { ...state.payment };
    payment.balance = value;
    setState({ ...state, payment });
  };

  const payAtt = () => {
    state.error = "";
    state.message = "";
    const payment = {
      balance: stow_debt2(state.payment.balance, state.buy),
      payday: stow_payday(state.payment.payday),
      deadline: "",
    };
    payment.deadline = stow_deadline(
      state.payment.due_date,
      state.payment.deadline,
      payment.payday
    );
    state.message = validate_date(
      payment.payday,
      payment.deadline,
      state.message,
      payment.balance
    );
    state.error = state.message != "" ? false : true;
    const data = {
      client_id: id,
      payment: payment,
    };
    if (state.error) {
      routePay(data)
        .then(function (data) {
          history.push("/profile");
        })
        .catch((err) => {
          setState({
            ...state,
            error: false,
            message: " Aconteceu um erro Tente Novamente",
          });
          history.push("/pay/" + id);
        });
    } else {
      history.push("/pay/" + id);
    }
  };
  return (
    <div className="register">
      <body>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>ATUALIZAR PAGAMENTO</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <hr className="mt-0" />
        {state.error && (
          <CCard className="border-success" style={{ textAlign: "center" }}>
            Success
          </CCard>
        )}
        {!state.error && state.message != "" && (
          <CCard className="border-danger" style={{ textAlign: "center" }}>
            Erros :{state.message}
          </CCard>
        )}
        <CRow id="tablesPay">
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                <h5>CONTA</h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup row className="my-0">
                      <CCol xs="8">
                        <CFormGroup>
                          <CLabel>Saldo :</CLabel>
                          <IntlCurrencyInput
                            id="inp"
                            currency="BRL"
                            autoFocus={true}
                            autoSelect={true}
                            value={state.payment.balance}
                            config={balanceConfig}
                            onChange={moneyChange}
                          />
                        </CFormGroup>
                      </CCol>
                      <CCol xs="4">
                        <CLabel>Pagamento ? </CLabel>
                        <CFormGroup variant="custom-radio" inline>
                          <CInputCheckbox
                            custom
                            id="inline-radio1"
                            name="inline-radios"
                            value={1}
                            onChange={(e) => {
                              setState({ ...state, buy: e.target.value });
                            }}
                          />
                          <CLabel
                            variant="custom-checkbox"
                            htmlFor="inline-radio1"
                          >
                            Sim
                          </CLabel>
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup row className="my-0">
                      <CCol xs="6">
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
                      <CCol xs="6">
                        <CFormGroup>
                          <CLabel>Prazo :</CLabel>
                          <CInput
                            type="number"
                            min="0"
                            onChange={(e) => {
                              let payment = { ...state.payment };
                              payment.deadline = e.target.value;
                              setState({ ...state, payment });
                            }}
                            placeholder="15"
                          />
                        </CFormGroup>
                      </CCol>
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

        <div id="divBut">
          <submit type="submit" class="myButton" onClick={() => payAtt()}>
            Editar
          </submit>
        </div>
      </body>
    </div>
  );
};

export default Payment;
