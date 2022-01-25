import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  AfterLoad,
} from "typeorm";
import Comment from "./Comment";

import Entity from "./Entity";
import Post from "./Post";
import User from "./User";

@TOEntity("votes")
export default class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;
  //   value: 1 | -1 | 0;

  //   @ManyToOne(() => User)
  //   @JoinColumn({ name: "username", referencedColumnName: "username" })
  //   user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}
