import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

//NOTE: here for testing purposes only
@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  fullName!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property({ type: "text" })
  bio = "";
}
