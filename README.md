# Hideaway Middleware

This middleware helps to reduce the code when you use the stages (Request, Response, Error).

## Settings

### Store

include on applyMiddleare. e.g.:

```
const middleware = [hideaway(), thunk] as Middleware<
  {},
  INextReduxMiddlewareState
>[];

createStore(reducers, [preloadedState], applyMiddleware(...middleware))
```
