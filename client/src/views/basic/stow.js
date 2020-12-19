import moment from "moment";

export const clearMoney = (string) => {
  return parseFloat(string);
};

// export const stow_date = (due_date, deadline) => {
//   if (due_date.length !== 0) {
//     return moment(due_date).format("DD/MM/YYYY");
//   } else {
//     if (deadline.length === 0 || deadline == 0) {
//       return due_date;
//     } else {
//       if (deadline < 0) {
//         deadline *= -1;
//       }
//       var due = moment(new Date()).add(deadline, "day").format("DD/MM/YYYY");
//       return due;
//     }
//   }
// };

export const stow_payday = (payday) => {
  if (payday.length === 0) {
    var today = new Date();
    var dat =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    // payday = moment(new Date()).format("DD/MM/YYYY");

    return dat;
  }

  return payday;
};

export const stow_deadline = (due_date, deadline, payday) => {
  if (due_date.length !== 0) {
    if (deadline.length !== 0) {
      return deadline;
    } else {
      // var today = new Date();
      // var dat =
      //   today.getFullYear() +
      //   "/" +
      //   (today.getMonth() + 1) +
      //   "/" +
      //   today.getDate();
      // var date = moment(dat);
      var date = moment(payday);
      var due = moment(due_date);
      // console.log(due)
      const duration = moment.duration(due.diff(date));
      // console.log(duration.asDays());
      return duration.asDays();
    }
  } else {
    if (deadline.length !== 0 || deadline !== 0) {
      return deadline;
    } else {
      return 0;
    }
  }
};

export const stow_debt = (balance) => {
  if (balance === "") {
    return 0;
  } else {
    balance = clearMoney(balance);
    if (balance > 0) {
      return balance * -1;
    } else {
      return balance;
    }
  }
};

export const stow_debt2 = (balance, cond) => {
  if (balance === "") {
    return 0;
  } else {
    balance = clearMoney(balance);
    if (cond === 1) {
      if (balance < 0) {
        return balance * -1;
      } else {
        return balance;
      }
    }else{
      if (balance > 0) {
        return balance;
      } else {
        return balance;
      }
    }
  }
};