import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";

import {reducer} from "./reducers";

const store = createStore(reducer, applyMiddleware(thunk));

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
