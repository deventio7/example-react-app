// @flow strict
import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

type Props = {
    username: string
};

const NavbarHeader = (props: Props) => {
    return (
        <div>
            <Header>
                aaaa
                {props.username}
            </Header>
        </div>);
};

export default NavbarHeader;
