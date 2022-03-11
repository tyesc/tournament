class CustomError extends Error {
  name: string;
  status: number;
  message: string;

  constructor (
    name: string,
    status: number,
    message: string,
  ) {
    super(`[${status} ${name || 'Error'}] error -> ${message || 'unknown'}`);
    this.name = name;
    this.status = status;
    this.message = message;
  }

}

export const BadRequest = (name = 'bad_request') =>
  new CustomError('BadRequest', 400, name);

export const Unauthorized = (name = 'unauthorized') =>
  new CustomError('Unauthorized', 401, name);

export const Forbidden = (name = 'forbidden') =>
  new CustomError('Forbidden', 403, name);

export const NotFound = (name = 'not_found') =>
  new CustomError('NotFound', 404, name);

export const ServerError = (name = 'server_error') =>
  new CustomError('ServerError', 500, name);

export const catchError = cb =>
  async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (e) {
      next(e);
    }
  }
;
