// Admin.js
import React, { useState } from 'react';
import Users from './Users';
import AdminJobs from './AdminJobs';
import Applications from './Applications';
import Sidebar from './Sidebar';

function Admin() {
  const [selectedTab, setSelectedTab] = useState('user');

  const renderContent = () => {
    switch (selectedTab) {
      case 'user':
        return <Users />;
      case 'jobs':
        return <AdminJobs />;
      case 'applications':
        return <Applications />;
      default:
        return null;
    }
  };

  return (
    <div className="Admin">
      <Sidebar setSelectedTab={setSelectedTab} />
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default Admin;
