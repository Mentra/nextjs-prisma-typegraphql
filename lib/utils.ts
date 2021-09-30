import getConfig from "next/config";
import { PublicRuntimeConfig } from "./types";

export const getPublicRuntimeConfig = (): PublicRuntimeConfig =>
  getConfig().publicRuntimeConfig as PublicRuntimeConfig;
