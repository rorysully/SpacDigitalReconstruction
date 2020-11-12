import { combineReducers } from 'redux';

import app from './app';
import lang from './lang';

const appReducers = combineReducers({
  app,
  lang,
});

export default appReducers;
