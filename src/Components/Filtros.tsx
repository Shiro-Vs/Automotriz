import React from "react";

import FormatoInputs from "./FormatoInputs";
import InputFechas from "./InputFechas";

type TipoCampo =
  | "input"
  | "select"
  | "formato"
  | "fecha";

interface CampoFiltro {
  tipo: TipoCampo;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  opciones?: { label: string; value: string }[]; // solo para select
  formatoTipo?: "ruc" | "dni" | "placa" | "anio" | "telefono" | undefined; // solo para formato
}

interface Props {
  titulo?: string;
  campos: CampoFiltro[];
  onFiltrar: () => void;
  onExportar: () => void;
  onLimpiar?: () => void;
}

const Filtros: React.FC<Props> = ({ titulo = "Filtros", campos, onFiltrar, onExportar, onLimpiar }) => {

  const validarFecha = (fecha: Date | null): boolean => {
    if (!fecha || isNaN(fecha.getTime())) return false;

    const fechaMin = new Date("1950-01-01");
    const fechaMax = new Date();

    return fecha >= fechaMin && fecha <= fechaMax;
  };


  return (
    <div className="filtros-contenedor">
      <h3>{titulo}</h3>

      {campos.map((campo, i) => {
        return (
          <React.Fragment key={i}>
            <label>{campo.label}</label>

            {campo.tipo === "input" && (
              <input
                type="text"
                placeholder={campo.placeholder}
                value={campo.value}
                onChange={(e) => campo.onChange?.(e.target.value)}
              />
            )}

            {campo.tipo === "formato" && (
              <FormatoInputs
                tipo={campo.formatoTipo!}
                valor={campo.value || ""}
                onChange={(v) => campo.onChange?.(v)}
                placeholder={campo.placeholder}
              />
            )}

            {campo.tipo === "fecha" && (
              <InputFechas
                fecha={campo.value ? new Date(campo.value) : null}
                onChange={(v) => {
                  // Solo valida si hay valor (no null)
                  if (v) {
                    if (validarFecha(v)) {
                      campo.onChange?.(v.toISOString());
                    } else {
                      alert("Fecha inválida. Debe estar entre el 01/01/1550 y hoy.");
                    }
                  } else {
                    campo.onChange?.(""); // O puedes no hacer nada si prefieres
                  }
                }}
                placeholder={campo.placeholder || "dd/mm/aaaa"}
              />
            )}


            {campo.tipo === "select" && (
              <select
                value={campo.value}
                onChange={(e) => campo.onChange?.(e.target.value)}
              >
                {campo.opciones?.map((op, idx) => (
                  <option key={idx} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            )}
          </React.Fragment>
        );
      })}

      <div className="contenedor-botones">
        <button className="boton-filtrar" onClick={onFiltrar}>
          Filtrar
        </button>
        <button className="boton-exportar" onClick={onExportar}>
          Exportar Excel
        </button>
        {onLimpiar && (
          <button className="boton-limpiar" onClick={onLimpiar}>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default Filtros;
