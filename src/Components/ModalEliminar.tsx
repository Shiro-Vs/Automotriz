import logo from "../assets/Logos/Logo.png";
import "../Styles/Modales/ModalEliminar.css";

type ModalEliminarProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entidad?: string; // <- Texto dinámico (ej. "el vehículo", "el trabajador")
};

const ModalEliminar = ({ isOpen, onClose, onConfirm, entidad }: ModalEliminarProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-eliminar-overlay" onClick={onClose}>
      <div className="modal-eliminar-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-eliminar-navbar">
          <img src={logo} alt="Logo" className="modal-eliminar-logo" />
        </div>
        <div className="modal-eliminar-body">
          <h2 className="modal-eliminar-titulo">¿Estás seguro?</h2>
          <p className="modal-eliminar-texto">
            Esta acción eliminará permanentemente {entidad || "el elemento"}.
          </p>
          <div className="modal-eliminar-botones">
            <button className="modal-eliminar-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button className="modal-eliminar-confirmar" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminar;

