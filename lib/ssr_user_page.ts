import { addApolloState, initializeApollo } from "lib/with_apollo";
import getCurrentUserFromNextContext from "lib/get_user_from_next_context";
import type { GetServerSideProps } from "next";

export const ssrUserPage: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo({ context });
  const { currentUser } = await getCurrentUserFromNextContext({ context });
  if (!currentUser) {
    return {
      notFound: true
    };
  }
  return addApolloState(apolloClient, {
    props: {
      currentUser
    }
  });
};
