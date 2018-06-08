// @flow

import * as React from 'react';

type Props = {
  children: React.Node,
};
type State = {
    hasError: boolean
};
class ErrorBoundary extends React.Component<Props, State> {
    state = {
        hasError: false
    };

    componentDidCatch = (error: string, info: string) => {
        this.setState({hasError: true});
        // eslint-disable-next-line no-console
        console.log(`The error is ${String(error)} and the info is ${String(info)}`);
    }

    render = () => {
        if (this.state.hasError) {
            return <h1>Something went wrong please check the console for details</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
