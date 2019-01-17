// @flow strict
import React from 'react';

import WelcomeCss from './Welcome.scss';

const Welcome = () => {
    return (
        <div>
            <h1 className={WelcomeCss.title}>
                Landing Page Content
            </h1>
        </div>);
};

export default Welcome;
