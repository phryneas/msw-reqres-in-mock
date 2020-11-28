import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Account, User } from './types';

export interface State {
  users: EntityState<Partial<User>>;
  accounts: EntityState<Account>;
  [K: string]: EntityState<any>;
}

export const genericAdapter = createEntityAdapter<any>();
export const genericSelectors = genericAdapter.getSelectors();

export const accountAdapter = createEntityAdapter<Account>({
  selectId: a => a.email,
});
export const accountSelectors = accountAdapter.getSelectors(
  (state: State) => state.accounts
);
