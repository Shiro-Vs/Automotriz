
import React, { useState, useEffect, useRef } from "react";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../Styles/Componentes/InputsError.css";
import "../Styles/Componentes/SelectorFecha.css";

interface Props {
  fecha: Date | null;
  onChange: (fecha: Date | null) => void;
  placeholder?: string;
}

const formatearFecha = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const parsearFecha = (texto: string): Date | null => {
  const partes = texto.split("/");
  if (partes.length !== 3) return null;
  const [dd, mm, yyyy] = partes.map(Number);
  const fecha = new Date(`${yyyy}-${mm}-${dd}`);
  return (
    !isNaN(fecha.getTime()) &&
    fecha.getDate() === dd &&
    fecha.getMonth() + 1 === mm &&
    fecha.getFullYear() === yyyy
  )
    ? fecha
    : null;
};

const InputFechas: React.FC<Props> = ({ fecha, onChange, placeholder }) => {
  const [texto, setTexto] = useState(fecha ? formatearFecha(fecha) : "");
  const [error, setError] = useState("");
  const datepickerRef = useRef<any>(null);

  // Si cambia la fecha desde fuera, actualizar texto
  useEffect(() => {
    if (fecha) {
      setTexto(formatearFecha(fecha));
    } else {
      setTexto("");
    }
  }, [fecha]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limpio = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formateado = limpio;
    if (limpio.length >= 5)
      formateado = `${limpio.slice(0, 2)}/${limpio.slice(2, 4)}/${limpio.slice(4)}`;
    else if (limpio.length >= 3)
      formateado = `${limpio.slice(0, 2)}/${limpio.slice(2)}`;
    setTexto(formateado);
    setError("");
  };

  const handleBlur = () => {
    const limpio = texto.replace(/\D/g, ""); // Solo números

    if (limpio.length < 8) {
      // Si no hay una fecha completa, no validamos ni mostramos error
      setError("");
      onChange(null);
      return;
    }

    const fechaValida = parsearFecha(texto);
    if (fechaValida) {
      onChange(fechaValida);
      setTexto(formatearFecha(fechaValida));
      setError("");
    } else {
      onChange(null);
      setError("Fecha inválida");
    }
  };



  const handleCalendarChange = (fechaSeleccionada: Date | null) => {
    onChange(fechaSeleccionada);
    if (fechaSeleccionada) {
      setTexto(formatearFecha(fechaSeleccionada));
      setError("");
    }
  };

  return (
    <div className="input-fecha-con-calendario">
      <input
        type="text"
        value={texto}
        onChange={handleTextChange}
        onBlur={handleBlur}
        placeholder={placeholder || "dd/mm/aaaa"}
        className={`input-formateado input-fecha ${error ? "input-error" : ""}`}
        onClick={() => datepickerRef.current.setOpen(true)}
      />
      <DatePicker
        selected={fecha}
        onChange={handleCalendarChange}
        dateFormat="dd/MM/yyyy"
        ref={datepickerRef}
        popperPlacement="bottom"
        popperClassName="calendario-centro"
        customInput={<input style={{ display: "none" }} />}
        calendarClassName="mi-calendario"
        wrapperClassName="datepicker-oculto"
      />
      {error && <p className="mensaje-error">{error}</p>}
    </div>

  );
};

export default InputFechas;
