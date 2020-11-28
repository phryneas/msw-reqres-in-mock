import { MockedRequest, ResponseResolver, rest } from 'msw';
import {
  genericSelectors,
  State,
  accountSelectors,
  accountAdapter,
  genericAdapter,
} from './adapters';
import {
  ApiSlice,
  RegisterUserBody,
  RegisterUserResponse,
  RegisterUserError,
  LoginUserBody,
  LoginUserResponse,
} from './types';
import faker from 'faker';

function delay(req: MockedRequest) {
  return new Promise(resolve =>
    setTimeout(resolve, Number(req.url.searchParams.get('delay')) ?? 0)
  );
}

type AnyApiSlice = ApiSlice<string, any>;

export function getHandlers({
  baseUrl = 'https://reqres.in/api',
  initialState,
  requireAuth,
}: {
  baseUrl?: string;
  initialState: State;
  requireAuth?: boolean;
}) {
  const unauthorizedResponse: ResponseResolver = (req, res, ctx) => {
    if (!requireAuth) return;
    if (req.headers.get('authentication') !== 'Bearer loggedIn') {
      return res(
        ctx.status(403),
        (ctx as any).json({ error: 'not logged in' })
      );
    }
    return;
  };

  const state = { ...initialState };
  return [
    rest.post<RegisterUserBody, RegisterUserResponse>(
      `${baseUrl}/register`,
      async (req, res, ctx) => {
        await delay(req);
        const account = accountSelectors.selectById(state, req.body.email);
        if (account) {
          return res(
            ctx.status(409),
            ctx.json(({
              error: 'email address already in use',
            } as RegisterUserError) as any)
          );
        }
        const newAccount = { id: faker.random.number(), ...req.body };
        state.accounts = accountAdapter.addOne(state.accounts, newAccount);
        return res(ctx.json({ id: newAccount.id, token: 'loggedIn' }));
      }
    ),
    rest.post<LoginUserBody, LoginUserResponse>(
      `${baseUrl}/login`,
      async (req, res, ctx) => {
        await delay(req);
        const account = accountSelectors.selectById(state, req.body.email);
        if (account && account.password === req.body.password) {
          return res(ctx.json({ token: 'loggedIn' }));
        }
        return res(
          ctx.status(403),
          ctx.json(({
            error: 'account not found or wrong password',
          } as RegisterUserError) as any)
        );
      }
    ),
    rest.get<
      AnyApiSlice['GetSingle']['Body'],
      AnyApiSlice['GetSingle']['Response'],
      AnyApiSlice['GetSingle']['Params']
    >(`${baseUrl}/:entity/:id`, async (req, res, ctx) => {
      await delay(req);
      const data = genericSelectors.selectById(
        state[req.params.entity],
        req.params.id
      );
      if (data) {
        return res(ctx.json({ data }));
      } else {
        return res(ctx.status(404), ctx.json({} as any));
      }
    }),
    rest.get<
      AnyApiSlice['GetList']['Body'],
      AnyApiSlice['GetList']['Response'],
      AnyApiSlice['GetList']['Params']
    >(`${baseUrl}/:entity`, async (req, res, ctx) => {
      const page = Number(req.url.searchParams.get('page')) ?? 1;
      const per_page = Number(req.url.searchParams.get('per_page')) ?? 6;
      const all = genericSelectors.selectAll(state[req.params.entity]);
      return res(
        ctx.json({
          page,
          per_page,
          total: all.length,
          total_pages: Math.ceil(all.length / per_page),
          data: all.slice(page * per_page - 1, per_page),
        })
      );
    }),
    rest.post<
      AnyApiSlice['Post']['Body'],
      AnyApiSlice['Post']['Response'],
      AnyApiSlice['Post']['Params']
    >(`${baseUrl}/:entity`, async (req, res, ctx) => {
      await delay(req);
      const unauth = unauthorizedResponse(req, res, ctx);
      if (unauth) return unauth;

      const user: AnyApiSlice['Post']['Response'] = {
        ...req.body,
        id: String(faker.random.number()),
        createdAt: new Date().toUTCString(),
      };
      state[req.params.entity] = genericAdapter.addOne(
        state[req.params.entity],
        user
      );
      return res(ctx.json(user));
    }),
    rest.put<
      AnyApiSlice['Put']['Body'],
      AnyApiSlice['Put']['Response'],
      AnyApiSlice['Put']['Params']
    >(`${baseUrl}/:entity`, async (req, res, ctx) => {
      await delay(req);
      const unauth = unauthorizedResponse(req, res, ctx);
      if (unauth) return unauth;

      const user = genericSelectors.selectById(
        state[req.params.entity],
        req.params.id
      );
      if (!user) {
        return res(ctx.status(404), ctx.json({} as any));
      }
      const { id: _, ...data } = Object.assign(user, req.body, {
        updatedAt: new Date().toUTCString(),
      });
      return res(ctx.json(data));
    }),
    rest.patch<
      AnyApiSlice['Patch']['Body'],
      AnyApiSlice['Patch']['Response'],
      AnyApiSlice['Patch']['Params']
    >(`${baseUrl}/:entity`, async (req, res, ctx) => {
      await delay(req);
      const unauth = unauthorizedResponse(req, res, ctx);
      if (unauth) return unauth;

      const user = genericSelectors.selectById(
        state[req.params.entity],
        req.params.id
      );
      if (!user) {
        return res(ctx.status(404), ctx.json({} as any));
      }
      const { id: _, ...data } = Object.assign(user, req.body, {
        updatedAt: new Date().toUTCString(),
      });
      return res(ctx.json(data));
    }),
    rest.delete<
      AnyApiSlice['Delete']['Body'],
      AnyApiSlice['Delete']['Response'],
      AnyApiSlice['Delete']['Params']
    >(`${baseUrl}/:entity`, async (req, res, ctx) => {
      await delay(req);
      const unauth = unauthorizedResponse(req, res, ctx);
      if (unauth) return unauth;

      const user = genericSelectors.selectById(
        state[req.params.entity],
        req.params.id
      );
      if (!user) {
        return res(ctx.status(404), ctx.json({} as any));
      }
      state[req.params.entity] = genericAdapter.removeOne(
        state[req.params.entity],
        req.params.id
      );
      return res(ctx.status(204));
    }),
  ];
}
