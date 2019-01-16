import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import Routes from './Routes';
import NavHeader from './NavHeader';

const App = () => {
    const RoutedNavHeader = withRouter(NavHeader);
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Layout>
                        <RoutedNavHeader />
                        <Routes />
                    </Layout>
                </div>
            </BrowserRouter>
        </div>);
};

export default App;
