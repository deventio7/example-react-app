import axios from 'axios';
import ActionTypes from './ActionTypes';

const baseUrl = 'http://localhost:3000';

const putData = (data, callback) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.PUT_DRIVER_DATA,
            payload: axios.put(`${baseUrl}/driver`, data)
        }).then(callback);
    };
};

const Actions = {
    putData
};

export default Actions;
