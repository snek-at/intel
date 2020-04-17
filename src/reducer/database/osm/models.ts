//#region > Imports
//> Reconstructor
// SOAssembler for SO objects
import { SOAssembler } from "./reconstructor";
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
//#endregion

/**
 * Implementation examples of the statement objects defined below.
 *
 * @see {@link https://bit.ly/3eu58YP |SNEK Models} for implementation
 *       examples.
 */

//#region > Interfaces
//#endregion

//#region > Classes
/**
 * @abstract
 * @class A basic statement object class which provides access
 *        to the SOAssembler and squeezer. 
 */
abstract class BaseSO {
  //> Static Fields
  /**
   * @static
   * @description Provides access to the SOAssembler to provide functionality
   *              like create, all, filter,...
   * @tutorial Usage: "public static objects =
   *                   StatementObject.getObjects(osmModel);"
   */
  static objects: SOAssembler;

  //> Abstract Fields
  /**
   * @description Necessary for database processing.
   */
  abstract id: number;

  //> Abstract Methods
  /**
   * @returns {Boolean} A check if the database write process was successful.
   * @description Writes the statement object to the databse.
   */
  abstract save(): void;

  /**
   * @description Necessary for interacting with the SOAssambler on object
   *              level.
   */
  abstract objects: SOAssembler;

  //> Static Methods
  /**
   * @static
   * @param self A implementation of a statement object.
   * @returns {SOAssembler} A SOAssembler object.
   * @description Generate a new SOAssembler object, with the provided osm
   *              model.
   */
  static getObjects(self: any) {
    return new SOAssembler(self);
  }

  //> Methods
  /**
   * Render object.
   *
   * @param filter List of keys to filter by.
   * @returns {any} The filtered object.
   * @description Filter the object by a list of keys.
   */
  render(filter: string[]): any {
    return helper.general.squeezer(this, filter);
  }
}

/**
 * @abstract
 * @class A statement object which implements the platform sql statements.
 */
abstract class PlatformSO extends BaseSO {
  //> Static Fields
  static statements = platform;

  //> Static Methods
  /**
   * @static
   * @description Get the platform with the lowest createdAt.
   * @returns {object} A object containing platform data with the
   *                   lowest creation date.
   */
  static getLowestCreatedAtYear() {
    return SOAssembler.database.exec(
      PlatformSO.statements.lowestCreatedAtYear
    )[0];
  }

  //> Abstract Methods
  /**
   * @param fields Repository data.
   * @returns {RepositorySO} A repository SO object.
   * @description Used to create a repository within the platform.
   */
  abstract createRepository(fields: any): RepositorySO;

  /**
   * @param fields Organization data.
   * @returns {OrganizationSO} A organization SO object.
   * @description Used to create a organization within the platform.
   */
  abstract createOrganization(fields: any): OrganizationSO;

  /**
   * @param fields Statistic data.
   * @returns {StatisticSO} A statistic SO object.
   * @description Used to create a statistic within the platform.
   */
  abstract createStatistic(fields: any): StatisticSO;

  /**
   * @param fields Caledar entry data.
   * @returns {CalendarSO} A calendar SO object.
   * @description Used to create a calendar day within the platform.
   */
  abstract createCalendarEntry(fields: any): CalendarSO;

  /**
   * @returns {RepositorySO[]} A list of repository SO objects.
   * @description Used to get all repositories within the platform.
   */
  abstract getRepositories(fields: any): RepositorySO[];

  /**
   * @returns {OrganizationSO[]} A list of organization SO objects.
   * @description Used to get all organizations within the platform.
   */
  abstract getOrganizations(fields: any): OrganizationSO[];

  /**
   * @returns {Object} A calendar structure in any format.
   * @description Used to get all repositories within the platform.
   */
  abstract getCalendar(dates: any): object;

  //> Model Implementation Example
  // class PlatformModel extends PlatformSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2KgKi0R |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(PlatformModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/3eqFFPO |Platform SQL statements}
  //    *       for further information.
  //    */
  //   constructor(fields: PlatformFields){
  //     super();
  //
  //     this.id = fields.id;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to save the object to the database.
  //    * Only fields defined in the constructor will be saved!
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
  //    *
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return PlatformModel.objects.all() as PlatformModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the member sql statements.
 */
abstract class MemberSO extends BaseSO {
  //> Static Fields
  static statements = member;

