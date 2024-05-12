export interface UpdateInfoRequest {
  name: string;
}

export interface UpdateAllInfoRequest extends UpdateInfoRequest {
  name: string;
  age: number;
  married?: boolean | null;
  birthdate: string;
}
