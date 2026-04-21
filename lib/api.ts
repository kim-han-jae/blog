export function successResponse<T>(data: T) {
  return Response.json({
    success: true,
    data,
  });
}

export function errorResponse(message: string, status = 400) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status },
  );
}
