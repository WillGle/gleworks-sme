import React, { useState, useEffect } from 'react';

interface RegistrationStatusProps {
    userId: string;
}

interface UserStatusResponse {
    confirmed: boolean;
}

function RegistrationStatus({ userId }: RegistrationStatusProps) {
    const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');

    useEffect(() => {
        // Fetch the user's confirmation status from the server
        fetch(`/api/user/${userId}/status`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: UserStatusResponse) => {
                if (data.confirmed) {
                    setStatus('confirmed');
                }
            })
            .catch(error => {
                console.error('Error fetching user status:', error);
            });
    }, [userId]);

    return (
        <div>
            {status === 'pending' ? (
                <p>Your registration is pending confirmation. Please check your email to confirm your account.</p>
            ) : (
                <p>Your account has been successfully confirmed. Thank you!</p>
            )}
        </div>
    );
}

const ConfirmationSuccess: React.FC = () => {
  const userId = 'someUserId'; // Replace with actual user ID logic

  return (
    <div className="confirmation-success">
      <h1>Email Confirmed Successfully!</h1>
      <p>You can now log in to your account.</p>
      <RegistrationStatus userId={userId} />  // Add this line to use the component
    </div>
  );
};

export default ConfirmationSuccess;
