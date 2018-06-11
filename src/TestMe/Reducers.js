// @flow

import ActionTypes from './ActionTypes';

type State = {
    isFulFilled: boolean,
    isPending: boolean,
    isRejected: boolean,
    data: {
        data: {
            userId: number,
            id: number,
            title: string,
            body: string
        }
    }
};

type Action = {
    type: string,
    payload: Object
};

const initialState = {
    isFulFilled: false,
    isPending: false,
    isRejected: false,
    data: {
        data: {
            userId: 0,
            id: 0,
            title: '',
            body: ''
        }
    }
};

const testData = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case ActionTypes.GET_TEST_DATA_PENDING:
            return {
                ...state,
                isFulFilled: false,
                isPending: true,
                isRejected: false
            };
        case ActionTypes.GET_TEST_DATA_REJECTED:
            return {
                ...state,
                isFulFilled: false,
                isPending: false,
                isRejected: true,
                data: action.payload
            };
        case ActionTypes.GET_TEST_DATA_FULFILLED:
            return {
                ...state,
                isFulFilled: true,
                isPending: false,
                isRejected: false,
                data: action.payload
            };
        default:
            return state;
    }
};

const Reducers = {
    testData
};

export default Reducers;
