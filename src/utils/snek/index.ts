// main registration

// login -> handled via snek client
// logout -> handled via snek client

// get merged profile
// -> get cached calendar svg

// GitHub generation
// GitLab generation

// profile registration (GitHub, GitLab, (ops))
// profile deletion
// update profiles -> github, gitlab generation

// update settings

// soundcloud fetch

// instagram fetch

// imagur ?? own utils?

// update person page for settings/upload

//#region > Imports
//> All social related actions (like, follow,..)
import * as achievement from "./achievement";
import * as social from "./social";
import * as person from "./person";
import * as talk from "./talk";
//> Clients
// Contains the clients for API calls to SNEK, Github and GitLab
import { SnekClient } from "snek-client";
//#endregion

//#region > Classes
class Provider {
  public static client = new SnekClient("https://engine.snek.at/graphql");
  public static achievements = achievements;
  public static achievements: typeof achievement = require("./achievements");
  // achievements.all()
  public static social: typeof social = require("./social");
  // social.follow()
  // social.unfollow()
  // social.like()
  // social.unlike()
  // social.getAchievements()
  public static person: typeof person = require("./person");
  // person.get() -> person page + merged profile
  // person.profiles() -> get all profiles for the person page
  // person.addGitHubProfile()
  // person.addGitLabProfile()
  // person.addInstagramProfile()
  // person.deleteProfile()
  // person.updateProfile()
  // person.updateSettings()
  // person.addMetaLink()
  public static talk: typeof talk = require("./talk");
  // talk.all()
  // talk.get()
  // talk.add()
  // talk.delete()
  // talk.addComment()
  // talk.deleteComment()
}
//#endregion

//#region > Exports
export { Provider as default };
//#endregion
