import axios from 'axios';
import ActionTypes from './ActionTypes';

const baseUrl = 'http://localhost:3000';

const getData = () => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.GET_STOP_DATA,
            payload: axios.get(`${baseUrl}/stops`)
        });
        dispatch({
            type: ActionTypes.GET_LEG_DATA,
            payload: axios.get(`${baseUrl}/legs`)
        });
        dispatch({
            type: ActionTypes.GET_DRIVER_DATA,
            payload: axios.get(`${baseUrl}/driver`)
        });
    };
};

const Actions = {
    getData
};

export default Actions;
