import * as fs from 'node:fs/promises';

class DeleteContactList {
  #idCampaign;
  #idList;
  #client;
  #nameList;

  constructor(idCampaign, idList, nameList, client) {
    this.#idCampaign = idCampaign;
    this.#idList = idList;
    this.#nameList = nameList;
    this.#client = client;
  }

  get idCampaign() {return this.#idCampaign;}
  get client() {return this.#client;}
  get idList() {return this.#idList;}
  get nameList() {return this.#nameList;}

  set idCampaign(id) {this.#idCampaign = id;}
  set idList(id) {this.#idList = id;}
  set nameList(nameList) {this.#nameList = nameList;}
  set client(client) {this.#client = client;}

  /**
   * Mise à jour du nombre de contact de la campagne
   */
  async updateNbrContact() {
    // On recupere les contacts grace à l'id de leur liste liers a la campagne
    const nbrContactList = await this.#client.query(
      'SELECT "idList" FROM "campaign_has_contact" WHERE "idCampaign" = $1 AND "idList" = $2', [this.#idCampaign, this.#idList]
    );

    // On recupere le nombre total de contact de la campagne avant la suppression de la liste
    const requestNbrContact = await this.#client.query(
      'SELECT * FROM "campaign" WHERE "id" = $1', [this.#idCampaign]
    );

    // On soustrait le nombre de contact supprimer du nombre total de la liste de la campagne
    const nbrContactDeleted = requestNbrContact.rows[0].nbrContact - nbrContactList.rowCount;

    // On met a jour le nombre de contact de la campagne en prenant en compte le nombre de contact supprimer
    const updateNbrContactQuery = `UPDATE "campaign" SET "nbrContact" = $1 WHERE "id" = $2;`;
    const valuesUpdate = [nbrContactDeleted, this.#idCampaign];
    await this.#client.query(updateNbrContactQuery, valuesUpdate);
  }

  /**
   * Supprime la liste de tous les contacts grace à leur idList de cette campagne
   * @returns l'id de la liste supprimé
   */
  async deleteList() {
    const deleteListQuery = 'DELETE FROM "campaign_has_contact" WHERE "idCampaign" = $1 AND "idList" = $2 RETURNING "idList"';
    const result = await this.#client.query(deleteListQuery, [this.#idCampaign, this.#idList,]);
    return result.rows[0];
  }
  
  // Je supprime la liste de contacts invalides si il y en a une
  async deleteFileInvalidList() {
    const filePath = `invalidList/${this.#idCampaign}-${this.#nameList}.json`;
  
    try {
      // je vérifie l'existence du fichier
      await fs.access(filePath);
      // Le fichier existe, on peut donc continuer avec la suppression du fichier, si il n'existe pas, on ne fait rien
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Le fichier n'existe pas, aucune action nécessaire.
        console.log('Le fichier n\'existe pas.');
      } 
      console.log(error)
    }
  }
  
  
}
export default DeleteContactList;