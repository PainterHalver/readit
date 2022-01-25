import {
  Entity as TOEntity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../utils/helpers";
import Comment from "./Comment";
import { Expose } from "class-transformer";
import Vote from "./Vote";
import Sub from "./Sub";

@TOEntity("posts")
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  // @Index()
  @Column()
  identifier: string; // 7 Character Id

  @Column()
  title: string;

  // @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string; // subreddit

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  // @OneToMany(() => Comment, (comment) => comment.post)
  // comments: Comment[];
  @Column()
  comments: Comment[];
  async populateComments() {
    this.comments = await Comment.find({
      where: { "post.identifier": this.identifier },
    });
  }

  // @OneToMany(() => Vote, (vote) => vote.post)
  // votes: Vote[];
  @Column()
  votes: Vote[];
  async populateVotes() {
    this.votes = await Vote.find({
      where: { "post.identifier": this.identifier },
    });
  }

  @Column()
  sub: any; // mongo fix
  async populateSub() {
    this.sub = await Sub.findOneOrFail({
      where: {
        name: this.subName,
      },
    });
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote: number;
  async setUserVote(user: User) {
    // await user.populateVotes();
    await this.populateVotes();
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  async beforInsert() {
    // MONGO FIX
    this.username = this.user.username;
    this.subName = this.sub.name; // Populate for mongodb because the upper doesn't work
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }

  // 2 solutions for including url when querying
  // protected url: string; // virtual field
  // @AfterLoad()
  // createFields() {
  //   this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  // }

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  excludeSub() {
    const thisClone = JSON.parse(JSON.stringify(this));
    delete thisClone["sub"];
    return thisClone;
  }
}
