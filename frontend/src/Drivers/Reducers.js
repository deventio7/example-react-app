import ActionTypes from './ActionTypes';

const initialState = {
    isFulfilled: false,
    pendingNumber: 0,
    isRejected: false,
    isInitialized: false,
    data: {
        stops: [],
        legs: [],
        driver: {}
    }
};

const driverData = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LEG_DATA_PENDING:
        case ActionTypes.GET_STOP_DATA_PENDING:
        case ActionTypes.GET_DRIVER_DATA_PENDING:
            return {
                ...state,
                isFulfilled: false,
                pendingNumber: state.pendingNumber + 1,
                isRejected: false
            };
        case ActionTypes.GET_LEG_DATA_REJECTED:
        case ActionTypes.GET_STOP_DATA_REJECTED:
        case ActionTypes.GET_DRIVER_DATA_REJECTED:
            return {
                ...state,
                pendingNumber: 0,
                isRejected: true
            };
        case ActionTypes.GET_LEG_DATA_FULFILLED:
            return state.isRejected ? state : {
                ...state,
                isFulfilled: state.pendingNumber === 1,
                pendingNumber: state.pendingNumber - 1,
                isInitialized: state.isInitialized ? true : state.pendingNumber === 1,
                data: {
                    ...state.data,
                    legs: action.payload.data
                }
            };
        case ActionTypes.GET_STOP_DATA_FULFILLED:
            return state.isRejected ? state : {
                ...state,
                isFulfilled: state.pendingNumber === 1,
                pendingNumber: state.pendingNumber - 1,
                isInitialized: state.isInitialized ? true : state.pendingNumber === 1,
                data: {
                    ...state.data,
                    stops: action.payload.data
                }
            };
        case ActionTypes.GET_DRIVER_DATA_FULFILLED:
            return state.isRejected ? state : {
                ...state,
                isFulfilled: state.pendingNumber === 1,
                pendingNumber: state.pendingNumber - 1,
                isInitialized: state.isInitialized ? true : state.pendingNumber === 1,
                data: {
                    ...state.data,
                    driver: action.payload.data
                }
            };
        default:
            return state;
    }
};

const Reducers = {
    driverData
};

export default Reducers;
