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
    const res = await Provider.client.session.customTask<{
      followPerson: { totalFollowers: number };
    }>("mutation", mutations.follow, {});
    return res.data ? res.data.followPerson : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully follow Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unfollow = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.customTask<{
      unfollowPerson: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {});
    return res.data ? res.data.unfollowPerson : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully unfollow Receiver: ${runnerOptions.receiver}`
    );
  }
};

const like = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.customTask<{
      like: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {});
    return res.data ? res.data.like : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully like Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unlike = async (runnerOptions: RunnerParameters) => {
  try {
    const res = await Provider.client.session.customTask<{
      unlike: { totalFollowers: number };
    }>("mutation", mutations.unfollow, {});
    return res.data ? res.data.unlike : null;
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully unlike Receiver: ${runnerOptions.receiver}`
    );
  }
};

export { follow, unfollow, like, unlike };
