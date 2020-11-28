export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type Resource = {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
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

export type UpdateResponse<Data> = Data & {
  id: string;
  updatedAt: string;
};

export type NotFoundResponse = {};

export type BasicParams = {
  delay?: number;
};

export type GetUsersResponse = ListResponse<User>;
export type GetUsersParams = BasicParams & { page?: number };

export type GetUserResponse = SingleResponse<User>;
export type GetUserParams = BasicParams & { id: number };

export type GetResourcesResponse = ListResponse<Resource>;
export type GetResourcesParams = BasicParams & { page?: number };

export type GetResourceResponse = SingleResponse<Resource>;
export type GetResourceParams = BasicParams & { id: number };

export type PostUserResponse<D extends PostUserBody> = CreationResponse<D>;
export type PostUserParams = BasicParams;
export type PostUserBody = Omit<Partial<User>, 'id'>;

export type PutUserResponse<D extends PutUserBody> = UpdateResponse<D>;
export type PutUserParams = BasicParams & { id: number };
export type PutUserBody = Omit<Partial<User>, 'id'>;

export type PatchUserResponse<D extends PatchUserBody> = UpdateResponse<D>;
export type PatchUserParams = BasicParams & { id: number };
export type PatchUserBody = Omit<Partial<User>, 'id'>;

export type RegisterUserResponse = { id: number; token: string };
export type RegisterUserParams = BasicParams;
export type RegisterUserBody = { email: string; password: string };
export type RegisterUserError = { error: string };

export type LoginUserResponse = { token: string };
export type LoginUserParams = BasicParams;
export type LoginUserBody = { email: string; password: string };
export type LoginUserError = { error: string };
