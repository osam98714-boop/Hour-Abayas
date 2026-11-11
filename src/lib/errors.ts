export function errorText(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "حدث خطأ غير متوقع";
}
