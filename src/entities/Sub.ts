import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import Post from "./Post";
import { Exclude, Expose } from "class-transformer";

@TOEntity("subs")
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  // @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string | undefined; // Urn: Unique resource name

  @Column({ nullable: true })
  bannerUrn: string | undefined;

  @Exclude()
  @Column("user")
  user: User;

  @Expose() get username(): string {
    return this.user.username;
  }

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];
}
