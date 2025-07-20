import React, { useEffect, useState } from "react";

interface Props {
  tipo: "ruc" | "dni" | "placa" | "anio" | "telefono" | "email" | "color" | "rucdni";
  valor: string;
  onChange: (valor: string) => void;
  onValidoChange?: (valido: boolean) => void;
  placeholder?: string;
  className?: string; // clase del input (ej: "input-formateado input-fecha")
  disabled?: boolean;
  mensajeErrorExtra?: string;
}

// 🔹 Mensajes de error por tipo
const obtenerMensajeError = (tipo: Props["tipo"]): string => {
  switch (tipo) {
    case "ruc": return "RUC inválido. Ej: 20-123456789";
    case "dni": return "DNI inválido. Debe tener 8 dígitos.";
    case "telefono": return "Teléfono inválido.";
    case "anio": return `Año inválido.`;
    case "placa": return "Formato: ABC-123";
    case "email": return "Correo inválido.";
    case "color": return "Solo texto permitido.";
    case "rucdni": return "DNI o RUC invalido";
    default: return "Campo inválido";
  }
};

// 🔹 Formatear valor
const formatearValor = (valor: string, tipo: Props["tipo"]): string => {
  const limpio = valor.replace(/\W/g, "").toUpperCase();

  switch (tipo) {
    case "ruc": {
      const ruc = limpio.slice(0, 11);
      if (ruc.length <= 2) return ruc;
      return `${ruc.slice(0, 2)}-${ruc.slice(2)}`;
    }
    case "dni":
      return limpio.slice(0, 8);

    case "telefono": {
      const soloNumeros = valor.replace(/\D/g, "").slice(0, 9);
      return soloNumeros.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      );
    }

    case "anio":
      return valor.replace(/\D/g, "").slice(0, 4);

    case "placa": {
      const limpio = valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // opcional: limpiar caracteres no alfanuméricos
      const parte1 = limpio.slice(0, 3);
      const parte2 = limpio.slice(3, 6);
      return parte1 + (parte2 ? `-${parte2}` : "");
    }

    case "email":
      return valor.trim();

    case "color":
      return valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚ\s]/g, "");

    case "rucdni": {
      const limpio = valor.replace(/\D/g, "");
      if (limpio.length <= 8) {
        return limpio.slice(0, 8); // DNI
      } else {
        const ruc = limpio.slice(0, 11);
        if (ruc.length <= 2) return ruc;
        return `${ruc.slice(0, 2)}-${ruc.slice(2)}`; // RUC
      }
    }

    default:
      return valor;
  }
};

// 🔹 Validar valor según tipo
const validarValor = (valor: string, tipo: Props["tipo"]): boolean => {
  switch (tipo) {
    case "ruc":
      return /^\d{2}-\d{8,9}$/.test(valor);
    case "dni":
      return /^\d{8}$/.test(valor);
    case "telefono":
      return /^9\d{2} \d{3} \d{3}$/.test(valor);
    case "anio": {
      const anio = Number(valor);
      const actual = new Date().getFullYear();
      return /^\d{4}$/.test(valor) && anio >= 1700 && anio <= actual;
    }
    case "placa":
      return /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(valor.toUpperCase());
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    case "color":
      return /^[a-zA-ZáéíóúÁÉÍÓÚ\s]{1,50}$/.test(valor.trim());
    case "rucdni":
      return /^\d{8}$/.test(valor) || /^\d{2}-\d{8,9}$/.test(valor);
    default:
      return true;
  }
};

// 🔹 Longitud máxima permitida
const obtenerMaxLength = (tipo: Props["tipo"]): number | undefined => {
  switch (tipo) {
    case "ruc": return 13;
    case "dni": return 8;
    case "telefono": return 11;
    case "anio": return 4;
    case "placa": return 7;
    case "color": return 50;
    case "rucdni": return 13;
    default: return undefined;
  }
};

// 🔹 Componente principal
const FormatoInputs: React.FC<Props> = ({
  tipo,
  valor,
  onChange,
  onValidoChange,
  placeholder,
  className = "",
  disabled,
  mensajeErrorExtra,
}) => {
  const [valido, setValido] = useState(true);

  useEffect(() => {
    const esValido = valor.trim() === "" ? true : validarValor(valor, tipo);
    setValido(esValido);
    onValidoChange?.(esValido);
  }, [valor, tipo, onValidoChange]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    const formateado = formatearValor(texto, tipo);
    // Evita bucle infinito: solo actualiza si cambia
    if (formateado !== valor) {
      onChange(formateado);
    }
  };

  return (
    <div className="input-fecha-con-calendario">
      <input
        type={tipo === "email" ? "email" : "text"}
        value={valor}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={obtenerMaxLength(tipo)}
        className={`${className} ${!valido ? "input-error" : ""}`}
      />
      {(valor.trim() !== "" && !valido) || mensajeErrorExtra ? (
        <div className="mensaje-error">
          {mensajeErrorExtra ? mensajeErrorExtra : obtenerMensajeError(tipo)}
        </div>
      ) : null}

    </div>
  );
};

export default FormatoInputs;
