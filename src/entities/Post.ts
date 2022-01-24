import {
  Entity as TOEntity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../utils/helpers";

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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  sub: any; // mongo fix

  @BeforeInsert()
  async beforInsert() {
    // MONGO FIX
    this.subName = this.sub.name; // Populate for mongodb because the upper doesn't work
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }

  getSubWithoutId() {
    const subClone = JSON.parse(JSON.stringify(this.sub));
    delete subClone["_id"];
    return subClone;
  }
}
