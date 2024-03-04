import axios, { AxiosResponse } from "axios";
import { NextFunction, Request, Response } from "express";

const testFunction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/1`
  );

  return res.send(result.data);
};

export default testFunction;
