export interface EpicUser {
  name: string;

  accessToken: string;
  refreshToken: string;

  accessTokenExpires: Date;
  refreshTokenExpires: Date;
}
