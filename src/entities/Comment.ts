import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  SimpleConsoleLogger,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import Post from "./Post";
import { makeId } from "../utils/helpers";
import Vote from "./Vote";

@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  // @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Column()
  votes: Vote[];
  async populateVotes() {
    this.votes = await Vote.find({
      where: { "comment.identifier": this.identifier },
    });
  }

  protected userVote: number;
  async setUserVote(user: User) {
    await this.populateVotes();
    const index = this.votes?.findIndex((v) => v.username == user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  async beforInsert() {
    this.identifier = makeId(8);
  }
}
