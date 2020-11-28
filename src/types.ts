export type User = {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type Account = {
  email: string;
  password: string;
};

export type ListResponse<Data> = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Data[];
  support?: {
    url: string;
    text: string;
  };
};

export type SingleResponse<Data> = {
  data: Data;
  support?: {
    url: string;
    text: string;
  };
};

export type CreationResponse<Data> = Data & {
  id: string;
  createdAt: string;
};

export type UpdateResponse<Data> = Omit<Data, 'id'> & {
  updatedAt: string;
};

export type NotFoundResponse = {};

export type BasicSearch = {
  delay?: number;
};

export type PaginationSearch = { page?: number; per_page?: number };

export type BasicParams<Name extends string> = {
  entity: Name;
};

export type ApiSlice<Name extends string, Entity> = {
  GetList: {
    Body: {};
    Response: ListResponse<Partial<Entity>>;
    Params: BasicParams<Name>;
    Search: BasicSearch & PaginationSearch;
  };
  GetSingle: {
    Body: {};
    Response: SingleResponse<Partial<Entity>>;
    Params: BasicParams<Name> & { id: number };
    Search: BasicSearch;
  };
  Post: {
    Body: Omit<Partial<User>, 'id'>;
    Response: CreationResponse<Partial<User>>;
    Params: BasicParams<Name>;
    Search: BasicSearch;
  };
  Put: {
    Body: Omit<Partial<User>, 'id'>;
    Response: UpdateResponse<Partial<User>>;
    Params: BasicParams<Name> & { id: number };
    Search: BasicSearch;
  };
  Patch: ApiSlice<Name, Entity>['Put'];
  Delete: {
    Body: {};
    Response: '';
    Params: BasicParams<Name> & { id: number };
    Search: BasicSearch;
  };
};

export type RegisterUserResponse = { id: number; token: string };
export type RegisterUserSearch = BasicSearch;
export type RegisterUserBody = Account;
export type RegisterUserError = { error: string };

export type LoginUserResponse = { token: string };
export type LoginUserSearch = BasicSearch;
export type LoginUserBody = Account;
export type LoginUserError = { error: string };
