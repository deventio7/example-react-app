import React from 'react';
import { BrowserRouter, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import Routes from './Routes';
import NavHeader from './NavHeader';
import InfoFooter from './InfoFooter';

const App = () => {
    const RoutedNavHeader = withRouter(NavHeader);
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Layout>
                        <RoutedNavHeader />
                        <Layout.Content>
                            <Routes />
                        </Layout.Content>
                        <InfoFooter />
                    </Layout>
                </div>
            </BrowserRouter>
        </div>);
};

export default App;
