import { combineReducers } from 'redux';
import DriverReducers from './Drivers/Reducers';

const WidgetReducers = {
    ...DriverReducers
};

const Reducers = combineReducers({ ...WidgetReducers });


export {
    Reducers as default,
    WidgetReducers
};
