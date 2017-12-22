# test-redux-store
Use the full power of redux for testing!

This library is made to take up where redux-mock-store left off. You can execute actions that run reducers and see the raw action objects as well as the result state. It works nice with middleware like redux-thunk as well. Unlike redux-mock-store, you can incorporate reducers as well.

## Getting Started
```javascript
const testStore = TestStore(<reducer>, <enhancer>); // both optional
testStore.getActions(); // returns raw actions against the store
testStore.clearActions(); // clears action list
const store = testStore.initializeStore(<initialState>); // optional
```

## How to use
```javascript
const testStore = TestStore(<reducer>, <enhancer>); // both optional
const store = testStore.initializeStore(<initialState>); // optional
store.dispatch(action1);
store.dispatch(action2);
store.dispatch(action3);

testStore.getActions(); // will return [action1, action2, action3]
store.getState(); // will return result state
```

## Examples
```javascript
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import TestStore from 'test-redux-store';

describe('Test Documentation', () => {
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
  const addTodo = (text) => ({ type: 'ADD_TODO', text });
  const removeTodoRaw = (text) => ({ type: 'REMOVE_TODO', text })
  const removeTodo = (text) => {
    return (dispatch, getState) => {
      const todos = getState();
      if (todos.includes(text)) {
        return dispatch(removeTodoRaw(text));
      }
    }
  };

  // the setup, TestStore(reducer, enhancer). Here I'm using redux-thunk
  const testStore = TestStore(reducer, applyMiddleware(thunk));

  // util function
  const testActions = (actions, expectedActions) => {
    expect(actions.length).toEqual(expectedActions.length);
    actions.forEach((action, i) => expect(action).toEqual(expectedActions[i]));
  };

  it('Example 1', () => {
    /* In this example, I'm going to execute some actions raw actions, and
     * check the result state as well as make sure the actions were executed
     */

    const actions = [
      addTodo('hey'),
      addTodo('ho'),
      addTodo('let\'s go'),
      removeTodoRaw('ho'),
    ];
    const expectedActions = actions;

    // initialize store with empty state
    const store = testStore.initializeStore();

    actions.forEach(action => store.dispatch(action));

    // testStore.getActions() now contains the raw actions executed
    testActions(testStore.getActions(), expectedActions);

    // you can use store.getState to get the state after executing the actions
    expect(store.getState()).toEqual(['hey', 'let\'s go']);
  });

  it('Example 2', () => {
    /* In this example, I'm going to utilize removeTodo that should only get
     * executed if the state doesn't have that todo.
     */

    const actions = [
      addTodo('hey'),
      addTodo('ho'),
      addTodo('let\'s go'),
    ];
    const expectedActions = actions;

    // initialize store with empty state
    const store = testStore.initializeStore();

    actions.forEach(action => store.dispatch(action));

    testActions(testStore.getActions(), expectedActions);
    expect(store.getState()).toEqual(['hey', 'ho', 'let\'s go']);

    // clear the actions, so we can focus on removeTodo
    testStore.clearActions();

    // now remove one that doesn't exist
    store.dispatch(removeTodo('test'));
    testActions(testStore.getActions(), []);
    expect(store.getState()).toEqual(['hey', 'ho', 'let\'s go']);

    // now remove one that exists
    store.dispatch(removeTodo('let\'s go'));
    testActions(testStore.getActions(), [
      removeTodoRaw('let\'s go'),
    ]);
    expect(store.getState()).toEqual(['hey', 'ho']);
  });

  it('Example 3', () => {
    /* In this example, I'm going show how to use intializeStore to setup
     * the state instead of executing a bunch of actions.
     */

    // takes initial state
    const store = testStore.initializeStore(['hey', 'ho', 'let\'s go']);

    // check the state after each removeTodo
    store.dispatch(removeTodo('let\'s go'));
    expect(store.getState()).toEqual(['hey', 'ho']);

    store.dispatch(removeTodo('test'));
    expect(store.getState()).toEqual(['hey', 'ho']);

    store.dispatch(removeTodo('hey'));
    expect(store.getState()).toEqual(['ho']);

    // verify that only the actions that are needed get executed.
    testActions(testStore.getActions(), [
      removeTodoRaw('let\'s go'),
      removeTodoRaw('hey'),
    ]);
  });
});
```

## Authors
* **Ryan Ragle** - *Initial work* - (https://github.com/rragle)
* **Inaki Abete** - *Reviewer* - (https://github.com/inakiabt)
