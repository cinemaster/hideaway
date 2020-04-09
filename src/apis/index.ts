import { IApiOptions } from 'contracts/redux';

const sleep = (ms: number) => {
  return new Promise((resolve: Function) => setTimeout(resolve, ms));
};

export const fetchObjectAPI = async (text: string, options?: IApiOptions) => {
  const { error = false } = options || {};
  const mockData = { key: text, fromApiMock: true };
  const mockResponse = new Response(JSON.stringify(mockData), {
    status: 200,
  });
  await sleep(500);
  if (error) {
    return Promise.reject(text);
  }
  return Promise.resolve(mockResponse);
};
