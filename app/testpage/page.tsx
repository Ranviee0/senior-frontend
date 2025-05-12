"use client"
import React from 'react';
import MapMarker from '@/components/created/map-marker';

const TestPage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Test Page</h1>
            <p>This is a simple React component for the test page.</p>
            <MapMarker/>
        </div>
    );
};

export default TestPage;