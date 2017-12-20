import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import TestStore from './';

const testActions = (actions, expectedActions) => {
  expect(actions.length).toEqual(expectedActions.length);
  actions.forEach((action, i) => expect(action).toMatchObject(expectedActions[i]));
};

describe('TestStore', () => {
  it('it logs actions', () => {
    const testStore = TestStore();
    const actions = [
      { type: 'action1' },
      { type: 'action2' },
      { type: 'action3' },
    ];
    const expectedActions = actions;

    const store = testStore.initializeStore()
    actions.forEach(action => store.dispatch(action));
    testActions(testStore.getActions(), expectedActions);
  });

  it('it logs actions with empty initial state', () => {
    const testStore = TestStore();
    const actions = [
      { type: 'action1' },
      { type: 'action2' },
      { type: 'action3' },
    ];
    const expectedActions = actions;

    const store = testStore.initializeStore()
    actions.forEach(action => store.dispatch(action));
    testActions(testStore.getActions(), expectedActions);
  });

  it('it logs actions with initial state', () => {
    const testStore = TestStore();
    const actions = [
      { type: 'action1' },
      { type: 'action2' },
      { type: 'action3' },
    ];
    const expectedActions = actions;

    const store = testStore.initializeStore({ test: 'bleh' })
    actions.forEach(action => store.dispatch(action));
    testActions(testStore.getActions(), expectedActions);
  });

  it('it logs actions with reducer', () => {
    const reducer = (state = [], action) => {
      switch (action.type) {
        case 'ADD_TODO':
          return [
            ...state,
            action.text
          ];
        case 'REMOVE_TODO':
          return state.filter(todo => todo !== action.text);
        default:
          return state;
      }
    };

    const testStore = TestStore(reducer);
    const actions = [
      { type: 'ADD_TODO', text: 'hey' },
      { type: 'ADD_TODO', text: 'ho' },
      { type: 'REMOVE_TODO', text: 'hey' },
    ];
    const expectedActions = actions;

    const store = testStore.initializeStore();
    actions.forEach(action => store.dispatch(action));
    testActions(testStore.getActions(), expectedActions);
    expect(store.getState()).toEqual(['ho']);
  });

  it('it logs actions with reducer and enhancer', () => {
    const reducer = (state = [], action) => {
      switch (action.type) {
        case 'ADD_TODO':
          return [
            ...state,
            action.text
          ];
        case 'REMOVE_TODO':
          return state.filter(todo => todo !== action.text);
        default:
          return state;
      }
    };

    const testStore = TestStore(reducer, applyMiddleware(thunk));
    const actions = [
      { type: 'ADD_TODO', text: 'hey' },
      { type: 'ADD_TODO', text: 'ho' },
      { type: 'REMOVE_TODO', text: 'hey' },
    ];
    const expectedActions = actions;

    const store = testStore.initializeStore();
    store.dispatch(actions[0]);
    store.dispatch(actions[1]);
    store.dispatch(dispatch => dispatch(actions[2]));
    testActions(testStore.getActions(), expectedActions);
    expect(store.getState()).toEqual(['ho']);
  });

  it('it logs actions with initial state, reducer and enhancer', () => {
    const reducer = (state = [], action) => {
      switch (action.type) {
        case 'ADD_TODO':
          return [
            ...state,
            action.text
          ];
        case 'REMOVE_TODO':
          return state.filter(todo => todo !== action.text);
        default:
          return state;
      }
    };

    const testStore = TestStore(reducer, applyMiddleware(thunk));
    const actions = [
      { type: 'REMOVE_TODO', text: 'hey' },
      { type: 'ADD_TODO', text: 'hey' },
    ];
    const expectedActions = actions;

    const store = testStore.initializeStore(['hey', 'ho', 'let\'s go']);
    store.dispatch(dispatch => dispatch(actions[0]));
    store.dispatch(actions[1]);
    testActions(testStore.getActions(), expectedActions);
    expect(store.getState()).toEqual(['ho', 'let\'s go', 'hey']);
  });
});
