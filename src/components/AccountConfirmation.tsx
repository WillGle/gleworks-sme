import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountConfirmation = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleConfirmation = () => {
    // Simulate confirmation logic
    setIsConfirmed(true);
    // Redirect to a different page with UI
    navigate('/confirmation-success');
  };

  return (
    <div>
      {isConfirmed ? (
        <p>Your account has been confirmed!</p>
      ) : (
        <p>Your registration is pending confirmation. Please check your email to confirm your account.</p>
      )}
      <button onClick={handleConfirmation}>Confirm Email</button>
    </div>
  );
};

export default AccountConfirmation;
