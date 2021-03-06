import {
    LOAD_BOTTLES,
    BOTTLES_LOADED,
    ADD_BOTTLE,
    BOTTLE_ADDED,
    BOTTLE_SELECTED
} from './BottleActionTypes';

export const loadBottles = () => {
    return {
        type: LOAD_BOTTLES
    };
};

export const bottlesLoaded = (error, bottles) => {
    const isError = !!error;

    const payload = isError ? error : bottles;

    return {
        type: BOTTLES_LOADED,
        payload,
        error: isError
    };
};

export const addBottle = (bottle, event) => {
    return {
        type: ADD_BOTTLE,
        payload: { bottle, event }
    };
};

export const bottleAdded = (error, bottle) => {
    const isError = !!error;

    const payload = isError ? error : bottle;

    return {
        type: BOTTLE_ADDED,
        payload,
        error: isError
    };
};

export const bottleSelected = bottleId => {
    return {
        type: BOTTLE_SELECTED,
        payload: bottleId
    };
};