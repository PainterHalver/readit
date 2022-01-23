import { IsEmail, Length } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  BeforeInsert,
  OneToMany,
  Index,
} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import Post from "./Post";

@TOEntity("users")
export default class User extends Entity {
  // 'Partial' so we do not have to put in all fields (typescript)
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user); // copies all enumerable own properties from one or more source objects to a target object.
  }

  // @Index()
  @Column({ unique: true })
  @IsEmail()
  public email: string;

  // @Index()
  @Column({ unique: true })
  @Length(3, 255, { message: "Username should be >=3 characters!" })
  public username: string;

  @Exclude()
  @Column()
  @Length(6, 255)
  password: string;

  // https://typeorm.io/#/many-to-one-one-to-many-relations (is this child referencing?)
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  // pre save hook
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
