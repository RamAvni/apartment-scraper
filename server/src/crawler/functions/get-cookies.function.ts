import { InternalServerErrorException } from "@nestjs/common";
import { Cookie } from "playwright";

export function getCookies() {
  const { FACEBOOK_XS, FACEBOOK_C_USER } = process.env;
  if (!FACEBOOK_XS || !FACEBOOK_C_USER)
    throw new InternalServerErrorException("Missing Login Info");

  const cookies: Omit<Cookie, "expires">[] = [
    {
      name: "xs",
      value: FACEBOOK_XS,
      domain: ".facebook.com",
      httpOnly: true,
      path: "/",
      sameSite: "None",
      secure: true,
    },
    {
      name: "c_user",
      value: FACEBOOK_C_USER,
      domain: ".facebook.com",
      httpOnly: false,
      path: "/",
      sameSite: "None",
      secure: true,
    },
  ];

  return cookies;
}
