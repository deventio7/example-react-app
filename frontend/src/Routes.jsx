import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from './Welcome';
import TestMe from './TestMe';
import PageNotFound from './PageNotFound';

const Routes = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Welcome} />
                <Route exact path="/test" component={TestMe} />
                <Route exact path="/drivers" component={TestMe} />
                <Route component={PageNotFound} />
            </Switch>
        </div>
    );
};

export default Routes;
