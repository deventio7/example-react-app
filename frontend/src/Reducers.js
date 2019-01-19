import { combineReducers } from 'redux';
import DriverReducers from './Drivers/Reducers';
import DriverUpdateReducers from './Drivers/PositionUpdater/Reducers';

const WidgetReducers = {
    ...DriverReducers,
    ...DriverUpdateReducers
};

const Reducers = combineReducers({ ...WidgetReducers });


export {
    Reducers as default,
    WidgetReducers
};
