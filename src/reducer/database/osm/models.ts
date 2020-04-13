//#region > Imports

//> Reconstructor
// SOAssambler for SO objects
import { SOAssambler } from "./reconstructor";

//> Statements
// Contains SQL statements
import * as platform from "./statements/platform";
import * as member from "./statements/member";
import * as repository from "./statements/repository";
import * as repositoryHasMember from "./statements/repositoryHasMember";
import * as platformHasRepository from "./statements/platformHasRepository";
import * as language from "./statements/language";
import * as organization from "./statements/organization";
import * as organizationHasMember from "./statements/organizationHasMember";
import * as platformHasOrganization from "./statements/platformHasOrganization";
import * as statistic from "./statements/statistic";
import * as streak from "./statements/streak";
import * as calendar from "./statements/calendar";
import * as contribution from "./statements/contribution";

//> Helper
// Contains all helper
import * as helper from "../helper";

/**
 * Implementaion examples of the statement objects defined below.
 *
 * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/models.ts |SNEK Models} for implementation examples.
 */
//#endregion

//#region > Classes
/** @class A basic statement object class which provides access to the SOAssambler and squeezer. */
class BaseSO {
  
//> Static Methods
  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   *
   * @param self A implementation of a statement object.
   * @returns {SOAssambler} A SOAssambler object.
   * @description Enables access to the SOAssambler to provide functionality like create, all, filter,...
   */
  static getObjects(self: any) {
    return new SOAssambler(self);
  }

  /**
   * Render object.
   *
   * @param filter List of keys to filter by.
   * @returns {object} The filtered object.
   * @description Filter the object by a list of keys.
   */
  render(filter: string[]) {
    return helper.general.squeezer(this, filter);
  }
}

/** @class A statement object which implements the platform sql statements. */
class PlatformSO extends BaseSO {
  static statements = platform;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Static Methods
  /**
   * @static
   * @description Get the platform with the lowest createdAt.
   * @returns {object} A object containing platform data with the lowest creation date.
   */
  static getLowestCreatedAtYear() {
    return SOAssambler.database.exec(
      PlatformSO.statements.lowestCreatedAtYear
    )[0];
  }

  
//> Model Implementation Example
  // class PlatformModel extends PlatformSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(PlatformModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/platform.ts |Platform SQL statements} for further information.
  //    */
  //   constructor(fields: PlatformFields){
  //     super();
  //  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     PlatformModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return PlatformModel.objects.filter({id: 0}) as PlatformModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return PlatformModel.objects.all() as PlatformModel[];
  //   }
  // }
}

/** @class A statement object which implements the member sql statements. */
class MemberSO extends BaseSO {
  static statements = member;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example
  // class MemberModel extends MemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(MemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/member.ts |Member SQL statements} for further information.
  //    */
  //   constructor(fields: MemberFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     MemberModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return MemberModel.objects.filter({id: 0}) as MemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return MemberModel.objects.all() as MemberModel[];
  //   }
  // }
}

/** @class A statement object which implements the repository sql statements. */
class RepositorySO extends BaseSO {
  static statements = repository;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Methods
  /**
   * @param cls A extended class of RepositorySO.
   * @param self A object of the extended class.
   * @description Get languages of a repository.
   * @returns {object[]} A list of objects containing repository data.
   */
  getLanguages(cls: any, self: any) {
    let response = cls.objects.custom(language.byRepository(self.id));
    return response;
  }

  
//> Model Implementation Example
  // class RepositoryModel extends RepositorySO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(RepositoryModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/repository.ts |Repository SQL statements} for further information.
  //    */
  //   constructor(fields: RepositoryFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     RepositoryModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return RepositoryModel.objects.filter({id: 0}) as RepositoryModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return RepositoryModel.objects.all() as RepositoryModel[];
  //   }
  // }
}

/** @class A statement object which implements the platformHasMember sql statements. */
class RepositoryHasMemberSO extends BaseSO {
  static statements = repositoryHasMember;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example
  // class RepositoryHasMemberModel extends RepositoryHasMemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(RepositoryHasMemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/repositoryHasMember.ts |RepositoryHasMember SQL statements} for further information.
  //    */
  //   constructor(fields: RepositoryHasMemberFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     RepositoryHasMemberModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return RepositoryHasMemberModel.objects.filter({id: 0}) as RepositoryHasMemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return RepositoryHasMemberModel.objects.all() as RepositoryHasMemberModel[];
  //   }
  // }
}