  //> Model Implementation Example
  //  class MemberModel extends MemberSO{
  //  /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2z7epWs |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //  public static objects = PlatformSO.getObjects(MemberModel);

  //  /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/2VfhPiD |Member SQL statements} for further
  //    *       information.
  //    */
  //    constructor(fields: MemberFields){
  //      super();
  
  //      this.id = fields.id;
  //    }

  //    /**
  //      * Example method:
  //      *
  //      * @description A method to save the object to the database.
  //      * Only fields defined in the constructor will be saved!
  //      * IMPORTANT!: The fields in objects.create() have to match the SQL
  //      *             insert statement! Therefore unused fields have to be set
  //      *             to null!
  //      *
  //      */
  //    save(){
  //      MemberModel.objects.create({id: this.id});
  //    }

  //    /**
  //      * Example method:
  //      *
  //      * @description A method to filter the database for id=0.
  //      */
  //    getFirstItem(){
  //      return MemberModel.objects.filter({id: 0}) as MemberModel;
  //    }

  //    /**
  //      * Example method:
  //      *
  //      * @description A method to get all entries and parse it to a list of
  //      *              models.
  //      */
  //    getAll(){
  //      return MemberModel.objects.all() as MemberModel[];
  //    }
  //  }
}

/**
 * @abstract
 * @class A statement object which implements the repository sql statements.
 */
abstract class RepositorySO extends BaseSO {
  //> Static Fields
  static statements = repository;

  //> Static Methods
  /**
   * @static
   * @returns {Object[]} List of language data objects.
   * @description Returns a list of merged language data.
   */
  static getLanguages() {
    return SOAssembler.database.exec(LanguageSO.statements.merged);
  }

  //> Abstract Methods
  /**
   * @param fields Statistic data.
   * @returns {MemberSO} A member SO object.
   * @description Used to create a member within the repository.
   */
  abstract createMember(fields: any): MemberSO;

  /**
   * @param fields Language data.
   * @returns {MemberSO} A language SO object.
   * @description Used to create a language within the repository.
   */
  abstract createLanguage(fields: any): LanguageSO;

  /**
   * @returns {MemberSO[]} A list of member SO objects.
   * @description Used to get all members within the repository.
   */
  abstract getMembers(fields: any): MemberSO[];

  /**
   * @returns {LanguageSO[]} A list of language SO objects.
   * @description Used to get all languages within the repository.
   */
  abstract getLanguages(fields: any): LanguageSO[];

  //> Model Implementation Example
  // class RepositoryModel extends RepositorySO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/34GtpX3 |SNEK Reconstructor} for further
  //    *       information.
  //    */
  //   public static objects = PlatformSO.getObjects(RepositoryModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/2wOO5Qa |Repository SQL statements} for
  //    *       further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return RepositoryModel.objects.all() as RepositoryModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the platformHasMember sql
 *        statements.
 */
abstract class RepositoryHasMemberSO extends BaseSO {
  //> Static Fields
  static statements = repositoryHasMember;

  //> Model Implementation Example
  // class RepositoryHasMemberModel extends RepositoryHasMemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *       information.
  //    */
  //   public static objects = PlatformSO.getObjects(RepositoryHasMemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/34LLjHN |RepositoryHasMember SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //     return RepositoryHasMemberModel.objects.filter({id: 0})
  //              as RepositoryHasMemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return RepositoryHasMemberModel.objects.all()
  //              as RepositoryHasMemberModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the language sql statements.
 */
abstract class LanguageSO extends BaseSO {
  //> Static Fields
  static statements = language;

  //> Model Implementation Example
  // class LanguageModel extends LanguageSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *       information.
  //    */
  //   public static objects = PlatformSO.getObjects(LanguageModel);

  //   /**
  //    * Fields may contain all fields defined by the database
  //    * table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //               modifying the initialize statement of the statement
  //               object!
  //    * @see {@link https://bit.ly/2K7zAd8 |Language SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    models.
  //    */
  //   getAll(){
  //     return LanguageModel.objects.all() as LanguageModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the platformHasRepository
 *        sql statements.
 */
abstract class PlatformHasRepositorySO extends BaseSO {
  //> Static Fields
  static statements = platformHasRepository;

