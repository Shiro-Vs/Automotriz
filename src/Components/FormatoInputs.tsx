import React from "react";

interface Props {
  tipo: "ruc" | "dni" | "placa" | "anio" | "telefono";
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  className?: string;
}

const formatearValor = (valor: string, tipo: Props["tipo"]) => {
  const limpio = valor.replace(/\W/g, "").toUpperCase(); // quitar símbolos y mayúsculas si aplica

  switch (tipo) {
    case "ruc":
      // RUC: 20-XXXXXXXXXXX
      if (!limpio.startsWith("20")) return limpio;
      return limpio.length > 2
        ? `${limpio.slice(0, 2)}-${limpio.slice(2, 11)}`
        : limpio;

    case "dni":
      return limpio.slice(0, 8);

    case "placa":
      // Formato clásico: ABC-123
      const letras = limpio.slice(0, 3);
      const numeros = limpio.slice(3, 6);
      return letras + (numeros ? `-${numeros}` : "");

    case "anio":
      return limpio.slice(0, 4); // 4 números

    case "telefono":
      const t = limpio.slice(0, 9);
      return t.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));

    default:
      return valor;
  }
};

const FormatoInputs: React.FC<Props> = ({
  tipo,
  valor,
  onChange,
  placeholder,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoTexto = e.target.value;
    const formateado = formatearValor(nuevoTexto, tipo);
    onChange(formateado);
  };

  return (
    <input
      type="text"
      value={valor}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default FormatoInputs;
