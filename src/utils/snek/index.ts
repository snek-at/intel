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
import * as general from "./general";
import * as social from "./social";
import * as person from "./person";
import * as talk from "./talk";
//> Clients
// Contains the clients for API calls to SNEK, Github and GitLab
import { SnekClient } from "snek-client";
//#endregion

//#region > Classes
class Provider {
  // public static client = new SnekClient("https://engine.snek.at/graphql");
  public static client = new SnekClient("http://localhost:8000/graphql");
  public static achievement: typeof achievement = require("./achievement");
  // achievements.all()
  public static general: typeof general = require("./general");
  public static social: typeof social = require("./social");
  // social.follow()
  // social.unfollow()
  // social.like()
  // social.unlike()
  // social.getAchievements()
  public static person: typeof person = require("./person");
  // person.get() -> person page + merged profile
  // person.profiles() -> get all profiles for the person page
  // person.processProfiles()
  // person.addProfile()
  // person.deleteProfile()
  // person.updateProfile()
  // person.updateSettings()
  // person.addMetaLink()
  // person.getInstagramPosts()
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