  //> Model Implementation Example
  // class PlatformHasRepositoryModel extends PlatformHasRepositorySO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *       information.
  //    */
  //   public static objects =
  //                          PlatformSO.getObjects(PlatformHasRepositoryModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/3cAuD99 |PlatformHasRepository SQL
  //    *                                     statements} for further
  //    *                                     information.
  //    *
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //     return PlatformHasRepositoryModel.objects.filter({id: 0})
  //              as PlatformHasRepositoryModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list
  //    *              of models.
  //    */
  //   getAll(){
  //     return PlatformHasRepositoryModel.objects.all()
  //              as PlatformHasRepositoryModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the organization sql statements.
 */
abstract class OrganizationSO extends BaseSO {
  //> Static Fields
  static statements = organization;

  //> Abstract Methods
  /**
   * @abstract
   * @param fields Member data.
   * @returns {MemberSO} A member SO object.
   * @description Create a member within this organization.
   */
  abstract createMember(fields: any): MemberSO;

  /**
   * @abstract
   * @returns {MemberSO[]} A list of member SO objects.
   * @description Get all members within this organization.
   */
  abstract getMembers(): MemberSO[];

  /**
   * @abstract
   * @returns {RepositorySO[]} A list of repository SO objects.
   * @description Get all repositories within this organization.
   */
  abstract getRepositories(): RepositorySO[];

  //> Model Implementation Example
  // class OrganizationModel extends OrganizationSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor} for further
  //    *       information.
  //    */
  //   public static objects = PlatformSO.getObjects(OrganizationModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/2Ka0fGh |Organization SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return OrganizationModel.objects.all() as OrganizationModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the organizationHasMember sql
 *        statements.
 */
abstract class OrganizationHasMemberSO extends BaseSO {
  //> Static Fields
  static statements = organizationHasMember;

  //> Model Implementation Example
  // class OrganizationHasMemberModel extends OrganizationHasMemberSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects =
  //                          PlatformSO.getObjects(OrganizationHasMemberModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/34OKcY4 |OrganizationHasMember SQL
  //    *                                     statements} for further
  //    *                                     information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //     return OrganizationHasMemberModel.objects.filter({id: 0})
  //              as OrganizationHasMemberModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return OrganizationHasMemberModel.objects.all()
  //              as OrganizationHasMemberModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the platformHasOrganization sql
 *        statements.
 */
abstract class PlatformHasOrganizationSO extends BaseSO {
  //> Static Fields
  static statements = platformHasOrganization;

  //> Model Implementation Example
  // class PlatformHasOrganizationModel extends PlatformHasOrganizationSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects =
  //                       PlatformSO.getObjects(PlatformHasOrganizationModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/2VDx5Ve |PlatformHasOrganization SQL
  //    *                                     statements} for further
  //    *                                     information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //     return PlatformHasOrganizationModel.objects.filter({id: 0})
  //              as PlatformHasOrganizationModel;
  //   }

  //   /**
  //    * Example method:
  //    *
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return PlatformHasOrganizationModel.objects.all()
  //              as PlatformHasOrganizationModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the statistic sql statements.
 */
abstract class StatisticSO extends BaseSO {
  //> Static Fields
  static statements = statistic;

  //> Static Methods
  /**
   * @static
   * @param cls A extended class of StatisticSO.
   * @description Get a merged statistic over all platforms.
   * @returns {Object[]} A list of objects containing statistic data.
   */
  static getMerged(cls: any) {
    let response = SOAssembler.database.exec(StatisticSO.statements.allMerged);

    // Parse to class objects
    response = response.map((entry: any) => {
      return new cls(entry);
    });

    return response;
  }

  /**
   * @static
   * @param self A object of the extended class of StatisticSO.
   * @description Get a merged contributions over all platforms.
   * @returns {object[]} A list of objects containing contribution data.
   */
  static getContributions(self: any) {
    let response;

    if (!self.id) {
      response = {
        commit: SOAssembler.database.exec(
          StatisticSO.statements.commitContributionsOfYear,
          [self.year]
        )[0] as number,
        issue: SOAssembler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as number,
        pullRequest: SOAssembler.database.exec(
          StatisticSO.statements.issueContributionsOfYear,
          [self.year]
        )[0] as number,
        pullRequestReview: SOAssembler.database.exec(
          StatisticSO.statements.pullRequestReviewContributionsOfYear,
          [self.year]
        )[0] as number,
      };
    }

    return response;
  }

