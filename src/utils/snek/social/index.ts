import Provider from "../index";
import * as mutations from "./mutations/data";

interface RunnerParameters {
  /** A person page which starts the operation */
  invoker: string;
  /** A person page which which the operation aims to */
  receiver: string;
}

const follow = (runnerOptions: RunnerParameters) => {
  try {
    return Provider.client.session
      .customTask<{
        followPerson: { totalFollowers: number };
      }>("mutation", mutations.follow, {})
      .then((res) => (res.data ? res.data.followPerson : null));
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully follow Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unfollow = (runnerOptions: RunnerParameters) => {
  try {
    return Provider.client.session
      .customTask<{
        unfollowPerson: { totalFollowers: number };
      }>("mutation", mutations.unfollow, {})
      .then((res) => (res.data ? res.data.unfollowPerson : null));
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully unfollow Receiver: ${runnerOptions.receiver}`
    );
  }
};

const like = (runnerOptions: RunnerParameters) => {
  try {
    return Provider.client.session
      .customTask<{
        like: { totalFollowers: number };
      }>("mutation", mutations.unfollow, {})
      .then((res) => (res.data ? res.data.like : null));
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully like Receiver: ${runnerOptions.receiver}`
    );
  }
};

const unlike = (runnerOptions: RunnerParameters) => {
  try {
    return Provider.client.session
      .customTask<{
        unlike: { totalFollowers: number };
      }>("mutation", mutations.unfollow, {})
      .then((res) => (res.data ? res.data.unlike : null));
  } catch {
    throw new Error(
      `Invoker: ${runnerOptions.invoker} couldn't successfully unlike Receiver: ${runnerOptions.receiver}`
    );
  }
};

export { follow, unfollow, like, unlike };
