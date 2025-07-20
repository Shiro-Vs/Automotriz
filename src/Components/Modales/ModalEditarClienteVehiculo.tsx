// src/Components/ModalEditarClienteVehiculo.tsx
import { useEffect } from 'react';
import logo from '../../assets/Logos/logo.png';
import '../../Styles/Modales/ModalNuevoVehiculo.css';
import FormatoInputs from '../FormatoInputs';

interface CampoFormulario {
  name: string;
  label: string;
  type: string;
  value: string;
  formatoTipo?: "ruc" | "dni" | "telefono" | "anio" | "placa" | "email" | "color" | "rucdni";
}

interface ModalEditarClienteVehiculoProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  campos: CampoFormulario[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const ModalEditarClienteVehiculo = ({
  isOpen,
  onClose,
  titulo,
  campos,
  onChange,
  onSubmit
}: ModalEditarClienteVehiculoProps) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-navbar">
          <img src={logo} alt="Logo" className="modal-logo" />
        </div>

        <div className="modal-body">
          <h2 className="modal-titulo">{titulo}</h2>

          <div className="formulario-columns">
            <div className="form-section">
              {campos.map((campo) => (
                <div key={campo.name}>
                  <label>{campo.label}</label>

                  {campo.formatoTipo ? (
                    <FormatoInputs
                      tipo={campo.formatoTipo}
                      valor={campo.value}
                      onChange={(value) => {
                        onChange({
                          target: {
                            name: campo.name,
                            value,
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    />
                  ) : (
                    <input
                      name={campo.name}
                      type={campo.type}
                      value={campo.value}
                      onChange={onChange}
                    />
                  )}

                </div>
              ))}
            </div>
          </div>

          <button className="boton-enviar" onClick={onSubmit}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarClienteVehiculo;
