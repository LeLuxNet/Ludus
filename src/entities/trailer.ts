import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Trailer {
  @Field()
  thumbnail: string;

  @Field()
  url: string;

  @Field()
  embed: boolean;

  constructor(thumbnail: string, url: string) {
    this.thumbnail = thumbnail;
    this.url = url;
    this.embed = url.startsWith("https://www.youtube.com/embed/");
  }
}

export function youTubeTrailer(id: string) {
  return {
    trailerThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    trailer: `https://www.youtube.com/embed/${id}`,
  };
}
