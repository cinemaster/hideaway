export const fetchObjectAPI = () => {
  const mockData = { key: 'This is a mock' };
  const mockResponse = new Response(JSON.stringify(mockData), {
    status: 200,
  });
  return Promise.resolve(mockResponse);
};

export const fetchListAPI = () => {
  const mockData = ['mock', 1, 2, 3];
  const mockResponse = new Response(JSON.stringify(mockData), {
    status: 200,
  });
  return Promise.resolve(mockResponse);
};

export const fetchStringAPI = (mockData = 'mock') => {
  const mockResponse = new Response(JSON.stringify(mockData), {
    status: 200,
  });
  return Promise.resolve(mockResponse);
};

export const fetchIntAPI = () => {
  const mockData = 1978;
  const mockResponse = new Response(JSON.stringify(mockData), {
    status: 200,
  });
  return Promise.resolve(mockResponse);
};
