import ActionTypes from './ActionTypes';

const initialState = {
    isFulfilled: false,
    isPending: false,
    isRejected: false
};

const putStatus = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.PUT_DRIVER_DATA_PENDING:
            return {
                ...state,
                isFulfilled: false,
                isPending: true,
                isRejected: false
            };
        case ActionTypes.PUT_DRIVER_DATA_REJECTED:
            return {
                ...state,
                isFulFilled: false,
                isPending: false,
                isRejected: true
            };
        case ActionTypes.PUT_DRIVER_DATA_FULFILLED:
            return {
                ...state,
                isFulFilled: true,
                isPending: false,
                isRejected: false
            };
        default:
            return state;
    }
};

const Reducers = {
    putStatus
};

export default Reducers;
