import {
  ObjectIdColumn,
  ObjectID,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";

export default abstract class Entity extends BaseEntity {
  @Exclude()
  @ObjectIdColumn()
  public _id: ObjectID;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
