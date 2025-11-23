
import React, { useState } from 'react';

import MainContent from './Maincontent';
import AdminPageWrapper from '@/Components/Admin/AdminPageWrapper';


const ClothingStoreDashboard = () => {





  return (
    <div >
      <AdminPageWrapper>
        <div className="flex h-screen bg-gray-50">
        <MainContent/>
        </div>
    </AdminPageWrapper>

      </div>
  
  );
};

export default ClothingStoreDashboard;