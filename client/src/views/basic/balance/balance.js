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
import { routeBalance, routeHistoric } from "../../../util/Api";
import moment from "moment";
import { alert } from "../../../util/alertApi";
//Style
import "./balance.css";
import "../top.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import

const Profile = ({ history }) => {
  let { id } = useParams();

  const [state, setState] = useState({
    today: "",
    Aux: false,
    accu: 1,
    mouth: "",
    year: "",
    fetched: false,
    Vendas: [],
    Lucros: [],
    Legenda: [
      "Zero",
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    aux: [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  });
  const handleClick = (route) => {
    history.push("/" + route);
  };

  const NewDate = (data, number, aux) => {
    var buy = [0, 0, 0, 0, 0];
    var sell = [0, 0, 0, 0];
    var date = state.year + "-" + aux + "-" + 1; //aarumar logica number e accu e passar como pARAMETRO
    // console.log(date)
    var day = moment(date);
    for (let i = 0; i < data.length; i++) {
      if (data[i].balance > 0) {
        buy[0] += data[i].balance;
        // console.log(data[i]);
        var duration = moment.duration(day.diff(data[i].payday));
        var days = -1 * duration.asDays();
        if (days <= 7) {
          buy[1] += data[i].balance;
        } else if (days <= 14) {
          buy[2] += data[i].balance;
        } else if (days <= 22) {
          buy[3] += data[i].balance;
        } else {
          buy[4] += data[i].balance;
        }
      } else {
        switch (data[i].balance) {
          case -300:
            sell[0] += 1;
            break;
          case -290:
            sell[0] += 1;
            break;
          case -600:
            sell[0] += 2;
            break;
          case -580:
            sell[0] += 2;
            break;
          case -390:
            sell[1] += 1;
            break;
          case -400:
            sell[1] += 1;
            break;
          case -780:
            sell[1] += 2;
            break;
          case -800:
            sell[1] += 2;
            break;
          case -450:
            sell[2] += 1;
            break;
          case -430:
            sell[2] += 1;
            break;
          case -860:
            sell[2] += 2;
            break;
          case -900:
            sell[2] += 2;
            break;
          case 0:
            break;

          default:
            console.log(data[i]);
            sell[3] += 1;
            break;
        }
      }
    }

    if (
      (state.mouth == 1 && number == -1) ||
      (state.mouth == 12 && number == 1)
    ) {
      if (number == 1) {
        var mou = 1;
      } else {
        var mou = 12;
      }
    } else {
      var mou = state.mouth + number;
    }

    setState({ ...state, Vendas: sell, Lucros: buy, mouth: mou });
  };

  const NewMouth = (number) => {
    var today = new Date();
    // console.log(state.mouth)
    // console.log(number)
    if (
      state.mouth + number > state.today.getMonth() + 1 &&
      state.year == state.today.getFullYear()
    ) {
      var Aux = false;
    } else if (
      (state.mouth == 1 && number == -1) ||
      (state.mouth == 12 && number == 1)
    ) {
      var Aux = true;
      if (number == 1) {
        var mou = 1;
      } else {
        var mou = 12;
      }
      // state.mouth = mou;

      state.year += number;
      var date = {
        mouth: mou,
        year: state.year,
        day: state.aux[mou],
      };
    } else {
      var Aux = true;
      var date = {
        mouth: state.mouth + number,
        year: state.year,
        day: state.aux[state.mouth + number],
      };
      var mou = state.mouth + number;
    }
    // console.log(date);
    var data = date;
    if (Aux) {
      routeBalance(data).then(function (data) {
        NewDate(data, number, mou);
      });
    }
  };

  useEffect(() => {
    state.today = new Date();
    state.mouth = state.today.getMonth() + 1;

    state.year = state.today.getFullYear();
    var date = {
      mouth: state.today.getMonth() + 1,
      year: state.today.getFullYear(),
      day: state.aux[state.today.getMonth() + 1],
    };
    // console.log(date);
    // setState({ ...state, today: date });
    var data = date;
    if (!state.fetched) {
      routeBalance(data).then(function (data) {
        // console.log(data);
        NewDate(data, 0, state.today.getMonth() + 1);
      });
    }
  }, []);

  return (
    <div className="profile">
      <div>
        <div id="title">
          <CCard>
            <CCardHeader>
              <h2>Saldos de Venda: {state.Legenda[state.mouth]}</h2>
            </CCardHeader>
            <CCardBody></CCardBody>
          </CCard>
        </div>
        <CRow id="table">
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>Vendas</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tbody>
                    <tr>
                      <td>Pequena :</td>
                      <td>{state.Vendas[0]}</td>
                    </tr>
                    <tr>
                      <td>Media :</td>
                      <td>{state.Vendas[1]}</td>
                    </tr>
                    <tr>
                      <td>Grande :</td>
                      <td>{state.Vendas[2]}</td>
                    </tr>
                    <tr>
                      <td>Erros na Contagem :</td>
                      <td>{state.Vendas[3]}</td>
                    </tr>
                  </tbody>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol>
            <CCard>
              <CCardHeader>
                <h1>Saldos</h1>
              </CCardHeader>
              <CCardBody>
                <table>
                  <tr>
                    <td>Total Atual :</td>
                    <td> R$ {state.Lucros[0]}</td>
                  </tr>
                  <tr>
                    <td>Semana 1 :</td>
                    <td> R$ {state.Lucros[1]}</td>
                  </tr>
                  <tr>
                    <td>Semana 2 :</td>
                    <td> R$ {state.Lucros[2]}</td>
                  </tr>
                  <tr>
                    <td>Semana 3 :</td>
                    <td> R$ {state.Lucros[3]}</td>
                  </tr>
                  <tr>
                    <td>Semana 4 :</td>
                    <td> R$ {state.Lucros[4]}</td>
                  </tr>
                </table>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <div id="divBut">
          <CButton onClick={() => NewMouth(-1)} class="myButton">
            Mês Anterior
          </CButton>
          <CButton onClick={() => NewMouth(1)} class="myButton">
            Proximo Mês
          </CButton>
        </div>
      </div>
    </div>
  );
};

export default Profile;
