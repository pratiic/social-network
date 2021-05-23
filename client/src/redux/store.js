import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import ReduxThunk from "redux-thunk";

import rootReducer from "./root-reducer";

export const store = createStore(
	rootReducer,
	applyMiddleware(logger, ReduxThunk)
);
