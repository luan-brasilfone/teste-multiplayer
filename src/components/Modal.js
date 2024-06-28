import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  background-color: #6aaa64;
  color: white;
  border: none;
  border-radius: 8px;
`;

const CustomModal = ({ isOpen, onRequestClose, message, onClose }) => {
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#3b3b3b',
      color: 'white',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Game Over"
    >
      <h2>{message}</h2>
      <ModalButton onClick={onClose}>Fechar</ModalButton>
    </Modal>
  );
};

export default CustomModal;