// Converte números para extenso em português
export const numberToWords = (num: number): string => {
  if (num === 0) return "zero reais";

  const units = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const teens = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const tens = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  const convertHundreds = (n: number): string => {
    if (n === 0) return "";
    if (n === 100) return "cem";
    
    let result = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (h > 0) result += hundreds[h];
    
    if (t === 1) {
      if (result) result += " e ";
      result += teens[u];
      return result;
    }

    if (t > 0) {
      if (result) result += " e ";
      result += tens[t];
    }

    if (u > 0) {
      if (result) result += " e ";
      result += units[u];
    }

    return result;
  };

  const convertThousands = (n: number): string => {
    if (n === 0) return "";
    if (n === 1) return "mil";
    
    const h = convertHundreds(n);
    return h + " mil";
  };

  const convertMillions = (n: number): string => {
    if (n === 0) return "";
    if (n === 1) return "um milhão";
    
    const h = convertHundreds(n);
    return h + (n > 1 ? " milhões" : " milhão");
  };

  // Separar em milhões, milhares e centenas
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;

  let result = "";

  if (millions > 0) {
    result += convertMillions(millions);
  }

  if (thousands > 0) {
    if (result) {
      result += remainder > 0 ? ", " : " e ";
    }
    result += convertThousands(thousands);
  }

  if (remainder > 0) {
    if (result) {
      result += thousands === 0 && millions > 0 ? " e " : result.includes("mil") ? " e " : " e ";
    }
    result += convertHundreds(remainder);
  }

  return result + " reais";
};

export const currencyToWords = (value: string): string => {
  // Remove formatação e converte para número
  const numValue = Number(value.replace(/[^\d,]/g, "").replace(",", "."));
  if (isNaN(numValue)) return "";
  
  return numberToWords(Math.floor(numValue));
};
