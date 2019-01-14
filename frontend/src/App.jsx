import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from 'antd';
import Routes from './Routes';
import Header from './Header';

import LayoutCss from './Layout.scss';

const App = () => {
    return (
        <BrowserRouter>
            <React.StrictMode>
                <Layout className={LayoutCss.layout}>
                    <Header />
                    {Routes}
                </Layout>
            </React.StrictMode>
        </BrowserRouter>);
};

export default App;
