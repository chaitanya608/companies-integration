function isSuccessResponse(status: number): boolean {
    return status >= 200 && status < 300;
  }
  
  export default isSuccessResponse;
  