/** @class A statement object which implements the language sql statements. */
class LanguageSO extends BaseSO {
  static statements = language;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Static Methods
  /**
   * @static
   * @description Get merged languages over all platforms.
   * @returns {object[]} A list of objects containing languages data.
   */
  static getLanguages() {
    return SOAssambler.database.exec(LanguageSO.statements.merged);
  }

  
//> Model Implementation Example
  // class LanguageModel extends LanguageSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(LanguageModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/language.ts |Language SQL statements} for further information.
  //    */
  //   constructor(fields: LanguageFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     LanguageModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return LanguageModel.objects.filter({id: 0}) as LanguageModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return LanguageModel.objects.all() as LanguageModel[];
  //   }
  // }
}

/** @class A statement object which implements the platformHasRepository sql statements. */
class PlatformHasRepositorySO extends BaseSO {
  static statements = platformHasRepository;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example
  // class PlatformHasRepositoryModel extends PlatformHasRepositorySO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(PlatformHasRepositoryModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/platformHasRepository.ts |PlatformHasRepository SQL statements} for further information.
  //    */
  //   constructor(fields: PlatformHasRepositoryFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     PlatformHasRepositoryModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return PlatformHasRepositoryModel.objects.filter({id: 0}) as PlatformHasRepositoryModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return PlatformHasRepositoryModel.objects.all() as PlatformHasRepositoryModel[];
  //   }
  // }
}

/** @class A statement object which implements the organization sql statements. */
class OrganizationSO extends BaseSO {
  static statements = organization;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Methods
  /**
   * @param cls A extended class of OrganizationSO.
   * @param self A object of the extended class.
   * @description Get all repositories belonging to a organization.
   * @returns {object[]} A list of objects containing repository data.
   */
  getRepositories(cls: any, self: any) {
    let response = cls.objects.filter(
      {
        owner: self.name
      },
      cls,
      repository.withOwner
    );

    return response;
  }

  
//> Model Implementation Example
  // class OrganizationModel extends OrganizationSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(OrganizationModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/orgaization.ts |Organization SQL statements} for further information.
  //    */
  //   constructor(fields: OrganizationFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     OrganizationModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return OrganizationModel.objects.filter({id: 0}) as OrganizationModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return OrganizationModel.objects.all() as OrganizationModel[];
  //   }
  // }
}

/** @class A statement object which implements the organizationHasMember sql statements. */
class OrganizationHasMemberSO extends BaseSO {
  static statements = organizationHasMember;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example

  // class OrganizationHasMemberModel extends OrganizationHasMemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(OrganizationHasMemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/organizationHasMember.ts |OrganizationHasMember SQL statements} for further information.
  //    */
  //   constructor(fields: OrganizationHasMemberFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     OrganizationHasMemberModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return OrganizationHasMemberModel.objects.filter({id: 0}) as OrganizationHasMemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return OrganizationHasMemberModel.objects.all() as OrganizationHasMemberModel[];
  //   }
  // }
}

/** @class A statement object which implements the platformHasOrganization sql statements. */
class PlatformHasOrganizationSO extends BaseSO {
  static statements = platformHasOrganization;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example

  // class PlatformHasOrganizationModel extends PlatformHasOrganizationSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(PlatformHasOrganizationModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/platformHasOrganization.ts |PlatformHasOrganization SQL statements} for further information.
  //    */
  //   constructor(fields: StatisticFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     PlatformHasOrganizationModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return PlatformHasOrganizationModel.objects.filter({id: 0}) as PlatformHasOrganizationModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return PlatformHasOrganizationModel.objects.all() as PlatformHasOrganizationModel[];
  //   }
  // }
}

/** @class A statement object which implements the statistic sql statements. */
class StatisticSO extends BaseSO {
  static statements = statistic;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Static Methods
  /**
   * @static
   * @param cls A extended class of StatisticSO.
   * @description Get a merged statistic over all platforms.
   * @returns {object[]} A list of objects containing statistic data.
   */
  static getMerged(cls: any) {
    let response = SOAssambler.database.exec(StatisticSO.statements.allMerged);

    // Parse to class objects
    response = response.map((entry: any) => {
      return new cls(entry);
    });

    return response;
  }

  
//> Methods
  /**
   * @param self A object of the extended class of StatisticSO.
   * @description Get a merged contributions over all platforms.
   * @returns {object[]} A list of objects containing contribution data.
   */
  getContributions(self: any) {
    let response;

    if (!self.id) {
      // maybe merged object?
      response = {
        commit: SOAssambler.database.exec(
          StatisticSO.statements.commitContributionsOfYear,
          [self.year]
        )[0] as number,
        issue: SOAssambler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as number,
        pullRequest: SOAssambler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as number,
        pullRequestReview: SOAssambler.database.exec(
          StatisticSO.statements.pullRequestReviewContributionsOfYear,
          [self.year]
        )[0] as number
      };
    }

    return response;
  }

  
//> Model Implementation Example

