export const clearString = (string) => {
  string = string.split("(").join("");
  string = string.split(")").join("");
  string = string.split(" ").join("");
  string = string.split(".").join("");
  string = string.split("-").join("");
  string = string.split("_").join("");
  string = string.split("/").join("");
  return string;
};
export const validate_cpf = (cpf) => {
  var numeros, digitos, soma, i, resultado, digitos_iguais;
  digitos_iguais = 1;

  if (cpf.length !== 11) return false;
  for (i = 0; i < cpf.length - 1; i++)
    if (cpf.charAt(i) != cpf.charAt(i + 1)) {
      digitos_iguais = 0;
      break;
    }
  if (!digitos_iguais) {
    numeros = cpf.substring(0, 9);
    digitos = cpf.substring(9);
    soma = 0;
    for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;
    numeros = cpf.substring(0, 10);
    soma = 0;
    for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;
    return true;
  } else return false;
};

export const validate_name = (name) => {
  var aux = new RegExp(/^[a-zA-Z-' ]*$/);
  if (name == "") {
    return false;
  } else {
    if (!aux.test(name)) {
      return false;
    } else {
      return true;
    }
  }
};

export const validate_address = (cep, street, house, district) => {
  var aux = new RegExp(/^[0-9a-zA-Z-' ]*$/);
  
  if (cep == "" || street == "" || house == "" || district == "") {
    return false;
  } else {
    if (cep.length !== 8) {
      return false;
    }
    if (!aux.test(street) || !aux.test(house) || !aux.test(district)) {
      return false;
    } else {
      return true;
    }
  }
};

export const validate_telephone = telephone => {
  if ((telephone.length !== 11) && (telephone.length !== 10)){
    return false;
  } 
  var aux = new RegExp(/[0-9]*$/);
  if (!aux.test(telephone)) {
    return false;
  }
  else{
    return true;
  }
}

export const validate_debt = balance =>{
  if (balance == "") {
    return 0;
  }
  else{
    return balance;
  }
}

export const validate_balance = (balance, payday, due_date) =>{
  if (balance == 0) {
    if (payday !== "") {
      return true;
    }else {
      return false;
    }   
  }
}
