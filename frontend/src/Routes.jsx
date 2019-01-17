import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from './Welcome';
import Drivers from './Drivers';
import PageNotFound from './PageNotFound';

const Routes = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/drivers" component={Drivers} />
                <Route component={PageNotFound} />
            </Switch>
        </div>
    );
};

export default Routes;
