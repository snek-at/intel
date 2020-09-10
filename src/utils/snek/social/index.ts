import Provider from "../index";
import * as mutations from "./mutations/data";

interface RunnerParameters {
  /** A person page which starts the operation */
  invoker: string;
  /** A person page which which the operation aims to */
  receiver: string;
}

const follow = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.runner<{
      followPerson: { totalFollowers: number };
    }>("mutation", mutations.follow, {
      person: runnerOptions.invoker,
      personToFollow: runnerOptions.receiver,
    });
    return res.data ? res.data.followPerson : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully follow Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unfollow = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.runner<{
      unfollowPerson: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {
      person: runnerOptions.invoker,
      personToUnfollow: runnerOptions.receiver,
    });
    return res.data ? res.data.unfollowPerson : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully unfollow Receiver: ${runnerOptions.receiver}`
    );
  }
};

const like = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.runner<{
      like: { totalLikes: number };
    }>("mutation", mutations.like, {
      person: runnerOptions.invoker,
      personToLike: runnerOptions.receiver,
    });
    return res.data ? res.data.like : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully like Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unlike = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.runner<{
      unlike: { totalLikes: number };
    }>("mutation", mutations.unlike, {
      person: runnerOptions.invoker,
      personToUnlike: runnerOptions.receiver,
    });
    return res.data ? res.data.unlike : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully unlike Receiver: ${runnerOptions.receiver}`
    );
  }
};

export { follow, unfollow, like, unlike };
