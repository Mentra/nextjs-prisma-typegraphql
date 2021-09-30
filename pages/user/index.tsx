import type { GetServerSideProps } from "next";
import { ssrUserPage } from "lib/ssr_user_page";

export const getServerSideProps: GetServerSideProps = ssrUserPage;

// When exporting a React component using this syntax, Superjson does not kick in
// Replace the below export with the commented-out line, then comment out the "export {default}" line,
// and it will work.

// import User from "./user";
// export default User;

export { default } from "./user";
