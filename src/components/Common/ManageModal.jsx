import { AiOutlineClose } from 'react-icons/ai';
import Modal from 'react-modal';

export default function ManageModal({
  isOpen,
  handleClose,
  title,
  children,
  size = 'md',
  ...rest
}) {
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
      style={modalStyles}
      className={`modal ${size}`}
      overlayClassName="modal_overlay"
      {...rest}
    >
      <button className="close_btn" onClick={handleClose}>
        <AiOutlineClose size={16} />
      </button>
      {title && <h4 className="title">{title}</h4>}
      {children}
    </Modal>
  );
}
