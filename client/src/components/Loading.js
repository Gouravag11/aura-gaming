import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = ({ loading }) => {
    return (
        <div className="loading-container">
            <ClipLoader color="#007bff" loading={loading} size={50} />
        </div>
    );
};

export default Loading;
