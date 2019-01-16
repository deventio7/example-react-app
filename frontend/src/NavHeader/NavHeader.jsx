// @flow strict
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import NavHeaderCss from './NavHeader.scss';

const { Header } = Layout;

const NavHeader = ({ location }) => {
    return (
        <div>
            <Header className={NavHeaderCss.headerWrapper}>
                <Menu selectedKeys={[location.pathname]} mode="horizontal">
                    <Menu.Item key="/">
                        <Link to="/">
                            <Icon type="home" />
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/drivers">
                        <Link to="/drivers">Drivers</Link>
                    </Menu.Item>
                </Menu>
            </Header>
        </div>);
};

export default NavHeader;