  // class StatisticModel extends StreakSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(StatisticModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/statistic.ts |Statistic SQL statements} for further information.
  //    */
  //   constructor(fields: StatisticFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     StatisticModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return StatisticModel.objects.filter({id: 0}) as StatisticModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return StatisticModel.objects.all() as StatisticModel[];
  //   }
  // }
}

/** @class A statement object which implements the streak sql statements. */
class StreakSO extends BaseSO {
  static statements = streak;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example

  // class StreakModel extends StreakSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(StreakModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/streak.ts |Streak SQL statements} for further information.
  //    */
  //   constructor(fields: StreakFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     StreakModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return StreakModel.objects.filter({id: 0}) as StreakModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return StreakModel.objects.all() as StreakModel[];
  //   }
  // }
}

/** @class A statement object which implements the calendar sql statements. */
class CalendarSO extends BaseSO {
  static statements = calendar;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Static Methods
  /**
   * @static
   * @param dates From and to date.
   * @description Get all days between two dates.
   * @returns {object[]} A list of objects containing day data.
   */
  static getDaysBetweenDate(dates: { from: string; to: string }) {
    let days = SOAssambler.database.exec(CalendarSO.statements.betweenDate, [
      dates.from,
      dates.to,
    ]);

    return days;
  }

  /**
   * @static
   * @param dates From and to date.
   * @description Get the busiest day between two dates.
   * @returns {object} A objects containing day data.
   */
  static getBusiestDay(dates: { from: string; to: string }) {
    let response = SOAssambler.database.exec(
      CalendarSO.statements.busiestDayBetweenDate,
      [dates.from, dates.to]
    )[0];

    return response;
  }

  /**
   * @static
   * @param dates From and to date.
   * @description Get a generated calendar containing days between from and to date.
   * @returns {object} A object containg a success and calendar data.
   */
  static getCalendar(dates: { from: string; to: string }) {
    // generate calendar
    let calendar = helper.calendar.generateCalendarStructure(
      dates.from,
      dates.to
    );

    // fill totals
    calendar.weeks.forEach((week) => {
      week.days.forEach((day) => {
        let entries = SOAssambler.database.exec(
          CalendarSO.statements.dayByDate,
          [day.date]
        );

        let total = 0;
  
        if (entries.length > 0) {
          let selectedDay = entries[0];

          total = selectedDay.total;
        }

        day.total = total;
      });
    });

    try {
      let busiestDay = CalendarSO.getBusiestDay(dates);
      let busiestDayTotal = 0;

      if (busiestDay) {
        busiestDayTotal = busiestDay.total;
      }

      helper.calendar.fillCalendarWithColors(calendar, busiestDayTotal);

      return {
        success: true,
        data: calendar
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        data: helper.calendar.generateCalendarStructure(dates.from, dates.to),
        message: "Check for data in the calendar table."
      };
    }
  }

  
//> Model Implementation Example

  // class CalendarModel extends CalendarSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(CalendarModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/calendar.ts |Calendar SQL statements} for further information.
  //    */
  //   constructor(fields: CalendarFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     CalendarModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return CalendarModel.objects.filter({id: 0}) as CalendarModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return CalendarModel.objects.all() as CalendarModel[];
  //   }
  // }
}

/** @class A statement object which implements the contribution sql statements. */
class ContributionSO extends BaseSO {
  static statements = contribution;

  /**
   * The implementation of the getObjects is necessary for any statement object implementation!
   * /

  
//> Model Implementation Example

  // class ContributionModel extends ContributionSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}), objects.all()
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/reconstructor.ts |SNEK Reconstructor} for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(ContributionModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without modifying the initialize statement of the statement object!
  //    * @see {@link http://github.com/snek-at/intel/tree/master/src/reducer/database/osm/statements/contribution.ts |Contribution SQL statements} for further information.
  //    */
  //   constructor(fields: ContributionFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL insert statement! Therefore unused fields have to be set to null!
  //    */
  //   save(){
  //     ContributionModel.objects.create({id: this.id});
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to filter the database for id=0.
  //    */
  //   getFirstItem(){
  //     return ContributionModel.objects.filter({id: 0}) as ContributionModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of models.
  //    */
  //   getAll(){
  //     return ContributionModel.objects.all() as ContributionModel[];
  //   }
  // }
}
//#endregion

//#region > Exports
export {
  BaseSO,
  PlatformSO,
  MemberSO,
  RepositorySO,
  RepositoryHasMemberSO,
  LanguageSO,
  PlatformHasRepositorySO,
  OrganizationSO,
  OrganizationHasMemberSO,
  PlatformHasOrganizationSO,
  StatisticSO,
  StreakSO,
  CalendarSO,
  ContributionSO
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
