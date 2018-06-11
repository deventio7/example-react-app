// @flow
import ActionTypes from './ActionTypes';
import Apis from './Apis';

const getData = () => {
    return (dispatch: any) => {
        dispatch({
            type: ActionTypes.GET_TEST_DATA,
            payload: Apis.getTestData
        });
    };
};

const Actions = {
    getData
};

export default Actions;
