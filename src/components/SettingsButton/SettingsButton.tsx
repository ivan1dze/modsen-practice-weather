import './SettingsButton.css';

import React from 'react';

const SettingsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      className="settings-button"
      onClick={onClick}
      type="button"
      title="Settings"
    >
      <span className="settings-icon">⚙️</span>
    </button>
  );
};

export default SettingsButton;
