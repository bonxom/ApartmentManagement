export class AppError extends Error {
  constructor(errorCode, params = {}) {
    super(AppError.formatMessage(errorCode.message, params));
    this.code = errorCode.code;
    this.statusCode = errorCode.statusCode;
    this.errorCode = errorCode;
  }

  // placeHolder replacement
  // e.g., "Username must be at least {min} characters" with { min: 3 }
  // becomes "Username must be at least 3 characters"
  static formatMessage(template, params) {
    return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
  }
}
