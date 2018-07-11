import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";
import createSagaMiddleware from "redux-saga";

import {reducer} from "./reducers";
import {rootSaga} from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware));

sagaMiddleware.run(rootSaga);

const render = () => {
  const App = require("./app").default;
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <App />
      </AppContainer>
    </Provider>,
    document.getElementById("App")
  );
};

render();
if (module.hot) {
  module.hot.accept(render);
}
