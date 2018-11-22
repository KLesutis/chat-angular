export class User {
  username: string;
  password: string;
  register_date?: Date;
  messages?: Array<string>;
  _id: string;
  online?: boolean;
}
