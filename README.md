Use the full power of redux for testing!

This library is made to take up where redux-mock-store left off. You can execute actions that run reducers and see the raw action objects as well as the result state. It works nice with middleware like redux-thunk as well.

```
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

  const executedActions = testStore.getActions();

  expect(executedActions[0]).toEqual(expectedActions[0]);
  expect(executedActions[1]).toEqual(expectedActions[1]);
  expect(store.getState()).toEqual(['ho', 'let\'s go', 'hey']);
});
```
