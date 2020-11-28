import faker from 'faker';
import { genericAdapter, accountAdapter, State } from './adapters';

const avatar = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' stroke='black' stroke-width='3' fill='red' /%3E%3C/svg%3E`;

export function mockInitialData({
  seed = 1,
  users = 50,
}: {
  seed?: number;
  users?: number;
} = {}): State {
  faker.seed(seed);
  const state: State = {
    users: genericAdapter.getInitialState(),
    accounts: accountAdapter.getInitialState(),
  };

  for (let id = 0; id < users; id++) {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    state.users = genericAdapter.addOne(state.users, {
      id,
      first_name,
      last_name,
      email: `${first_name}.${last_name}@example.com`,
      avatar,
    });
  }

  state.accounts = accountAdapter.addOne(state.accounts, {
    email: 'root',
    password: 'toor',
  });

  return state;
}
