import axios from 'axios';

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data;
    if (typeof apiError === 'string' && (apiError as string).length > 0) {
      return apiError;
    }
    return apiError?.message || apiError?.error || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Generic error message';
};

export default handleError;
