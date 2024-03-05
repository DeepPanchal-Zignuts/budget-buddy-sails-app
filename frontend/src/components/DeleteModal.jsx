import React from 'react';
import { Modal } from 'antd';
import { CgDanger } from 'react-icons/cg';

const DeleteModal = ({ visible, onOk, onCancel, account }) => {
  return (
    <Modal
      title={
        <div className="flex items-center">
          <CgDanger size={25} style={{ color: 'red' }} />
          <span style={{ paddingLeft: '2px' }}>Confirm Delete</span>
        </div>
      }
      visible={visible}
      onOk={onOk} // Trigger delete action
      onCancel={onCancel} // Close modal
      okText="Delete"
      okButtonProps={{
        style: {
          backgroundColor: 'red',
        },
      }}
      cancelText="Cancel"
    >
      <p>
        Are you sure you want to delete <b>{account.name}</b> account?
      </p>
    </Modal>
  );
};

export default DeleteModal;
