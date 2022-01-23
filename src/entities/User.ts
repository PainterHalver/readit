import { IsEmail, Length } from "class-validator";
import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude, instanceToPlain } from "class-transformer";

@Entity("users")
export class User extends BaseEntity {
  // 'Partial' so we do not have to put in all fields
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user); // copies all enumerable own properties from one or more source objects to a target object.
  }

  @Exclude()
  @ObjectIdColumn()
  public _id: ObjectID;

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

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // pre save hook
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
