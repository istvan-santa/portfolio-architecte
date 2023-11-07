/** Données WORKS de l'API
* Création d'une fonction pour récupérer les projets de l'API.
* @function worksPortfolio
*Indique le type de valeur qui indique que la fonction renvoie une promesse, pour sa disponibilité asyncrone.
* @returns {Promise}

/** la fonction worksPortfolio envoie une requête à une URL de l'API/works,
* récupère les données JSON de la réponse de la requête, puis renvoie
* ces données sous forme de promesse. */
export const worksPortfolio = async () => {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");
    const data = await reponse.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

/** Données CATEGORIES de l'API
 / @function categoriesPortfolio
 / @returns {Promise}

/** la fonction categoriesPortfolio envoie une requête à une URL de l'API/categories,
* récupère les données JSON de la réponse de la requête, puis renvoie
* ces données sous forme de promesse.
*/
const categoriesPortfolio = async () => {
  try {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const data = await reponse.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
/** Exporte les variables contenants les résultats de la variable
 *  works et categories après que la promesse soit résolue
 */
export const works = await worksPortfolio();
export const categories = await categoriesPortfolio();






/**
 * @function deleteApi
 * Envoie une requête DELETE à l'API pour supprimer un projets.
 * @param {string} idOfWorks - L'ID du projets à supprimer.
 * @param {Object} userOnline - L'objet utilisateur contenant le jeton.
 * @returns {Promise} Une promesse qui se résout avec la réponse du serveur.
 */
export const deleteApi = async (idOfWorks, userOnline) => {
  try {
    const reponse = await fetch(
      "http://localhost:5678/api/works/" + idOfWorks,

      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + userOnline.token,
        },
      }
    );
    return reponse;
  } catch (error) {
    console.error(error);
  }
};