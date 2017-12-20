import { createStore as ReduxCreateStore, applyMiddleware, compose } from 'redux';

const TestStore = (reducer = (state, action) => state, enhancer) => {
  let actions = [];
  const clearActions = () => {
    actions = [];
  };

  const middleware = store => next => (action) => {
    actions.push(action);
    return next(action);
  };

  const initializeStore = (initialState) => {
    clearActions();
    return ReduxCreateStore(
      reducer,
      initialState,
      enhancer ? compose(enhancer, applyMiddleware(middleware)) : applyMiddleware(middleware),
    );
  };

  return {
    clearActions,
    getActions: () => actions,
    initializeStore,
  };
};

export default TestStore;
