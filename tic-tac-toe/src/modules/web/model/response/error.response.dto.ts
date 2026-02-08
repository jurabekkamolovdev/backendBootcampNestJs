/**
 * Error Response DTO
 * Xato yuz berganda qaytadigan javob
 */
export class ErrorResponseDto {
  /**
   * HTTP status kodi
   */
  statusCode: number;

  /**
   * Xato xabari
   */
  message: string;

  /**
   * Xato turi
   */
  error: string;

  /**
   * Vaqt belgisi
   */
  timestamp: string;

  /**
   * So'rov yo'li
   */
  path: string;

  constructor(
    statusCode: number,
    message: string,
    error: string,
    path: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}
