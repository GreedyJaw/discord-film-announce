const api = require('./index');
/**
 * Returns films list
 * @param name
 * @returns {Promise<DataTransferItemList | *[]>}
 */
const getFilmsByName = (name) => (
  api
    .get(`/films?keyword=${encodeURI(name)}`)
    .then(res => res.data.items.length ? res.data.items : [])
);

/**
 * Returns film description
 * @param filmId
 * @returns {Promise<* | {name: string} | null>}
 */
const getFilmInfo = (filmId) => (
  api
    .get(`/films/${filmId}`)
    .then(res => res.data ? {
      ...res.data,
      name: `${res.data.nameRu || res.data.nameEn} (${res.data.year})`,
    } : null)
)

module.exports = { getFilmsByName, getFilmInfo };