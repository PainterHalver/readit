import {
  Entity as TOEntity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../utils/helpers";
import Comment from "./Comment";
import { Expose } from "class-transformer";

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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column()
  sub: any; // mongo fix

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

  getSubWithoutId() {
    const subClone = JSON.parse(JSON.stringify(this.sub));
    delete subClone["_id"];
    return subClone;
  }

  excludeSub() {
    const thisClone = JSON.parse(JSON.stringify(this));
    delete thisClone["sub"];
    return thisClone;
  }
}