  //> Abstract Methods
  /**
   * @param fields Streak data.
   * @returns {MemberSO} A streak SO object.
   * @description Used to create a streak within the statistic.
   */
  abstract createStreak(fields: any): StreakSO;

  /**
   * @returns {StreakSO[]} A streak SO object.
   * @description Used to get all streaks within the statistic.
   */
  abstract getStreaks(): StreakSO[];

  /**
   * @returns {StreakSO[]} The longest and current streak SO objects.
   * @description Used to calculate all the longest and current streak.
   */
  abstract getStreakDetail(
    streaks: StreakSO[]
  ): { longest: StreakSO; current: StreakSO };

  /**
   * @returns {CalendarSO} A calendar SO object.
   * @description Used to calculate the busiest day within a statistic year.
   */
  abstract getBusiestDay(): CalendarSO;

  /**
   * @returns {Object} A object containing contribution type totals.
   * @description Used to calculate contribution count of the different types
   *              in a statistic year.
   */
  abstract getContributions(): {
    commit: number;
    issue: number;
    pullRequest: number;
    pullRequestReview: number;
  };

  //> Model Implementation Example
  // class StatisticModel extends StreakSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(StatisticModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/3aeo9Lr |Statistic SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return StatisticModel.objects.all() as StatisticModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the streak sql statements.
 */
abstract class StreakSO extends BaseSO {
  //> Static Fields
  static statements = streak;

  //> Model Implementation Example
  // class StreakModel extends StreakSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(StreakModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement 
  //    *          object!
  //    * @see {@link https://bit.ly/2yhpDY6 |Streak SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return StreakModel.objects.all() as StreakModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the calendar sql statements.
 */
abstract class CalendarSO extends BaseSO {
  //> Static Fields
  static statements = calendar;

  //> Static Methods
  /**
   * @static
   * @param dates From and to date.
   * @description Get all days between two dates.
   * @returns {object[]} A list of objects containing day data.
   */
  static getDaysBetweenDate(dates: { from: string; to: string }) {
    let days = SOAssembler.database.exec(CalendarSO.statements.betweenDate, [
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
    let response = SOAssembler.database.exec(
      CalendarSO.statements.busiestDayBetweenDate,
      [dates.from, dates.to]
    )[0];

    return response;
  }

  /**
   * @static
   * @param dates From and to date.
   * @description Get a generated calendar containing days between from and to
   *              date.
   * @returns {object} A object containing a success and calendar data.
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
        let entries = SOAssembler.database.exec(
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
        data: calendar,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        data: helper.calendar.generateCalendarStructure(dates.from, dates.to),
        message: "Check for data in the calendar table.",
      };
    }
  }

  //> Abstract Methods
  /**
   * @param fields Contribution data.
   * @returns {MemberSO} A contribution SO object.
   * @description Used to create a contribution within the calendar day.
   */
  abstract createContribution(fields: any): ContributionSO;

  //> Model Implementation Example
  // class CalendarModel extends CalendarSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(CalendarModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/3clyGpB |Calendar SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
  //    */
  //   getAll(){
  //     return CalendarModel.objects.all() as CalendarModel[];
  //   }
  // }
}

/**
 * @abstract
 * @class A statement object which implements the contribution sql statements.
 */
abstract class ContributionSO extends BaseSO {
  //> Static Fields
  static statements = contribution;

  //> Model Implementation Example
  // class ContributionModel extends ContributionSO{
  //   /**
  //    * General usage: objects.create({fields}), objects.filter({id=1}),
  //    *                objects.all()
  //    * @see {@link https://bit.ly/2Vxq1tu |SNEK Reconstructor}
  //    *       for further information.
  //    */
  //   public static objects = PlatformSO.getObjects(ContributionModel);

  //   /**
  //    * Fields may contain all fields defined by the database table.
  //    * Notice!: The NOT NULL fields are strictly required!
  //    * Also custom fields are possible too.
  //    * Notice!: Custom field cannot be saved in the database without
  //    *          modifying the initialize statement of the statement
  //    *          object!
  //    * @see {@link https://bit.ly/2XGCIVu |Contribution SQL statements}
  //    *       for further information.
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
  //    * IMPORTANT!: The fields in objects.create() have to match the SQL
  //    *             insert statement! Therefore unused fields have to be set
  //    *             to null!
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
  //    * @description A method to get all entries and parse it to a list of
  //    *              models.
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
  ContributionSO,
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
